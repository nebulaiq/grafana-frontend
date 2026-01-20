package quotas

import (
	"context"
)

//go:generate mockery --name QuotaChecker --structname MockQuotaChecker --inpackage --filename quota_checker_mock.go --with-expecter

// QuotaChecker checks resource quota and tracks resource creation and deletion
type QuotaChecker interface {
	// CheckResourceQuota checks if a new resource can be created in the given namespace.
	// Returns true if the resource can be created, false otherwise.
	// Returns an error if the check cannot be performed.
	CheckResourceQuota(ctx context.Context, namespace string) (bool, error)

	// OnResourceCreated updates the quota tracker when a resource is created in the given namespace.
	// This should be called after a resource is successfully created.
	OnResourceCreated(ctx context.Context, namespace string) error

	// OnResourceDeleted updates the quota tracker when a resource is deleted from the given namespace.
	// This should be called after a resource is successfully deleted.
	OnResourceDeleted(ctx context.Context, namespace string) error
}

// UnlimitedQuotaChecker is a QuotaChecker implementation that always allows resource creation
// and does not track resource counts
type UnlimitedQuotaChecker struct{}

// NewUnlimitedQuotaChecker creates a new UnlimitedQuotaChecker
func NewUnlimitedQuotaChecker() *UnlimitedQuotaChecker {
	return &UnlimitedQuotaChecker{}
}

// CheckResourceQuota always returns true, allowing unlimited resource creation
func (u *UnlimitedQuotaChecker) CheckResourceQuota(ctx context.Context, namespace string) (bool, error) {
	return true, nil
}

// OnResourceCreated is a no-op for UnlimitedQuotaChecker as it doesn't track resources
func (u *UnlimitedQuotaChecker) OnResourceCreated(ctx context.Context, namespace string) error {
	return nil
}

// OnResourceDeleted is a no-op for UnlimitedQuotaChecker as it doesn't track resources
func (u *UnlimitedQuotaChecker) OnResourceDeleted(ctx context.Context, namespace string) error {
	return nil
}
