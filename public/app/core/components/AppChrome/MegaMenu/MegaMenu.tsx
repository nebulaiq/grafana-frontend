import { css } from '@emotion/css';
import { DOMAttributes } from '@react-types/shared';
import React, { memo, forwardRef, useState } from 'react';
import { useLocation } from 'react-router-dom-v5-compat';

import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';
import { Icon, IconName, ScrollContainer, useStyles2 } from '@grafana/ui';
import { useGrafana } from 'app/core/context/GrafanaContext';

// Import NebulaIQ navigation
import {
  NEBULAIQ_FEATURES,
  EXPLORE_SECTION,
  SETTINGS_SECTION,
  getActiveNavItem,
} from 'app/nebulaiq/navigation';
import { useBookmarkedDashboards } from 'app/nebulaiq/useBookmarkedDashboards';

import { TOP_BAR_LEVEL_HEIGHT } from '../types';

import { MegaMenuHeader } from './MegaMenuHeader';

export const MENU_WIDTH = '300px';

export interface Props extends DOMAttributes {
  onClose: () => void;
}

/**
 * NebulaIQ MegaMenu - Modern SaaS Navigation Pattern
 *
 * Structure:
 * 1. Built-in NebulaIQ Features (top-level, no hierarchy)
 * 2. Bookmarked Dashboards (dynamic, user's starred dashboards)
 * 3. Explore (expandable: dashboards, query, metrics, logs, profiles)
 * 4. Settings (expandable: connections, users, orgs, plugins)
 */
export const MegaMenu = memo(
  forwardRef<HTMLDivElement, Props>(({ onClose, ...restProps }, ref) => {
    const styles = useStyles2(getStyles);
    const location = useLocation();
    const { chrome } = useGrafana();
    const state = chrome.useState();
    const { bookmarks, loading } = useBookmarkedDashboards();
    const activeNavItem = getActiveNavItem(location.pathname);

    const handleMegaMenu = () => {
      chrome.setMegaMenuOpen(!state.megaMenuOpen);
    };

    const handleDockedMenu = () => {
      chrome.setMegaMenuDocked(!state.megaMenuDocked);
      if (state.megaMenuDocked) {
        chrome.setMegaMenuOpen(false);
      }
    };

    return (
      <div data-testid={selectors.components.NavMenu.Menu} ref={ref} {...restProps}>
        <MegaMenuHeader handleDockedMenu={handleDockedMenu} handleMegaMenu={handleMegaMenu} onClose={onClose} />
        <nav className={styles.content}>
          <ScrollContainer height="100%" overflowX="hidden" showScrollIndicators>
            <div className="nebulaiq-mega-menu">
              <div className="nebulaiq-nav-list">
                {/* Section 1: NebulaIQ Features */}
                {NEBULAIQ_FEATURES.map((item) => (
                  <NavItem
                    key={item.id}
                    item={item}
                    isActive={activeNavItem === item.id}
                    onClick={state.megaMenuDocked ? undefined : onClose}
                  />
                ))}

                {/* Divider */}
                <NavDivider />

                {/* Section 2: Bookmarked Dashboards */}
                <BookmarkedSection
                  bookmarks={bookmarks}
                  loading={loading}
                  onClick={state.megaMenuDocked ? undefined : onClose}
                />

                {/* Divider */}
                <NavDivider />

                {/* Section 3: Explore */}
                <NavItemExpandable
                  item={EXPLORE_SECTION}
                  isActive={activeNavItem === 'explore'}
                  onClick={state.megaMenuDocked ? undefined : onClose}
                />

                {/* Divider */}
                <NavDivider />

                {/* Section 4: Settings */}
                <NavItemExpandable
                  item={SETTINGS_SECTION}
                  isActive={activeNavItem === 'settings'}
                  onClick={state.megaMenuDocked ? undefined : onClose}
                />
              </div>
            </div>
          </ScrollContainer>
        </nav>
      </div>
    );
  })
);

MegaMenu.displayName = 'MegaMenu';

/**
 * Simple navigation item (no children)
 */
interface NavItemProps {
  item: NavModelItem;
  isActive: boolean;
  onClick?: () => void;
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  return (
    <a
      href={item.url}
      className={`nebulaiq-nav-item ${isActive ? 'active' : ''}`}
      title={item.text}
      onClick={onClick}
    >
      {item.icon && <Icon name={item.icon as IconName} />}
      <span className="nebulaiq-nav-item-text">{item.text}</span>
    </a>
  );
}

/**
 * Expandable navigation item (with children)
 */
interface NavItemExpandableProps {
  item: NavModelItem;
  isActive: boolean;
  onClick?: () => void;
}

function NavItemExpandable({ item, isActive, onClick }: NavItemExpandableProps) {
  const [isOpen, setIsOpen] = useState(isActive);

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="nebulaiq-nav-section">
      <div className={`nebulaiq-nav-item nebulaiq-nav-item-expandable ${isActive ? 'active' : ''}`}>
        <a href={item.url} onClick={onClick} className="nebulaiq-nav-item-link">
          {item.icon && <Icon name={item.icon as IconName} />}
          <span className="nebulaiq-nav-item-text">{item.text}</span>
        </a>
        <button onClick={toggleOpen} className="nebulaiq-nav-item-chevron-button" aria-label="Toggle submenu">
          <Icon name={isOpen ? 'angle-down' : 'angle-right'} className="nebulaiq-nav-item-chevron" />
        </button>
      </div>
      {isOpen && item.children && (
        <div className="nebulaiq-nav-children">
          {item.children.map((child) => (
            <a key={child.id} href={child.url} className="nebulaiq-nav-child-link" onClick={onClick}>
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
 * Bookmarked dashboards section
 */
interface BookmarkedSectionProps {
  bookmarks: any[];
  loading: boolean;
  onClick?: () => void;
}

function BookmarkedSection({ bookmarks, loading, onClick }: BookmarkedSectionProps) {
  if (loading) {
    return (
      <div className="nebulaiq-nav-section">
        <div className="nebulaiq-nav-section-loading">Loading bookmarks...</div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="nebulaiq-nav-section">
        <a href="/dashboards" className="nebulaiq-nav-item nebulaiq-nav-item-action" onClick={onClick}>
          <Icon name="star" />
          <span className="nebulaiq-nav-item-text">Bookmark Dashboard</span>
        </a>
      </div>
    );
  }

  return (
    <div className="nebulaiq-nav-section">
      {/* Bookmarked dashboards */}
      {bookmarks.map((bookmark) => (
        <a
          key={bookmark.uid}
          href={bookmark.url}
          className="nebulaiq-nav-item nebulaiq-nav-item-bookmark"
          title={bookmark.title}
          onClick={onClick}
        >
          <Icon name="star" className="nebulaiq-bookmark-icon" />
          <span className="nebulaiq-nav-item-text">{bookmark.title}</span>
        </a>
      ))}

      {/* Action to add more */}
      <a href="/dashboards" className="nebulaiq-nav-item nebulaiq-nav-item-action" onClick={onClick}>
        <Icon name="plus" />
        <span className="nebulaiq-nav-item-text">Bookmark Dashboard</span>
      </a>
    </div>
  );
}

/**
 * Divider between navigation sections
 */
function NavDivider() {
  return <div className="nebulaiq-nav-divider" />;
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    content: css({
      display: 'flex',
      flexDirection: 'column',
      height: `calc(100% - ${TOP_BAR_LEVEL_HEIGHT}px)`,
      minHeight: 0,
      position: 'relative',
    }),
  };
};
