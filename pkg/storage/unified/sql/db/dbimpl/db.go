package dbimpl

import (
	"context"
	"database/sql"

	"github.com/grafana/grafana/pkg/storage/unified/sql/db"
)

// dbUnwrapper is an interface for db.DB wrappers that can return their underlying DB.
type dbUnwrapper interface {
	UnwrapDB() db.DB
}

// GetSqlDB extracts the underlying *sql.DB from a db.DB instance.
// This is used by code that needs direct access to stdlib database/sql methods.
// It handles wrapped DBs (like the otel instrumented wrapper) by recursively unwrapping.
// Returns nil and false if the underlying *sql.DB cannot be found.
func GetSqlDB(d db.DB) (*sql.DB, bool) {
	// Try direct type assertion first
	if impl, ok := d.(sqlDB); ok {
		return impl.DB, true
	}

	// Check if this is a wrapper that can be unwrapped
	if wrapper, ok := d.(dbUnwrapper); ok {
		return GetSqlDB(wrapper.UnwrapDB())
	}

	return nil, false
}

// NewDB converts a *sql.DB to a db.DB.
func NewDB(d *sql.DB, driverName string) db.DB {
	ret := sqlDB{
		DB:         d,
		driverName: driverName,
	}
	ret.WithTxFunc = db.NewWithTxFunc(ret.BeginTx)

	return ret
}

type sqlDB struct {
	*sql.DB
	db.WithTxFunc
	driverName string
}

func (d sqlDB) DriverName() string {
	return d.driverName
}

// SqlDB returns the underlying *sql.DB.
// Note: This method is not part of the db.DB interface.
// Use GetSqlDB() function instead for external access.
func (d sqlDB) SqlDB() *sql.DB {
	return d.DB
}

func (d sqlDB) QueryContext(ctx context.Context, query string, args ...any) (db.Rows, error) {
	return d.DB.QueryContext(ctx, query, args...)
}

func (d sqlDB) QueryRowContext(ctx context.Context, query string, args ...any) db.Row {
	return d.DB.QueryRowContext(ctx, query, args...)
}

func (d sqlDB) BeginTx(ctx context.Context, opts *sql.TxOptions) (db.Tx, error) {
	tx, err := d.DB.BeginTx(ctx, opts)
	if err != nil {
		return nil, err
	}
	return sqlTx{tx}, err
}

type sqlTx struct {
	*sql.Tx
}

// NewTx wraps an existing *sql.Tx with sqlTx
func NewTx(tx *sql.Tx) db.Tx {
	return sqlTx{tx}
}

func (tx sqlTx) QueryContext(ctx context.Context, query string, args ...any) (db.Rows, error) {
	// // codeql-suppress go/sql-query-built-from-user-controlled-sources "The query comes from a safe template source
	// and the parameters are passed as arguments."
	return tx.Tx.QueryContext(ctx, query, args...)
}

func (tx sqlTx) QueryRowContext(ctx context.Context, query string, args ...any) db.Row {
	// // codeql-suppress go/sql-query-built-from-user-controlled-sources "The query comes from a safe template source
	// and the parameters are passed as arguments."
	return tx.Tx.QueryRowContext(ctx, query, args...)
}
