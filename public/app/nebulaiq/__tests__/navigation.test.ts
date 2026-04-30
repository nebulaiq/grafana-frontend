import { config } from '@grafana/runtime';

import {
  getActiveNavItem,
  getEnabledFeatures,
  isPageEnabled,
  NEBULAIQ_FEATURES,
  EXPLORE_SECTION,
  SETTINGS_SECTION,
} from '../navigation';

describe('NebulaIQ Navigation', () => {
  describe('NEBULAIQ_FEATURES', () => {
    it('should have 8 top-level feature items', () => {
      expect(NEBULAIQ_FEATURES.length).toBe(8);
    });

    it('should have all required feature items', () => {
      const featureIds = NEBULAIQ_FEATURES.map((item) => item.id);
      expect(featureIds).toContain('service-performance');
      expect(featureIds).toContain('infrastructure');
      expect(featureIds).toContain('logs');
      expect(featureIds).toContain('traces');
      expect(featureIds).toContain('architecture-insights');
      expect(featureIds).toContain('integrations');
      expect(featureIds).toContain('hosts');
      expect(featureIds).toContain('pods');
    });

    it('should have correct URLs for all features', () => {
      const features: Record<string, string> = {
        'service-performance': '/a/nebulaiq-telemetry-app/service-performance',
        infrastructure: '/a/nebulaiq-telemetry-app/infrastructure',
        logs: '/a/nebulaiq-telemetry-app/logs',
        traces: '/a/nebulaiq-telemetry-app/traces',
        'architecture-insights': '/a/nebulaiq-telemetry-app/architecture-insights',
        integrations: '/a/nebulaiq-telemetry-app/integrations',
        hosts: '/a/nebulaiq-telemetry-app/host',
        pods: '/a/nebulaiq-telemetry-app/pod',
      };

      NEBULAIQ_FEATURES.forEach((item) => {
        if (features[item.id!]) {
          expect(item.url).toBe(features[item.id!]);
        }
      });
    });

    it('should have icons for all features', () => {
      NEBULAIQ_FEATURES.forEach((item) => {
        expect(item.icon).toBeDefined();
      });
    });
  });

  describe('getEnabledFeatures', () => {
    afterEach(() => {
      (config as any).nebulaiqEnabledPages = undefined;
    });

    it('should return all features when nebulaiqEnabledPages is undefined', () => {
      (config as any).nebulaiqEnabledPages = undefined;
      expect(getEnabledFeatures()).toEqual(NEBULAIQ_FEATURES);
    });

    it('should return all features when nebulaiqEnabledPages is empty array', () => {
      (config as any).nebulaiqEnabledPages = [];
      expect(getEnabledFeatures()).toEqual(NEBULAIQ_FEATURES);
    });

    it('should filter features when nebulaiqEnabledPages is set', () => {
      (config as any).nebulaiqEnabledPages = ['logs', 'traces'];
      const enabled = getEnabledFeatures();
      expect(enabled).toHaveLength(2);
      expect(enabled.map((f) => f.id)).toEqual(['logs', 'traces']);
    });

    it('should return empty array when no valid IDs are configured', () => {
      (config as any).nebulaiqEnabledPages = ['nonexistent'];
      expect(getEnabledFeatures()).toHaveLength(0);
    });

    it('should preserve sort order from NEBULAIQ_FEATURES', () => {
      (config as any).nebulaiqEnabledPages = ['traces', 'logs'];
      const enabled = getEnabledFeatures();
      expect(enabled[0].id).toBe('logs');
      expect(enabled[1].id).toBe('traces');
    });
  });

  describe('isPageEnabled', () => {
    afterEach(() => {
      (config as any).nebulaiqEnabledPages = undefined;
    });

    it('should return true for any page when config is not set', () => {
      (config as any).nebulaiqEnabledPages = undefined;
      expect(isPageEnabled('logs')).toBe(true);
    });

    it('should return true for enabled pages', () => {
      (config as any).nebulaiqEnabledPages = ['logs', 'traces'];
      expect(isPageEnabled('logs')).toBe(true);
    });

    it('should return false for disabled pages', () => {
      (config as any).nebulaiqEnabledPages = ['logs', 'traces'];
      expect(isPageEnabled('hosts')).toBe(false);
    });
  });

  describe('EXPLORE_SECTION', () => {
    it('should have correct structure', () => {
      expect(EXPLORE_SECTION.id).toBe('explore');
      expect(EXPLORE_SECTION.text).toBe('Explore');
      expect(EXPLORE_SECTION.url).toBe('/dashboards');
      expect(EXPLORE_SECTION.icon).toBe('compass');
    });

    it('should have child items', () => {
      expect(EXPLORE_SECTION.children).toBeDefined();
      expect(EXPLORE_SECTION.children!.length).toBeGreaterThan(0);
    });

    it('should have correct child items', () => {
      const childIds = EXPLORE_SECTION.children?.map((child) => child.id);
      expect(childIds).toContain('explore-query');
      expect(childIds).toContain('explore-metrics');
      expect(childIds).toContain('explore-profiles');
    });
  });

  describe('SETTINGS_SECTION', () => {
    it('should have correct structure', () => {
      expect(SETTINGS_SECTION.id).toBe('settings');
      expect(SETTINGS_SECTION.text).toBe('Settings');
      expect(SETTINGS_SECTION.icon).toBe('cog');
    });

    it('should have child items', () => {
      expect(SETTINGS_SECTION.children).toBeDefined();
      expect(SETTINGS_SECTION.children!.length).toBeGreaterThan(0);
    });

    it('should have correct child items', () => {
      const childIds = SETTINGS_SECTION.children?.map((child) => child.id);
      expect(childIds).toContain('settings-connections');
      expect(childIds).toContain('settings-users');
      expect(childIds).toContain('settings-orgs');
      expect(childIds).toContain('settings-plugins');
    });

    it('should include Connections in settings', () => {
      const connections = SETTINGS_SECTION.children?.find((child) => child.id === 'settings-connections');
      expect(connections).toBeDefined();
      expect(connections?.url).toBe('/connections');
    });
  });

  describe('getActiveNavItem', () => {
    afterEach(() => {
      (config as any).nebulaiqEnabledPages = undefined;
    });

    it('should identify active nav item for Service Performance', () => {
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/service-performance')).toBe('service-performance');
    });

    it('should identify active nav item for Infrastructure', () => {
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/infrastructure')).toBe('infrastructure');
    });

    it('should identify active nav item for Logs', () => {
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/logs')).toBe('logs');
    });

    it('should identify active nav item for Traces', () => {
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/traces')).toBe('traces');
    });

    it('should identify active nav item for Architecture Insights', () => {
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/architecture-insights')).toBe('architecture-insights');
    });

    it('should identify active nav item for Integrations', () => {
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/integrations')).toBe('integrations');
    });

    it('should identify active nav item for Hosts', () => {
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/host')).toBe('hosts');
    });

    it('should identify active nav item for Pods', () => {
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/pod')).toBe('pods');
    });

    it('should identify explore as active for /dashboards', () => {
      expect(getActiveNavItem('/dashboards')).toBe('explore');
    });

    it('should identify explore as active for /explore', () => {
      expect(getActiveNavItem('/explore')).toBe('explore');
    });

    it('should identify settings as active for /connections', () => {
      expect(getActiveNavItem('/connections')).toBe('settings');
    });

    it('should identify settings as active for /admin/users', () => {
      expect(getActiveNavItem('/admin/users')).toBe('settings');
    });

    it('should identify settings as active for /admin/orgs', () => {
      expect(getActiveNavItem('/admin/orgs')).toBe('settings');
    });

    it('should identify settings as active for /plugins', () => {
      expect(getActiveNavItem('/plugins')).toBe('settings');
    });

    it('should return undefined for unknown paths', () => {
      expect(getActiveNavItem('/unknown/path')).toBeUndefined();
    });

    it('should not match disabled pages as active', () => {
      (config as any).nebulaiqEnabledPages = ['logs'];
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/traces')).toBeUndefined();
      expect(getActiveNavItem('/a/nebulaiq-telemetry-app/logs')).toBe('logs');
    });
  });
});
