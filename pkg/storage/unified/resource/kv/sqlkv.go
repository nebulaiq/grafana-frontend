package kv

import (
	"bytes"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"io"
	"iter"
	"strings"
	"time"

	"github.com/google/uuid"
)

var _ KV = &SQLKV{}

type SQLKV struct {
	db         *sql.DB
	dialect    Dialect
	driverName string // TODO: remove when backwards compatibility is no longer needed.
}

func NewSQLKV(db *sql.DB, driverName string) (KV, error) {
	if db == nil {
		return nil, fmt.Errorf("db is required")
	}

	dialect, err := DialectFromDriver(driverName)
	if err != nil {
		return nil, err
	}

	return &SQLKV{
		db:         db,
		dialect:    dialect,
		driverName: driverName, // for usage in datastore
	}, nil
}

// DriverName returns the driver name for backwards compatibility with datastore
func (k *SQLKV) DriverName() string {
	return k.driverName
}

// getQueryBuilder creates a query builder for the given section
func (k *SQLKV) getQueryBuilder(section string) (*QueryBuilder, error) {
	if section == "" {
		return nil, fmt.Errorf("section is required")
	}

	if section != DataSection && section != EventsSection {
		return nil, fmt.Errorf("invalid section: %s", section)
	}

	tableName := "resource_events"
	if section == DataSection {
		tableName = "resource_history"
	}

	return NewQueryBuilder(k.dialect, tableName), nil
}

// getKeyPath constructs a full key path from section and key
func getKeyPath(section, key string) string {
	return section + "/" + key
}

// getKeyPaths constructs full key paths from section and keys
func getKeyPaths(section string, keys []string) []string {
	result := make([]string, len(keys))
	for i, key := range keys {
		result[i] = getKeyPath(section, key)
	}
	return result
}

func (k *SQLKV) Ping(ctx context.Context) error {
	return k.db.PingContext(ctx)
}

func (k *SQLKV) Keys(ctx context.Context, section string, opt ListOptions) iter.Seq2[string, error] {
	return func(yield func(string, error) bool) {
		qb, err := k.getQueryBuilder(section)
		if err != nil {
			yield("", err)
			return
		}

		startKey := section + "/" + opt.StartKey
		endKey := opt.EndKey
		if endKey == "" {
			endKey = PrefixRangeEnd(section + "/")
		} else {
			endKey = section + "/" + endKey
		}

		sortAsc := opt.Sort != SortOrderDesc

		query, args := qb.BuildKeysQuery(startKey, endKey, sortAsc, opt.Limit)
		rows, err := k.db.QueryContext(ctx, query, args...)
		if err != nil {
			yield("", err)
			return
		}
		defer closeRows(rows, yield)

		for rows.Next() {
			var key string
			if err := rows.Scan(&key); err != nil {
				yield("", fmt.Errorf("error reading row: %w", err))
				return
			}

			if !yield(strings.TrimPrefix(key, section+"/"), nil) {
				return
			}
		}

		if err := rows.Err(); err != nil {
			yield("", fmt.Errorf("failed to read rows: %w", err))
		}
	}
}

func (k *SQLKV) Get(ctx context.Context, section string, key string) (io.ReadCloser, error) {
	if key == "" {
		return nil, fmt.Errorf("key is required")
	}

	qb, err := k.getQueryBuilder(section)
	if err != nil {
		return nil, err
	}

	keyPath := getKeyPath(section, key)
	query, args := qb.BuildGetQuery(keyPath)
	row := k.db.QueryRowContext(ctx, query, args...)

	var value []byte
	if err := row.Scan(&value); err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrNotFound
		}
		return nil, fmt.Errorf("failed to get key: %w", err)
	}

	return io.NopCloser(bytes.NewReader(value)), nil
}

func (k *SQLKV) BatchGet(ctx context.Context, section string, keys []string) iter.Seq2[KeyValue, error] {
	return func(yield func(KeyValue, error) bool) {
		if len(keys) == 0 {
			return
		}

		qb, err := k.getQueryBuilder(section)
		if err != nil {
			yield(KeyValue{}, err)
			return
		}

		keyPaths := getKeyPaths(section, keys)
		query, args := qb.BuildBatchGetQuery(keyPaths)
		rows, err := k.db.QueryContext(ctx, query, args...)
		if err != nil {
			yield(KeyValue{}, err)
			return
		}
		defer closeRows(rows, yield)

		for rows.Next() {
			var key string
			var value []byte
			if err := rows.Scan(&key, &value); err != nil {
				yield(KeyValue{}, fmt.Errorf("error reading row: %w", err))
				return
			}

			kv := KeyValue{
				Key:   strings.TrimPrefix(key, section+"/"),
				Value: io.NopCloser(bytes.NewReader(value)),
			}
			if !yield(kv, nil) {
				return
			}
		}

		if err := rows.Err(); err != nil {
			yield(KeyValue{}, fmt.Errorf("failed to read rows: %w", err))
		}
	}
}

func (k *SQLKV) Save(ctx context.Context, section string, key string) (io.WriteCloser, error) {
	if section == "" {
		return nil, fmt.Errorf("section is required")
	}
	if section != DataSection && section != EventsSection {
		return nil, fmt.Errorf("invalid section: %s", section)
	}
	if key == "" {
		return nil, fmt.Errorf("key is required")
	}

	return &sqlWriteCloser{
		kv:      k,
		ctx:     ctx,
		section: section,
		key:     key,
		buf:     &bytes.Buffer{},
		closed:  false,
	}, nil
}

type sqlWriteCloser struct {
	kv      *SQLKV
	ctx     context.Context
	section string
	key     string
	buf     *bytes.Buffer
	closed  bool
}

func (w *sqlWriteCloser) Write(value []byte) (int, error) {
	if w.closed {
		return 0, errors.New("write to closed writer")
	}

	return w.buf.Write(value)
}

func (w *sqlWriteCloser) Close() error {
	if w.closed {
		return nil
	}

	w.closed = true
	value := w.buf.Bytes()
	if value == nil {
		// to prevent NOT NULL constraint violations
		value = []byte{}
	}

	qb, err := w.kv.getQueryBuilder(w.section)
	if err != nil {
		return err
	}

	keyPath := getKeyPath(w.section, w.key)

	// do regular kv save: simple key_path + value insert with conflict check.
	// can only do this on resource_events for now, until we drop the columns in resource_history
	if w.section == EventsSection {
		query, args := qb.BuildUpsertQuery(keyPath, value)
		_, err := w.kv.db.ExecContext(w.ctx, query, args...)
		if err != nil {
			return fmt.Errorf("failed to save: %w", err)
		}
		return nil
	}

	// Check if storage_backend injected a transaction (for backward-compatibility mode)
	tx, ok := TxFromCtx(w.ctx)
	if !ok {
		// Non-backwards-compatible mode: simple insert/update
		// This can be simplified once resource_history columns are dropped
		_, err := w.kv.Get(w.ctx, w.section, w.key)
		if errors.Is(err, ErrNotFound) {
			query, args := qb.BuildInsertDatastoreQuery(keyPath, value, uuid.New().String())
			_, err := w.kv.db.ExecContext(w.ctx, query, args...)
			if err != nil {
				return fmt.Errorf("failed to insert to datastore: %w", err)
			}
			return nil
		}

		if err != nil {
			return fmt.Errorf("failed to get for save: %w", err)
		}

		query, args := qb.BuildUpdateDatastoreQuery(keyPath, value)
		_, err = w.kv.db.ExecContext(w.ctx, query, args...)
		if err != nil {
			return fmt.Errorf("failed to update to datastore: %w", err)
		}

		return nil
	}

	// Backwards-compatible mode: minimal INSERT with only guid and value
	// The rvmanager will set key_path at the end of the transaction
	// The datastore's applyBackwardsCompatibleChanges() will populate other fields
	// Parse key to extract GUID (but don't parse all fields - that's done in datastore)
	dataKey, err := ParseKeyWithGUID(w.key)
	if err != nil {
		return fmt.Errorf("failed to parse key for GUID: %w", err)
	}

	// Convert action string to numeric value for database
	// This is required for rvmanager to construct key_path correctly
	var action int64
	switch dataKey.Action {
	case DataActionCreated:
		action = 1
	case DataActionUpdated:
		action = 2
	case DataActionDeleted:
		action = 3
	default:
		return fmt.Errorf("invalid action: %s", dataKey.Action)
	}

	query, args := qb.BuildInsertDatastoreBackwardCompatQuery(value, dataKey.GUID, dataKey.Group, dataKey.Resource, dataKey.Namespace, dataKey.Name, dataKey.Folder, action)
	_, err = tx.ExecContext(w.ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to save to resource_history: %w", err)
	}

	return nil
}

func (k *SQLKV) Delete(ctx context.Context, section string, key string) error {
	if key == "" {
		return fmt.Errorf("key is required")
	}

	qb, err := k.getQueryBuilder(section)
	if err != nil {
		return err
	}

	keyPath := getKeyPath(section, key)
	query, args := qb.BuildDeleteQuery(keyPath)
	res, err := k.db.ExecContext(ctx, query, args...)
	if err != nil {
		return fmt.Errorf("failed to delete key: %w", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to validate delete: %w", err)
	}

	if rows == 0 {
		return ErrNotFound
	}

	return nil
}

func (k *SQLKV) BatchDelete(ctx context.Context, section string, keys []string) error {
	if len(keys) == 0 {
		return nil
	}

	qb, err := k.getQueryBuilder(section)
	if err != nil {
		return err
	}

	keyPaths := getKeyPaths(section, keys)
	query, args := qb.BuildBatchDeleteQuery(keyPaths)
	if _, err := k.db.ExecContext(ctx, query, args...); err != nil {
		return fmt.Errorf("failed to batch delete keys: %w", err)
	}

	return nil
}

func (k *SQLKV) UnixTimestamp(ctx context.Context) (int64, error) {
	return time.Now().Unix(), nil
}

func closeRows[T any](rows *sql.Rows, yield func(T, error) bool) {
	if err := rows.Close(); err != nil {
		var zero T
		yield(zero, fmt.Errorf("error closing rows: %w", err))
	}
}
