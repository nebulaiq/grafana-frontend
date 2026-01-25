import { css } from '@emotion/css';
import { memo, useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { locationService } from '@grafana/runtime';
import { Icon, Stack, useStyles2 } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { HOME_NAV_ID } from 'app/core/reducers/navModel';
import { useSelector } from 'app/types';

import { Breadcrumbs } from '../../Breadcrumbs/Breadcrumbs';
import { buildSimpleBreadcrumbs } from '../../Breadcrumbs/utils';
import { TOP_BAR_LEVEL_HEIGHT } from '../types';

export const MEGA_MENU_TOGGLE_ID = 'mega-menu-toggle';

interface Props {
  sectionNav: NavModelItem;
  pageNav?: NavModelItem;
  onToggleMegaMenu?: () => void; // Kept for API compatibility but no longer used
  onToggleKioskMode(): void;
}

/**
 * Format time range for display
 */
function formatTimeRange(from: string, to: string): string {
  // Handle relative time like "now-2d" -> "Last 2 days"
  if (from.startsWith('now-')) {
    const duration = from.replace('now-', '');
    const unit = duration.slice(-1);
    const value = duration.slice(0, -1);

    const unitNames: Record<string, string> = {
      'm': value === '1' ? 'minute' : 'minutes',
      'h': value === '1' ? 'hour' : 'hours',
      'd': value === '1' ? 'day' : 'days',
      'w': value === '1' ? 'week' : 'weeks',
      'M': value === '1' ? 'month' : 'months',
      'y': value === '1' ? 'year' : 'years',
    };

    if (unitNames[unit]) {
      return `Last ${value} ${unitNames[unit]}`;
    }
  }

  // Fallback to showing the raw values
  return `${from} to ${to}`;
}

/**
 * NebulaIQ Single Top Bar - Minimal design
 *
 * Contains:
 * - Page breadcrumbs/title
 * - Compact time picker display
 * - Refresh button
 *
 * Moved to NavRail:
 * - Organization switcher (customer branding) -> bottom left
 * - User profile dropdown -> bottom left
 * - Sign in link -> bottom left
 */
export const SingleTopBar = memo(function SingleTopBar({
  pageNav,
  sectionNav,
}: Props) {
  const { chrome } = useGrafana();
  const state = chrome.useState();
  const menuDockedAndOpen = !state.chromeless && state.megaMenuDocked && state.megaMenuOpen;
  const styles = useStyles2(getStyles, menuDockedAndOpen);
  const location = useLocation();

  const homeNav = useSelector((state) => state.navIndex)[HOME_NAV_ID];
  // Use simplified breadcrumbs: Home > Current page only
  const breadcrumbs = buildSimpleBreadcrumbs(sectionNav, pageNav, homeNav);

  // Get time range from URL parameters
  const timeRange = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const from = params.get('from') || 'now-2d';
    const to = params.get('to') || 'now';
    return { from, to, display: formatTimeRange(from, to) };
  }, [location.search]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    // Trigger page refresh by updating URL with a cache-bust parameter
    const params = new URLSearchParams(location.search);
    params.set('refresh', Date.now().toString());
    locationService.partial({ refresh: Date.now().toString() });
    // Also dispatch a custom event that components can listen to
    window.dispatchEvent(new CustomEvent('grafana-refresh'));
  }, [location.search]);

  return (
    <div className={styles.layout}>
      {/* Left side - Breadcrumbs only (logo now in NavRail) */}
      <Stack minWidth={0} gap={0.5} alignItems="center">
        <Breadcrumbs breadcrumbs={breadcrumbs} className={styles.breadcrumbsWrapper} />
      </Stack>

      {/* Right side - Time display and Refresh */}
      <Stack gap={0.5} alignItems="center">
        {/* Compact Time Display */}
        <div className={styles.timeDisplay}>
          <Icon name="clock-nine" size="sm" className={styles.timeIcon} />
          <span className={styles.timeText}>{timeRange.display}</span>
        </div>

        {/* Refresh Button */}
        <button
          className={styles.refreshButton}
          onClick={handleRefresh}
          title="Refresh"
        >
          <Icon name="sync" size="sm" />
        </button>
      </Stack>
    </div>
  );
});

const getStyles = (theme: GrafanaTheme2, menuDockedAndOpen: boolean) => ({
  layout: css({
    height: TOP_BAR_LEVEL_HEIGHT,
    display: 'flex',
    gap: theme.spacing(2),
    alignItems: 'center',
    padding: theme.spacing(0, 1.5),
    paddingLeft: menuDockedAndOpen ? theme.spacing(3.5) : theme.spacing(1.5),
    borderBottom: `1px solid ${theme.colors.border.weak}`,
    justifyContent: 'space-between',
    background: theme.colors.background.primary,

    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  }),
  breadcrumbsWrapper: css({
    display: 'flex',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      minWidth: '40%',
    },
  }),
  timeDisplay: css({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    borderRadius: theme.shape.radius.default,
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    cursor: 'default',
    fontSize: theme.typography.bodySmall.fontSize,
  }),
  timeIcon: css({
    color: 'rgba(255, 255, 255, 0.5)',
  }),
  timeText: css({
    color: 'rgba(255, 255, 255, 0.85)',
    whiteSpace: 'nowrap',
  }),
  refreshButton: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.radius.default,
    background: 'transparent',
    border: `1px solid rgba(255, 255, 255, 0.08)`,
    color: 'rgba(255, 255, 255, 0.65)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',

    '&:hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      color: 'rgba(255, 255, 255, 0.95)',
    },

    '&:active': {
      transform: 'scale(0.95)',
    },
  }),
});
