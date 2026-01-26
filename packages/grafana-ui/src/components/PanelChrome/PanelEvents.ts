import { BusEventWithPayload } from '@grafana/data';
import { LegendDisplayMode, LegendPlacement } from '@grafana/schema';
import { VizLegendItem, SeriesVisibilityChangeBehavior } from '../VizLegend/types';

/**
 * Legend props data to be passed to PanelChrome for rendering in header
 * @internal
 */
export interface LegendPropsData<T = any> {
  items: Array<VizLegendItem<T>>;
  thresholdItems?: Array<VizLegendItem<T>>;
  mappingItems?: Array<VizLegendItem<T>>;
  placement: LegendPlacement;
  displayMode: LegendDisplayMode;
  sortBy?: string;
  sortDesc?: boolean;
  seriesVisibilityChangeBehavior?: SeriesVisibilityChangeBehavior;
  isSortable?: boolean;
  readonly?: boolean;
}

/**
 * Payload for SetHeaderLegendEvent
 * @internal
 */
export interface SetHeaderLegendEventPayload {
  panelId: string;
  legendProps: LegendPropsData | null;
}

/**
 * Event published when a visualization wants to set or clear the header legend
 * @internal
 */
export class SetHeaderLegendEvent extends BusEventWithPayload<SetHeaderLegendEventPayload> {
  static type = 'set-header-legend';
}
