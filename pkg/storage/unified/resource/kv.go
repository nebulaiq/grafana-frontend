package resource

import (
	"database/sql"

	badger "github.com/dgraph-io/badger/v4"

	"github.com/grafana/grafana/pkg/storage/unified/resource/kv"
)

// Re-export types from kv package for backward compatibility
type KV = kv.KV
type KeyValue = kv.KeyValue
type ListOptions = kv.ListOptions
type SortOrder = kv.SortOrder

const (
	SortOrderAsc  = kv.SortOrderAsc
	SortOrderDesc = kv.SortOrderDesc
)

// Re-export errors
var ErrNotFound = kv.ErrNotFound

// Re-export functions
var (
	PrefixRangeEnd = kv.PrefixRangeEnd
	IsValidKey     = kv.IsValidKey
)

// NewBadgerKV creates a new BadgerDB-backed KV store
func NewBadgerKV(db *badger.DB) *kv.BadgerKV {
	return kv.NewBadgerKV(db)
}

// NewSQLKV creates a new SQL-backed KV store
func NewSQLKV(db *sql.DB, driverName string) (KV, error) {
	return kv.NewSQLKV(db, driverName)
}
