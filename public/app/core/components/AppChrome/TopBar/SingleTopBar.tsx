import { css } from '@emotion/css';
import { memo } from 'react';

import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { Stack, ToolbarButton, useStyles2 } from '@grafana/ui';
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
 * NebulaIQ Single Top Bar - Minimal design
 *
 * Contains only:
 * - Page breadcrumbs/title
 * - Kiosk mode toggle
 *
 * Moved to NavRail:
 * - Organization switcher (customer branding) -> bottom left
 * - User profile dropdown -> bottom left
 * - Sign in link -> bottom left
 */
export const SingleTopBar = memo(function SingleTopBar({
  onToggleKioskMode,
  pageNav,
  sectionNav,
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
      {/* Left side - Breadcrumbs only (logo now in NavRail) */}
      <Stack minWidth={0} gap={0.5} alignItems="center">
        <Breadcrumbs breadcrumbs={breadcrumbs} className={styles.breadcrumbsWrapper} />
      </Stack>

      {/* Right side - Kiosk mode toggle only */}
      <Stack gap={1} alignItems="center">
        {/* Kiosk Mode Toggle */}
        <ToolbarButton
          icon="monitor"
          className={styles.kioskToggle}
          onClick={onToggleKioskMode}
          tooltip="Enable kiosk mode"
        />
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
  kioskToggle: css({
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  }),
});
