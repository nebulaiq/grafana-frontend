import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { Stack, Text, Tooltip, useStyles2 } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';

export interface CustomerBrandingProps {
  variant?: 'full' | 'compact';
}

/**
 * CustomerBranding Component
 *
 * Displays customer logo + NebulaIQ co-branding in the top bar.
 * Shows customer identity while maintaining NebulaIQ powered-by attribution.
 *
 * Logo Upload Instructions:
 * 1. Place customer logo in: public/img/customer-logos/{org-name}.svg
 * 2. Update org record: UPDATE org SET logo_url = '/public/img/customer-logos/{org-name}.svg' WHERE id = {org-id};
 * 3. Recommended logo size: 32x32px to 48x48px (SVG preferred)
 */
export function CustomerBranding({ variant = 'full' }: CustomerBrandingProps) {
  const styles = useStyles2(getStyles);
  const currentOrg = contextSrv.user.orgName;

  // Get customer logo from org settings
  // In a full implementation, this would come from the org object via API
  // For now, we'll construct the path based on org name
  const customerLogoPath = getCustomerLogoPath(currentOrg);

  const displayFormat = getDisplayFormat(currentOrg);

  if (variant === 'compact') {
    return (
      <Tooltip content={displayFormat.tooltip}>
        <Stack gap={1} alignItems="center" className={styles.compactContainer}>
          {customerLogoPath && (
            <img
              src={customerLogoPath}
              alt={currentOrg}
              className={styles.customerLogoCompact}
              onError={(e) => {
                // Hide image if logo doesn't exist
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className={styles.brandTextCompact}>
            <Text truncate className={styles.customerName}>{displayFormat.shortName}</Text>
          </div>
        </Stack>
      </Tooltip>
    );
  }

  return (
    <Stack gap={1.5} alignItems="center" className={styles.container}>
      {/* Customer Logo */}
      {customerLogoPath && (
        <img
          src={customerLogoPath}
          alt={currentOrg}
          className={styles.customerLogo}
          onError={(e) => {
            // Hide image if logo doesn't exist
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      {/* Branding Text */}
      <div className={styles.brandText}>
        <Text truncate className={styles.customerName}>
          {displayFormat.customerName}
        </Text>
        <Text className={styles.poweredBy}>
          {displayFormat.attribution}
        </Text>
      </div>
    </Stack>
  );
}

/**
 * Get customer logo path
 * Priority:
 * 1. Org-specific logo from database (org.logo_url)
 * 2. File-based logo using org name slug
 * 3. Default org logo
 */
function getCustomerLogoPath(orgName: string): string | null {
  // TODO: In full implementation, fetch from org.logo_url in database
  // For now, construct path from org name

  const orgSlug = orgName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  // Try org-specific logo
  const orgLogoPath = `/public/img/customer-logos/${orgSlug}.svg`;

  // In a real implementation, we would check if the file exists on the backend
  // For now, we'll return the path and use onError handler in img tag
  return orgLogoPath;
}

/**
 * Get display format based on customer preferences
 *
 * Supported formats:
 * - "{CustomerName} Observability" - Powered by NebulaIQ
 * - "NebulaIQ for {CustomerName}"
 * - "{CustomerName}" - Powered by NebulaIQ (default)
 */
function getDisplayFormat(orgName: string) {
  // TODO: Make this configurable per organization
  // For now, use a smart default based on org name

  const isDefaultOrg = orgName === 'Main Org.' || orgName === 'Main Org';

  if (isDefaultOrg) {
    return {
      customerName: 'NebulaIQ Telemetry',
      attribution: '',
      shortName: 'NebulaIQ',
      tooltip: 'NebulaIQ Telemetry',
    };
  }

  return {
    customerName: `${orgName} Observability`,
    attribution: 'Powered by NebulaIQ',
    shortName: orgName,
    tooltip: `${orgName} Observability - Powered by NebulaIQ`,
  };
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    padding: theme.spacing(0.5, 1.5),
    borderRadius: theme.shape.radius.default,
    background: theme.colors.background.secondary,
    border: `1px solid ${theme.colors.border.weak}`,
    minHeight: '32px',
  }),
  compactContainer: css({
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.radius.default,
    background: theme.colors.background.secondary,
    border: `1px solid ${theme.colors.border.weak}`,
  }),
  customerLogo: css({
    height: '24px',
    width: 'auto',
    maxWidth: '32px',
    objectFit: 'contain',
  }),
  customerLogoCompact: css({
    height: '20px',
    width: 'auto',
    maxWidth: '24px',
    objectFit: 'contain',
  }),
  brandText: css({
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    minWidth: 0,
  }),
  brandTextCompact: css({
    minWidth: 0,
  }),
  customerName: css({
    fontSize: theme.typography.size.sm,
    fontWeight: theme.typography.fontWeightMedium,
    color: theme.colors.text.primary,
    lineHeight: 1.2,
    maxWidth: '200px',

    [theme.breakpoints.down('lg')]: {
      maxWidth: '150px',
    },
  }),
  poweredBy: css({
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.secondary,
    lineHeight: 1.2,
  }),
});
