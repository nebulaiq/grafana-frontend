import * as React from 'react';

export interface AppChromeUpdateProps {
  /** Actions to display in the top bar (right side) */
  actions?: React.ReactNode;
}

/**
 * Component that updates the App Chrome (top bar) with the provided actions.
 * This is useful for plugins that want to add time controls or other actions
 * to the unified top bar.
 *
 * @alpha
 */
export let AppChromeUpdate: React.ComponentType<AppChromeUpdateProps> = () => {
  // Default implementation does nothing - real implementation is set at runtime
  return null;
};

/**
 * Sets the AppChromeUpdate component implementation.
 * Called during Grafana application initialization.
 *
 * @internal
 */
export function setAppChromeUpdate(component: React.ComponentType<AppChromeUpdateProps>) {
  AppChromeUpdate = component;
}
