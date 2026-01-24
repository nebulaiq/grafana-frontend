import { css } from '@emotion/css';
import { memo } from 'react';

import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { Dropdown, Icon, Stack, ToolbarButton, useStyles2 } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';
import { contextSrv } from 'app/core/core';
import { t } from 'app/core/internationalization';
import { HOME_NAV_ID } from 'app/core/reducers/navModel';
import { useSelector } from 'app/types';

import { Branding } from '../../Branding/Branding';
import { Breadcrumbs } from '../../Breadcrumbs/Breadcrumbs';
import { buildBreadcrumbs } from '../../Breadcrumbs/utils';
import { OrganizationSwitcher } from '../OrganizationSwitcher/OrganizationSwitcher';
import { TOP_BAR_LEVEL_HEIGHT } from '../types';

import { SignInLink } from './SignInLink';
import { TopNavBarMenu } from './TopNavBarMenu';

export const MEGA_MENU_TOGGLE_ID = 'mega-menu-toggle';

interface Props {
  sectionNav: NavModelItem;
  pageNav?: NavModelItem;
  onToggleMegaMenu(): void;
  onToggleKioskMode(): void;
}

/**
 * NebulaIQ Single Top Bar - Simplified, minimal design
 *
 * Removed:
 * - Search bar (will add AI-powered search later)
 * - "Create" / QuickAdd button
 * - News menu
 * - Help menu
 * - Time range picker (context-aware, only on dashboards)
 *
 * Kept:
 * - Menu toggle with logo
 * - Page breadcrumbs/title
 * - Organization switcher (customer branding)
 * - User profile dropdown
 * - Kiosk mode toggle
 */
export const SingleTopBar = memo(function SingleTopBar({
  onToggleMegaMenu,
  onToggleKioskMode,
  pageNav,
  sectionNav,
}: Props) {
  const { chrome } = useGrafana();
  const state = chrome.useState();
  const menuDockedAndOpen = !state.chromeless && state.megaMenuDocked && state.megaMenuOpen;
  const styles = useStyles2(getStyles, menuDockedAndOpen);
  const navIndex = useSelector((state) => state.navIndex);

  const profileNode = navIndex['profile'];
  const homeNav = useSelector((state) => state.navIndex)[HOME_NAV_ID];
  const breadcrumbs = buildBreadcrumbs(sectionNav, pageNav, homeNav);

  return (
    <div className={styles.layout}>
      {/* Left side - Menu toggle + Breadcrumbs */}
      <Stack minWidth={0} gap={0.5} alignItems="center">
        {!menuDockedAndOpen && (
          <ToolbarButton
            narrow
            id={MEGA_MENU_TOGGLE_ID}
            onClick={onToggleMegaMenu}
            tooltip={t('navigation.megamenu.open', 'Open menu')}
          >
            <Stack gap={0} alignItems="center">
              <Branding.MenuLogo className={styles.img} />
              <Icon size="sm" name="angle-down" />
            </Stack>
          </ToolbarButton>
        )}
        {/* Use existing breadcrumbs or our custom PageBreadcrumb */}
        <Breadcrumbs breadcrumbs={breadcrumbs} className={styles.breadcrumbsWrapper} />
        {/* <PageBreadcrumb /> */}
      </Stack>

      {/* Right side - Customer org + User profile */}
      <Stack gap={1} alignItems="center">
        {/* Organization Switcher - Customer Branding */}
        <OrganizationSwitcher />

        {/* Kiosk Mode Toggle (optional, can remove if not needed) */}
        <ToolbarButton
          icon="monitor"
          className={styles.kioskToggle}
          onClick={onToggleKioskMode}
          tooltip="Enable kiosk mode"
        />

        {/* Sign In Link (if not signed in) */}
        {!contextSrv.user.isSignedIn && <SignInLink />}

        {/* User Profile Dropdown */}
        {profileNode && (
          <Dropdown overlay={() => <TopNavBarMenu node={profileNode} />} placement="bottom-end">
            <ToolbarButton
              className={styles.profileButton}
              imgSrc={contextSrv.user.gravatarUrl}
              imgAlt="User avatar"
              aria-label="Profile"
            />
          </Dropdown>
        )}
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
    paddingLeft: menuDockedAndOpen ? theme.spacing(3.5) : theme.spacing(0.75),
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
  img: css({
    alignSelf: 'center',
    height: '56px',
    width: '84px',
    objectFit: 'contain',
  }),
  profileButton: css({
    padding: theme.spacing(0, 0.5),
    img: {
      borderRadius: theme.shape.radius.circle,
      height: '24px',
      marginRight: 0,
      width: '24px',
    },
  }),
  kioskToggle: css({
    [theme.breakpoints.down('lg')]: {
      display: 'none',
    },
  }),
});
