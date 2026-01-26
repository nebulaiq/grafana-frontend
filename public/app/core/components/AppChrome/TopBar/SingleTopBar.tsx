import { css } from '@emotion/css';
import { memo, PropsWithChildren } from 'react';

import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { Components } from '@grafana/e2e-selectors';
import { Stack, useStyles2 } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { HOME_NAV_ID } from 'app/core/reducers/navModel';
import { useSelector } from 'app/types';

import { Breadcrumbs } from '../../Breadcrumbs/Breadcrumbs';
import { buildSimpleBreadcrumbs } from '../../Breadcrumbs/utils';
import { TOP_BAR_LEVEL_HEIGHT } from '../types';

export const MEGA_MENU_TOGGLE_ID = 'mega-menu-toggle';

interface Props extends PropsWithChildren {
  sectionNav: NavModelItem;
  pageNav?: NavModelItem;
  onToggleMegaMenu?: () => void; // Kept for API compatibility but no longer used
  onToggleKioskMode(): void;
  actions?: React.ReactNode;
}

/**
 * NebulaIQ Single Top Bar - Unified horizontal design
 *
 * Contains:
 * - Left: Page breadcrumbs/title
 * - Right: Toolbar actions (time picker, refresh, edit buttons, etc.)
 *
 * This is a single unified bar that combines breadcrumbs and actions
 * in one horizontal row for a cleaner, more compact layout.
 *
 * Moved to NavRail:
 * - Organization switcher (customer branding) -> bottom left
 * - User profile dropdown -> bottom left
 * - Sign in link -> bottom left
 */
export const SingleTopBar = memo(function SingleTopBar({
  pageNav,
  sectionNav,
  actions,
}: Props) {
  const { chrome } = useGrafana();
  const state = chrome.useState();
  const menuDockedAndOpen = !state.chromeless && state.megaMenuDocked && state.megaMenuOpen;
  const styles = useStyles2(getStyles, menuDockedAndOpen);

  const homeNav = useSelector((state) => state.navIndex)[HOME_NAV_ID];
  // Use simplified breadcrumbs: Home > Current page only
  const breadcrumbs = buildSimpleBreadcrumbs(sectionNav, pageNav, homeNav);

  return (
    <div className={styles.layout}>
      {/* Left side - Breadcrumbs */}
      <div className={styles.leftSection}>
        <Stack minWidth={0} gap={0.5} alignItems="center">
          <Breadcrumbs breadcrumbs={breadcrumbs} className={styles.breadcrumbsWrapper} />
        </Stack>
      </div>

      {/* Right side - Actions (time picker, buttons, etc.) */}
      {actions && (
        <div data-testid={Components.NavToolbar.container} className={styles.actionsSection}>
          <Stack alignItems="center" justifyContent="flex-end" flex={1} wrap="nowrap" minWidth={0} gap={0.5}>
            {actions}
          </Stack>
        </div>
      )}
    </div>
  );
});

const getStyles = (theme: GrafanaTheme2, menuDockedAndOpen: boolean) => ({
  layout: css({
    height: TOP_BAR_LEVEL_HEIGHT,
    display: 'flex',
    gap: theme.spacing(1),
    alignItems: 'center',
    padding: theme.spacing(0, 1.5),
    paddingLeft: menuDockedAndOpen ? theme.spacing(3.5) : theme.spacing(1.5),
    borderBottom: `1px solid ${theme.colors.border.weak}`,
    justifyContent: 'space-between',
    background: theme.colors.background.primary,
  }),
  leftSection: css({
    flex: '0 1 auto',
    minWidth: 0,
  }),
  breadcrumbsWrapper: css({
    display: 'flex',
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      minWidth: '40%',
    },
  }),
  actionsSection: css({
    flex: '1 1 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: 0,

    // Compact styling for time picker and refresh controls in the top bar
    '& button': {
      height: '32px',
      padding: theme.spacing(0, 1),
      fontSize: theme.typography.bodySmall.fontSize,
    },
    // Ensure icon buttons are properly sized
    '& button[aria-label]': {
      minWidth: '32px',
    },
    // Make dropdown buttons more compact
    '& .refresh-picker button': {
      height: '32px',
    },
  }),
});
