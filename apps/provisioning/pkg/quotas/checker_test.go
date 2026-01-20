package quotas

import (
	"context"
	"testing"

	"github.com/stretchr/testify/require"
)

func TestNewUnlimitedQuotaChecker(t *testing.T) {
	checker := NewUnlimitedQuotaChecker()
	require.NotNil(t, checker)
	require.IsType(t, &UnlimitedQuotaChecker{}, checker)
}

func TestUnlimitedQuotaChecker_CheckResourceQuota(t *testing.T) {
	checker := NewUnlimitedQuotaChecker()
	ctx := context.Background()

	allowed, err := checker.CheckResourceQuota(ctx, "test-namespace")
	require.NoError(t, err)
	require.True(t, allowed)

	// Test with different namespace
	allowed, err = checker.CheckResourceQuota(ctx, "another-namespace")
	require.NoError(t, err)
	require.True(t, allowed)

	// Test with empty namespace
	allowed, err = checker.CheckResourceQuota(ctx, "")
	require.NoError(t, err)
	require.True(t, allowed)
}

func TestUnlimitedQuotaChecker_OnResourceCreated(t *testing.T) {
	checker := NewUnlimitedQuotaChecker()
	ctx := context.Background()

	err := checker.OnResourceCreated(ctx, "test-namespace")
	require.NoError(t, err)

	// Test with different namespace
	err = checker.OnResourceCreated(ctx, "another-namespace")
	require.NoError(t, err)

	// Test with empty namespace
	err = checker.OnResourceCreated(ctx, "")
	require.NoError(t, err)
}

func TestUnlimitedQuotaChecker_OnResourceDeleted(t *testing.T) {
	checker := NewUnlimitedQuotaChecker()
	ctx := context.Background()

	err := checker.OnResourceDeleted(ctx, "test-namespace")
	require.NoError(t, err)

	// Test with different namespace
	err = checker.OnResourceDeleted(ctx, "another-namespace")
	require.NoError(t, err)

	// Test with empty namespace
	err = checker.OnResourceDeleted(ctx, "")
	require.NoError(t, err)
}
