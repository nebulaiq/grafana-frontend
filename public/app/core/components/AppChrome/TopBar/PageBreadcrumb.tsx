import { css } from '@emotion/css';
import React from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

/**
 * PageBreadcrumb - Shows current page title in the top bar
 *
 * This component displays a simple page title based on the current route.
 * It's hidden on dashboard pages (which have their own title display).
 */
export function PageBreadcrumb() {
  const styles = useStyles2(getStyles);
  const location = useLocation();
  const pageTitle = getPageTitleFromPath(location.pathname);

  // Don't show on dashboard pages (they have their own title)
  if (!pageTitle || location.pathname.startsWith('/d/')) {
    return null;
  }

  return (
    <div className={styles.breadcrumb}>
      <span className={styles.title}>{pageTitle}</span>
    </div>
  );
}

/**
 * Map URL paths to readable page titles
 */
function getPageTitleFromPath(pathname: string): string {
  // NebulaIQ app pages
  if (pathname.includes('service-performance')) {
    return 'Service Performance';
  }
  if (pathname.includes('infrastructure')) {
    return 'Infrastructure';
  }
  if (pathname.includes('logs')) {
    return 'Logs';
  }
  if (pathname.includes('traces')) {
    return 'Traces';
  }
  if (pathname.includes('architecture-insights')) {
    return 'Architecture Insights';
  }

  // Grafana pages
  if (pathname.includes('/dashboards')) {
    return 'Dashboards';
  }
  if (pathname.includes('/explore')) {
    return 'Explore';
  }
  if (pathname.includes('/connections')) {
    return 'Connections';
  }
  if (pathname.includes('/admin/users')) {
    return 'Users';
  }
  if (pathname.includes('/admin/orgs')) {
    return 'Organizations';
  }
  if (pathname.includes('/plugins')) {
    return 'Plugins';
  }

  return '';
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    breadcrumb: css({
      display: 'flex',
      alignItems: 'center',
      paddingLeft: theme.spacing(1),
    }),
    title: css({
      fontSize: '16px',
      fontWeight: 600,
      color: theme.colors.text.primary,
    }),
  };
};
