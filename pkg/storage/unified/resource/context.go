package resource

import (
	"context"
	"database/sql"
)

// TxExecer is a minimal interface for executing SQL within a transaction.
// Both *sql.Tx and Grafana's db.Tx satisfy this interface because
// db.Result is a type alias for sql.Result.
type TxExecer interface {
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
}

type txContextKey string

const txKey txContextKey = "kv_db_tx"

// ContextWithTx stores a transaction executor in the context.
// This is used by storage_backend.go to pass a transaction to sqlkv for
// backwards-compatibility mode operations.
func ContextWithTx(ctx context.Context, tx TxExecer) context.Context {
	return context.WithValue(ctx, txKey, tx)
}

// TxFromCtx retrieves a transaction executor from the context.
// Returns nil and false if no transaction is present.
func TxFromCtx(ctx context.Context) (TxExecer, bool) {
	tx, ok := ctx.Value(txKey).(TxExecer)
	return tx, ok
}
