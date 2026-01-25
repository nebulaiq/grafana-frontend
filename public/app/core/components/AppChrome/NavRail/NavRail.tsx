import { css, cx } from '@emotion/css';
import { useState } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { GrafanaTheme2 } from '@grafana/data';
import { Icon, IconName, useStyles2 } from '@grafana/ui';

import {
  NEBULAIQ_FEATURES,
  EXPLORE_SECTION,
  SETTINGS_SECTION,
  getActiveNavItem,
} from 'app/nebulaiq/navigation';
import { useBookmarkedDashboards } from 'app/nebulaiq/useBookmarkedDashboards';

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
export function NavRail({ className }: NavRailProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = useStyles2(getStyles);
  const location = useLocation();
  const activeNavItem = getActiveNavItem(location.pathname);
  const { bookmarks } = useBookmarkedDashboards();

  return (
    <nav
      className={cx(styles.rail, isExpanded && styles.railExpanded, className)}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo */}
      <div className={styles.logoSection}>
        <a href="/" className={styles.logoLink}>
          <img
            src="/public/img/nebulaiq-icon.svg"
            alt="NebulaIQ"
            className={styles.logoIcon}
          />
          {isExpanded && <span className={styles.logoText}>NebulaIQ</span>}
        </a>
      </div>

      {/* Main Navigation */}
      <div className={styles.navSection}>
        {NEBULAIQ_FEATURES.map((item) => (
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
      <div className={styles.divider} />

      {/* Bookmarks Section */}
      <div className={styles.navSection}>
        {bookmarks.length > 0 ? (
          bookmarks.slice(0, 3).map((bookmark) => (
            <NavRailItem
              key={bookmark.uid}
              icon="star"
              label={bookmark.title}
              abbrev={getAbbrev(bookmark.title)}
              href={bookmark.url}
              isActive={false}
              isExpanded={isExpanded}
            />
          ))
        ) : (
          <NavRailItem
            icon="star"
            label="Bookmark Dashboard"
            abbrev="Star"
            href="/dashboards"
            isActive={false}
            isExpanded={isExpanded}
          />
        )}
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Explore Section */}
      <NavRailItemExpandable
        icon={EXPLORE_SECTION.icon as IconName}
        label={EXPLORE_SECTION.text}
        abbrev="Explore"
        href={EXPLORE_SECTION.url || '/dashboards'}
        children={EXPLORE_SECTION.children || []}
        isActive={activeNavItem === 'explore'}
        isExpanded={isExpanded}
      />

      {/* Divider */}
      <div className={styles.divider} />

      {/* Settings Section */}
      <NavRailItemExpandable
        icon={SETTINGS_SECTION.icon as IconName}
        label={SETTINGS_SECTION.text}
        abbrev="Settings"
        href="#"
        children={SETTINGS_SECTION.children || []}
        isActive={activeNavItem === 'settings'}
        isExpanded={isExpanded}
      />
    </nav>
  );
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

function NavRailItem({ icon, label, abbrev, href, isActive, isExpanded }: NavRailItemProps) {
  const styles = useStyles2(getItemStyles);

  return (
    <a
      href={href}
      className={cx(styles.item, isActive && styles.itemActive)}
      title={label}
    >
      <Icon name={icon} className={styles.icon} />
      {isExpanded ? (
        <span className={styles.label}>{label}</span>
      ) : (
        <span className={styles.abbrev}>{abbrev}</span>
      )}
      {isActive && <div className={styles.activeIndicator} />}
    </a>
  );
}

/**
 * Expandable navigation item with children
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

function NavRailItemExpandable({
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

  return (
    <div className={styles.expandableContainer}>
      <div className={cx(styles.item, styles.expandableItem, isActive && styles.itemActive)}>
        <a href={href} className={styles.expandableLink} title={label}>
          <Icon name={icon} className={styles.icon} />
          {isExpanded ? (
            <span className={styles.label}>{label}</span>
          ) : (
            <span className={styles.abbrev}>{abbrev}</span>
          )}
        </a>
        {isExpanded && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={styles.chevronButton}
            aria-label="Toggle submenu"
          >
            <Icon name={isOpen ? 'angle-down' : 'angle-right'} />
          </button>
        )}
        {isActive && <div className={styles.activeIndicator} />}
      </div>

      {isExpanded && isOpen && children.length > 0 && (
        <div className={styles.children}>
          {children.map((child) => (
            <a
              key={child.id || child.text}
              href={child.url || '#'}
              className={styles.childItem}
            >
              {child.icon && <Icon name={child.icon as IconName} size="sm" />}
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
    background: '#0a0910',
    borderRight: '1px solid rgba(255, 255, 255, 0.04)',
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
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  }),

  logoLink: css({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.95)',
  }),

  logoIcon: css({
    width: 28,
    height: 28,
  }),

  logoText: css({
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  }),

  navSection: css({
    display: 'flex',
    flexDirection: 'column',
    padding: '8px 0',
  }),

  divider: css({
    height: 1,
    background: 'rgba(255, 255, 255, 0.04)',
    margin: '4px 12px',
  }),
});

/**
 * Styles for navigation items
 */
const getItemStyles = (theme: GrafanaTheme2) => ({
  item: css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 8px',
    margin: '2px 8px',
    borderRadius: 8,
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.65)',
    transition: 'all 0.15s ease',
    minHeight: 52,
    cursor: 'pointer',

    '&:hover': {
      background: 'rgba(139, 92, 246, 0.08)',
      color: 'rgba(255, 255, 255, 0.95)',
    },
  }),

  itemActive: css({
    background: 'rgba(139, 92, 246, 0.12)',
    color: '#8b5cf6',

    '&:hover': {
      background: 'rgba(139, 92, 246, 0.15)',
    },
  }),

  icon: css({
    fontSize: 20,
    marginBottom: 2,
  }),

  label: css({
    fontSize: 13,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  }),

  abbrev: css({
    fontSize: 10,
    fontWeight: 500,
    textTransform: 'none',
    letterSpacing: '0.2px',
    opacity: 0.85,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    textAlign: 'center',
  }),

  activeIndicator: css({
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 3,
    height: 24,
    background: '#8b5cf6',
    borderRadius: '0 2px 2px 0',
  }),

  expandableContainer: css({
    display: 'flex',
    flexDirection: 'column',
  }),

  expandableItem: css({
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    paddingLeft: 12,
  }),

  expandableLink: css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    textDecoration: 'none',
    color: 'inherit',
    minWidth: 0,
  }),

  chevronButton: css({
    background: 'none',
    border: 'none',
    color: 'rgba(255, 255, 255, 0.4)',
    padding: 4,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    '&:hover': {
      color: 'rgba(255, 255, 255, 0.8)',
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
    color: 'rgba(255, 255, 255, 0.55)',
    fontSize: 13,

    '&:hover': {
      background: 'rgba(139, 92, 246, 0.06)',
      color: 'rgba(255, 255, 255, 0.85)',
    },
  }),
});
