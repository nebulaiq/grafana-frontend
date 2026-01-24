import { NavModelItem } from '@grafana/data';

/**
 * NebulaIQ Navigation Structure
 *
 * Modern SaaS pattern inspired by Linear, Notion, Slack:
 * 1. Built-in features (grafana-app) - Top-level, no hierarchy
 * 2. Bookmarked dashboards (user's favorites) - Dynamic list
 * 3. Explore (all dashboards + ad-hoc querying) - Expandable section
 * 4. Settings (admin functions) - Expandable section
 */

/**
 * Section 1: Built-in NebulaIQ Features
 * These are top-level navigation items with no nesting.
 * They link directly to the grafana-app plugin pages.
 */
export const NEBULAIQ_FEATURES: NavModelItem[] = [
  {
    id: 'service-performance',
    text: 'Service Performance',
    icon: 'chart-line',
    url: '/a/nebulaiq-telemetry-app/service-performance',
    sortWeight: 1,
  },
  {
    id: 'infrastructure',
    text: 'Infrastructure',
    icon: 'cube',
    url: '/a/nebulaiq-telemetry-app/infrastructure',
    sortWeight: 2,
  },
  {
    id: 'logs',
    text: 'Logs',
    icon: 'file-alt',
    url: '/a/nebulaiq-telemetry-app/logs',
    sortWeight: 3,
  },
  {
    id: 'traces',
    text: 'Traces',
    icon: 'code-branch',
    url: '/a/nebulaiq-telemetry-app/traces',
    sortWeight: 4,
  },
  {
    id: 'architecture-insights',
    text: 'Architecture Insights',
    icon: 'sitemap',
    url: '/a/nebulaiq-telemetry-app/architecture-insights',
    sortWeight: 5,
  },
];

/**
 * Section 2: Bookmarked Dashboards
 * Dynamic list loaded from Grafana's starred dashboards API
 */
export interface BookmarkedDashboard {
  id: string;
  uid: string;
  title: string;
  url: string;
  isStarred: boolean;
}

/**
 * Section 3: Explore
 * Main link goes to dashboard list (/dashboards)
 * Sub-items removed - NebulaIQ has custom logs/traces UI
 */
export const EXPLORE_SECTION: NavModelItem = {
  id: 'explore',
  text: 'Explore',
  icon: 'compass',
  url: '/dashboards', // Main link goes to dashboard list
  sortWeight: 100,
  // REMOVED: Explore children - Using NebulaIQ custom logs/traces UI instead
  // children: [
  //   {
  //     id: 'explore-query',
  //     text: 'Query',
  //     icon: 'search',
  //     url: '/explore',
  //   },
  //   {
  //     id: 'explore-metrics',
  //     text: 'Metrics',
  //     icon: 'chart-line',
  //     url: '/explore?left={"datasource":"prometheus","queries":[{"refId":"A"}]}',
  //   },
  //   {
  //     id: 'explore-logs',
  //     text: 'Logs',
  //     icon: 'file-alt',
  //     url: '/explore?left={"datasource":"loki","queries":[{"refId":"A"}]}',
  //   },
  //   {
  //     id: 'explore-profiles',
  //     text: 'Profiles',
  //     icon: 'fire',
  //     url: '/explore?left={"datasource":"phlare","queries":[{"refId":"A"}]}',
  //   },
  // ],
};

/**
 * Section 4: Settings
 * Renamed from "Administration", includes Connections moved from top-level
 */
export const SETTINGS_SECTION: NavModelItem = {
  id: 'settings',
  text: 'Settings',
  icon: 'cog',
  sortWeight: 200,
  children: [
    {
      id: 'settings-connections',
      text: 'Connections',
      icon: 'plug',
      url: '/connections',
    },
    {
      id: 'settings-users',
      text: 'Users',
      icon: 'user',
      url: '/admin/users',
    },
    {
      id: 'settings-orgs',
      text: 'Organizations',
      icon: 'building',
      url: '/admin/orgs',
    },
    {
      id: 'settings-plugins',
      text: 'Plugins',
      icon: 'plug',
      url: '/plugins',
    },
  ],
};

/**
 * Get active navigation item based on current URL
 * Used to highlight the currently active section in the navigation
 */
export function getActiveNavItem(pathname: string): string | undefined {
  // Check NebulaIQ features
  for (const item of NEBULAIQ_FEATURES) {
    if (item.url && pathname.startsWith(item.url)) {
      return item.id;
    }
  }

  // Check explore section
  if (pathname.startsWith('/explore') || pathname.startsWith('/dashboards')) {
    return 'explore';
  }

  // Check settings section
  if (SETTINGS_SECTION.children) {
    for (const child of SETTINGS_SECTION.children) {
      if (child.url && pathname.startsWith(child.url)) {
        return 'settings';
      }
    }
  }

  return undefined;
}
