import { getActiveNavItem, NEBULAIQ_FEATURES, EXPLORE_SECTION, SETTINGS_SECTION } from '../navigation';

describe('NebulaIQ Navigation', () => {
  describe('NEBULAIQ_FEATURES', () => {
    it('should have 10 top-level feature items', () => {
      expect(NEBULAIQ_FEATURES.length).toBe(10);
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
        'redux-test': '/a/nebulaiq-telemetry-app/redux-test',
        'redux-scene-test': '/a/nebulaiq-telemetry-app/redux-scene-test',
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

  describe('EXPLORE_SECTION', () => {
    it('should have correct structure', () => {
      expect(EXPLORE_SECTION.id).toBe('explore');
      expect(EXPLORE_SECTION.text).toBe('Explore');
      expect(EXPLORE_SECTION.url).toBe('/dashboards');
      expect(EXPLORE_SECTION.icon).toBe('compass');
    });

    it('should have 4 child items', () => {
      expect(EXPLORE_SECTION.children).toHaveLength(4);
    });

    it('should have correct child items', () => {
      const childIds = EXPLORE_SECTION.children?.map((child) => child.id);
      expect(childIds).toContain('explore-query');
      expect(childIds).toContain('explore-metrics');
      expect(childIds).toContain('explore-logs');
      expect(childIds).toContain('explore-profiles');
    });
  });

  describe('SETTINGS_SECTION', () => {
    it('should have correct structure', () => {
      expect(SETTINGS_SECTION.id).toBe('settings');
      expect(SETTINGS_SECTION.text).toBe('Settings');
      expect(SETTINGS_SECTION.icon).toBe('cog');
    });

    it('should have 4 child items', () => {
      expect(SETTINGS_SECTION.children).toHaveLength(4);
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
    it('should identify active nav item for Service Performance', () => {
      const path = '/a/nebulaiq-telemetry-app/service-performance';
      const active = getActiveNavItem(path);
      expect(active).toBe('service-performance');
    });

    it('should identify active nav item for Infrastructure', () => {
      const path = '/a/nebulaiq-telemetry-app/infrastructure';
      const active = getActiveNavItem(path);
      expect(active).toBe('infrastructure');
    });

    it('should identify active nav item for Logs', () => {
      const path = '/a/nebulaiq-telemetry-app/logs';
      const active = getActiveNavItem(path);
      expect(active).toBe('logs');
    });

    it('should identify active nav item for Traces', () => {
      const path = '/a/nebulaiq-telemetry-app/traces';
      const active = getActiveNavItem(path);
      expect(active).toBe('traces');
    });

    it('should identify active nav item for Architecture Insights', () => {
      const path = '/a/nebulaiq-telemetry-app/architecture-insights';
      const active = getActiveNavItem(path);
      expect(active).toBe('architecture-insights');
    });

    it('should identify active nav item for Integrations', () => {
      const path = '/a/nebulaiq-telemetry-app/integrations';
      const active = getActiveNavItem(path);
      expect(active).toBe('integrations');
    });

    it('should identify active nav item for Hosts', () => {
      const path = '/a/nebulaiq-telemetry-app/host';
      const active = getActiveNavItem(path);
      expect(active).toBe('hosts');
    });

    it('should identify active nav item for Pods', () => {
      const path = '/a/nebulaiq-telemetry-app/pod';
      const active = getActiveNavItem(path);
      expect(active).toBe('pods');
    });

    it('should identify explore as active for /dashboards', () => {
      const active = getActiveNavItem('/dashboards');
      expect(active).toBe('explore');
    });

    it('should identify explore as active for /explore', () => {
      const active = getActiveNavItem('/explore');
      expect(active).toBe('explore');
    });

    it('should identify settings as active for /connections', () => {
      const active = getActiveNavItem('/connections');
      expect(active).toBe('settings');
    });

    it('should identify settings as active for /admin/users', () => {
      const active = getActiveNavItem('/admin/users');
      expect(active).toBe('settings');
    });

    it('should identify settings as active for /admin/orgs', () => {
      const active = getActiveNavItem('/admin/orgs');
      expect(active).toBe('settings');
    });

    it('should identify settings as active for /plugins', () => {
      const active = getActiveNavItem('/plugins');
      expect(active).toBe('settings');
    });

    it('should return undefined for unknown paths', () => {
      const active = getActiveNavItem('/unknown/path');
      expect(active).toBeUndefined();
    });
  });
});
