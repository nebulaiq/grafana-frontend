import { ReactNode } from 'react';

import { BusEventWithPayload } from '@grafana/data';

/**
 * Payload for SetHeaderLegendEvent
 * @internal
 */
export interface SetHeaderLegendEventPayload {
  panelId: string;
  legend: ReactNode;
}

/**
 * Event published when a visualization wants to set or clear the header legend
 * @internal
 */
export class SetHeaderLegendEvent extends BusEventWithPayload<SetHeaderLegendEventPayload> {
  static type = 'set-header-legend';
}

/**
 * Payload for SeriesVisibilityChangedEvent
 * @internal
 */
export interface SeriesVisibilityChangedEventPayload {
  label: string;
  mode: string;
  hiddenSeries: string[];
  panelId?: string; // Optional panel ID for filtering events
}

/**
 * Event published when series visibility is toggled
 * @internal
 */
export class SeriesVisibilityChangedEvent extends BusEventWithPayload<SeriesVisibilityChangedEventPayload> {
  static type = 'series-visibility-changed';
}
