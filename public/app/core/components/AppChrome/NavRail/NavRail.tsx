import {css, cx} from '@emotion/css';
import {useState} from 'react';
import {useLocation} from 'react-router-dom-v5-compat';

import {GrafanaTheme2} from '@grafana/data';
import {Dropdown, Icon, IconName, Menu, useStyles2} from '@grafana/ui';
import {contextSrv} from 'app/core/services/context_srv';
import {getActiveNavItem, getEnabledFeatures, SETTINGS_SECTION,} from 'app/nebulaiq/navigation';
import {useBookmarkedDashboards} from 'app/nebulaiq/useBookmarkedDashboards';

// Rail dimensions
export const RAIL_WIDTH_COLLAPSED = 56;
export const RAIL_WIDTH_EXPANDED = 220;

interface NavRailProps {
  className?: string;
}

/**
 * NavRail - Gmail-style persistent sidebar navigation
 *
 * Features:
 * - Always visible (collapsed by default)
 * - Shows icons with abbreviated labels when collapsed
 * - Expands to full width on hover
 * - Violet accent for active states
 */
export function NavRail({className}: NavRailProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = useStyles2(getStyles);
  const location = useLocation();
  const activeNavItem = getActiveNavItem(location.pathname);
  const {bookmarks} = useBookmarkedDashboards();

  // Get user info for bottom section
  const user = contextSrv.user;
  const userName = user.name || user.login || 'User';
  const userInitials = getInitials(userName);

  return (
    <nav
      className={cx(styles.rail, isExpanded && styles.railExpanded, className)}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo - Fixed at top */}
      <div className={styles.logoSection}>
        <a href="/" className={styles.logoLink}>
          <img
            src="/public/img/nebulaiq-icon.svg"
            alt="NebulaIQ Observe"
            className={styles.logoIcon}
          />
          {isExpanded && <span className={styles.logoText}>NebulaIQ Observe</span>}
        </a>
      </div>

      {/* Scrollable Navigation Content */}
      <div className={styles.scrollableContent}>
        {/* Main Navigation */}
        <div className={styles.navSection}>
          {getEnabledFeatures().map((item) => (
            <NavRailItem
              key={item.id}
              icon={item.icon as IconName}
              label={item.text}
              abbrev={getAbbrev(item.text)}
              href={item.url || '#'}
              isActive={activeNavItem === item.id}
              isExpanded={isExpanded}
            />
          ))}
        </div>

        {/* Divider */}
        <div className={styles.divider}/>

        {/* Dashboards Section */}
        <div className={styles.navSection}>
          <NavRailItem
            icon="apps"
            label="Dashboards"
            abbrev="Dash"
            href="/dashboards"
            isActive={activeNavItem === 'dashboards'}
            isExpanded={isExpanded}
          />
          {/* Show bookmarked dashboards if any */}
          {bookmarks.length > 0 && bookmarks.slice(0, 2).map((bookmark) => (
            <NavRailItem
              key={bookmark.uid}
              icon="star"
              label={bookmark.title}
              abbrev={getAbbrev(bookmark.title)}
              href={bookmark.url}
              isActive={false}
              isExpanded={isExpanded}
            />
          ))}
        </div>

        {/* Data Sources */}
        <NavRailItem
          icon="database"
          label="Data Sources"
          abbrev="Sources"
          href="/connections/datasources"
          isActive={activeNavItem === 'datasources'}
          isExpanded={isExpanded}
        />

        {/* Divider */}
        <div className={styles.divider}/>

        {/* Explore - Direct link to query view */}
        <NavRailItem
          icon="compass"
          label="Explore"
          abbrev="Explore"
          href="/explore"
          isActive={activeNavItem === 'explore'}
          isExpanded={isExpanded}
        />
      </div>

      {/* Fixed Bottom Section - User Profile + Settings */}
      <div className={styles.bottomSection}>
        {/* User Profile Row */}
        <Dropdown
          overlay={() => (
            <Menu>
              <Menu.Item url="/profile" label="Profile" icon="user"/>
              <Menu.Item url="/profile/password" label="Change password" icon="lock"/>
              <Menu.Divider/>
              {SETTINGS_SECTION.children?.map((item) => (
                <Menu.Item
                  key={item.id || item.text}
                  url={item.url}
                  label={item.text}
                  icon={item.icon as IconName}
                />
              ))}
              <Menu.Divider/>
              <Menu.Item url="/logout" label="Sign out" icon="signout"/>
            </Menu>
          )}
          placement="top-start"
        >
          <div className={cx(styles.userSection, isExpanded && styles.userSectionExpanded)}>
            {/* Avatar */}
            {user.gravatarUrl ? (
              <img src={user.gravatarUrl} alt={userName} className={styles.userAvatar}/>
            ) : (
              <div className={styles.userAvatarPlaceholder}>
                <span>{userInitials}</span>
              </div>
            )}

            {/* User Info + Settings Icon (when expanded) */}
            {isExpanded && (
              <>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{userName}</span>
                  <span className={styles.userBranding}>NebulaIQ Observe</span>
                </div>
                <Icon name="cog" className={styles.settingsIcon}/>
              </>
            )}
          </div>
        </Dropdown>
      </div>
    </nav>
  );
}

/**
 * Get user initials for avatar placeholder
 */
function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Single navigation item
 */
interface NavRailItemProps {
  icon: IconName;
  label: string;
  abbrev: string;
  href: string;
  isActive: boolean;
  isExpanded: boolean;
}

function NavRailItem({icon, label, abbrev, href, isActive, isExpanded}: NavRailItemProps) {
  const styles = useStyles2(getItemStyles);

  return (
    <a
      href={href}
      className={cx(
        styles.item,
        isExpanded && styles.itemExpanded,
        isActive && styles.itemActive
      )}
      title={label}
    >
      <div className={styles.iconWrapper}>
        <Icon name={icon} className={styles.icon}/>
      </div>
      {isExpanded ? (
        <span className={styles.label}>{label}</span>
      ) : (
        <span className={styles.abbrevVertical}>{abbrev}</span>
      )}
      {isActive && <div className={styles.activeIndicator}/>}
    </a>
  );
}

/**
 * Expandable navigation item with children
 * @future Reserved for future expandable nav items
 */
interface NavRailItemExpandableProps {
  icon: IconName;
  label: string;
  abbrev: string;
  href: string;
  children: Array<{ id?: string; text: string; url?: string; icon?: string }>;
  isActive: boolean;
  isExpanded: boolean;
}

// @ts-expect-error Reserved for future expandable nav items
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _NavRailItemExpandable({
                                  icon,
                                  label,
                                  abbrev,
                                  href,
                                  children,
                                  isActive,
                                  isExpanded,
                                }: NavRailItemExpandableProps) {
  const [isOpen, setIsOpen] = useState(false);
  const styles = useStyles2(getItemStyles);

  // When collapsed, render like a regular NavRailItem
  if (!isExpanded) {
    return (
      <div className={styles.expandableContainer}>
        <a
          href={href}
          className={cx(
            styles.item,
            isActive && styles.itemActive
          )}
          title={label}
        >
          <div className={styles.iconWrapper}>
            <Icon name={icon} className={styles.icon}/>
          </div>
          <span className={styles.abbrevVertical}>{abbrev}</span>
          {isActive && <div className={styles.activeIndicator}/>}
        </a>
      </div>
    );
  }

  // When expanded, show with chevron for submenu
  return (
    <div className={styles.expandableContainer}>
      <div className={cx(
        styles.expandableRow,
        isActive && styles.itemActive
      )}>
        <a href={href} className={styles.expandableLinkRow} title={label}>
          <div className={styles.iconWrapper}>
            <Icon name={icon} className={styles.icon}/>
          </div>
          <span className={styles.label}>{label}</span>
        </a>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.chevronButton}
          aria-label="Toggle submenu"
        >
          <Icon name={isOpen ? 'angle-down' : 'angle-right'}/>
        </button>
        {isActive && <div className={styles.activeIndicator}/>}
      </div>

      {isOpen && children.length > 0 && (
        <div className={styles.children}>
          {children.map((child) => (
            <a
              key={child.id || child.text}
              href={child.url || '#'}
              className={styles.childItem}
            >
              {child.icon && <Icon name={child.icon as IconName} size="sm"/>}
              <span>{child.text}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Mapping for better short labels in collapsed state
 * These are readable short forms, not abbreviations
 */
const SHORT_LABELS: Record<string, string> = {
  'Service Performance': 'Services',
  'Infrastructure': 'Infra',
  'Logs': 'Logs',
  'Traces': 'Traces',
  'Architecture Insights': 'Insights',
  'Integrations': 'Integrations',
  'Hosts': 'Hosts',
  'Pods': 'Pods',
  'Redux Test': 'Redux',
  'Redux Scene Test': 'Scenes',
  'Data Sources': 'Sources',
  'Explore': 'Explore',
  'Settings': 'Settings',
  'Bookmark Dashboard': 'Starred',
};

/**
 * Get short label for collapsed state
 * Uses predefined mappings for known items, falls back to truncation
 */
function getAbbrev(text: string): string {
  // Use predefined short label if available
  if (SHORT_LABELS[text]) {
    return SHORT_LABELS[text];
  }
  // For bookmarked dashboards and other dynamic items, truncate intelligently
  const words = text.split(' ');
  if (words.length === 1) {
    return text.length <= 8 ? text : text.substring(0, 7) + '…';
  }
  // Multi-word: use first word if short enough, otherwise abbreviate
  if (words[0].length <= 8) {
    return words[0];
  }
  return words[0].substring(0, 7) + '…';
}

// Color constants for consistent theming
const COLORS = {
  primaryText: '#FFFFFF',           // Bright white for primary text
  secondaryText: 'rgba(255, 255, 255, 0.65)', // Less white for secondary
  tertiaryText: 'rgba(255, 255, 255, 0.45)',  // Even less white for tertiary
  accent: 'rgba(255, 255, 255, 0.1)', // Subtle accent for active/hover backgrounds
  background: '#0a0910',
  border: 'rgba(255, 255, 255, 0.06)',
  hoverBg: 'rgba(255, 255, 255, 0.06)',
  activeBg: 'rgba(255, 255, 255, 0.08)',
};

/**
 * Styles for the NavRail container
 */
const getStyles = (theme: GrafanaTheme2) => ({
  rail: css({
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    width: RAIL_WIDTH_COLLAPSED,
    background: COLORS.background,
    borderRight: `1px solid ${COLORS.border}`,
    display: 'flex',
    flexDirection: 'column',
    zIndex: theme.zIndex.navbarFixed + 1,
    transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    overflow: 'hidden',
  }),

  railExpanded: css({
    width: RAIL_WIDTH_EXPANDED,
    boxShadow: '4px 0 24px rgba(0, 0, 0, 0.4)',
  }),

  logoSection: css({
    height: 52,
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    borderBottom: `1px solid ${COLORS.border}`,
    flexShrink: 0,
  }),

  logoLink: css({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    color: COLORS.primaryText,
  }),

  logoIcon: css({
    width: 28,
    height: 28,
  }),

  logoText: css({
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    color: COLORS.primaryText,
  }),

  // Scrollable middle content
  scrollableContent: css({
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',

    // Hide scrollbar but keep functionality
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),

  navSection: css({
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0',
  }),

  divider: css({
    height: 1,
    background: COLORS.border,
    margin: '4px 12px',
  }),

  // Fixed bottom section
  bottomSection: css({
    flexShrink: 0,
    borderTop: `1px solid ${COLORS.border}`,
    background: COLORS.background,
  }),

  // User profile section
  userSection: css({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 10px',
    margin: '4px',
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    gap: 10,

    '&:hover': {
      background: COLORS.hoverBg,
    },
  }),

  userSectionExpanded: css({
    padding: '10px 12px',
    margin: '4px 8px',
  }),

  userAvatar: css({
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: `2px solid ${COLORS.secondaryText}`,
    flexShrink: 0,
  }),

  userAvatarPlaceholder: css({
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,

    '& span': {
      fontSize: 12,
      fontWeight: 600,
      color: COLORS.primaryText,
    },
  }),

  userInfo: css({
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),

  userName: css({
    fontSize: 13,
    fontWeight: 500,
    color: COLORS.primaryText,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  userBranding: css({
    fontSize: 10,
    color: COLORS.tertiaryText,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  settingsIcon: css({
    color: COLORS.secondaryText,
    fontSize: 16,
    flexShrink: 0,
    transition: 'color 0.2s ease',

    '&:hover': {
      color: COLORS.primaryText,
    },
  }),
});

/**
 * Styles for navigation items
 */
const getItemStyles = (theme: GrafanaTheme2) => ({
  item: css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '8px 6px',
    margin: '2px 4px',
    borderRadius: 8,
    textDecoration: 'none',
    color: COLORS.secondaryText,
    transition: 'all 0.2s ease',
    minHeight: 44,
    cursor: 'pointer',
    gap: 4,

    '&:hover': {
      background: COLORS.hoverBg,
      color: COLORS.primaryText,
      textDecoration: 'none',
    },
  }),

  itemExpanded: css({
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '10px 12px',
    margin: '2px 8px',
    minHeight: 44,
    gap: 10,
  }),

  itemActive: css({
    background: COLORS.activeBg,
    color: COLORS.primaryText,

    '&:hover': {
      background: 'rgba(255, 255, 255, 0.10)',
      textDecoration: 'none',
    },
  }),

  iconWrapper: css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }),

  icon: css({
    fontSize: 18,
    flexShrink: 0,
  }),

  label: css({
    fontSize: 13,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    color: 'inherit',
  }),

  abbrevVertical: css({
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: '0.5px',
    color: COLORS.secondaryText,
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    transform: 'rotate(180deg)',
    whiteSpace: 'nowrap',
    maxHeight: 50,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),

  activeIndicator: css({
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 3,
    height: 24,
    background: COLORS.primaryText,
    borderRadius: '0 2px 2px 0',
  }),

  // Expandable item styles (reserved for future use)
  expandableContainer: css({
    display: 'flex',
    flexDirection: 'column',
  }),

  expandableRow: css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '10px 8px',
    margin: '2px 8px',
    borderRadius: 8,
    color: COLORS.secondaryText,
    transition: 'all 0.2s ease',
    minHeight: 44,
    gap: 8,

    '&:hover': {
      background: COLORS.hoverBg,
      color: COLORS.primaryText,
    },
  }),

  expandableLinkRow: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    textDecoration: 'none',
    color: 'inherit',
    minWidth: 0,
    gap: 10,

    '&:hover': {
      textDecoration: 'none',
      color: COLORS.primaryText,
    },
  }),

  chevronButton: css({
    background: 'none',
    border: 'none',
    color: COLORS.tertiaryText,
    padding: 4,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,

    '&:hover': {
      color: COLORS.primaryText,
    },
  }),

  children: css({
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 16,
    paddingBottom: 8,
  }),

  childItem: css({
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    marginLeft: 8,
    borderRadius: 6,
    textDecoration: 'none',
    color: COLORS.secondaryText,
    fontSize: 13,

    '&:hover': {
      background: COLORS.hoverBg,
      color: COLORS.primaryText,
      textDecoration: 'none',
    },
  }),
});
