import { Component } from 'react';
import * as React from 'react';
import uPlot, { AlignedData } from 'uplot';

import {
  DataFrame,
  DataLinkPostProcessor,
  Field,
  FieldMatcherID,
  fieldMatchers,
  FieldType,
  getLinksSupplier,
  InterpolateFunction,
  TimeRange,
  TimeZone,
} from '@grafana/data';
import { DashboardCursorSync, VizLegendOptions } from '@grafana/schema';
import { getAppEvents } from '@grafana/runtime';
import { Themeable2, VizLayout } from '@grafana/ui';
import { SeriesVisibilityChangedEvent } from '@grafana/ui/src/components/PanelChrome/PanelEvents';
import { UPlotChart } from '@grafana/ui/src/components/uPlot/Plot';
import { AxisProps } from '@grafana/ui/src/components/uPlot/config/UPlotAxisBuilder';
import { Renderers, UPlotConfigBuilder } from '@grafana/ui/src/components/uPlot/config/UPlotConfigBuilder';
import { ScaleProps } from '@grafana/ui/src/components/uPlot/config/UPlotScaleBuilder';
import { pluginLog } from '@grafana/ui/src/components/uPlot/utils';

import { GraphNGLegendEvent, XYFieldMatchers } from './types';
import { preparePlotFrame as defaultPreparePlotFrame } from './utils';

/**
 * @internal -- not a public API
 */
export type PropDiffFn<T extends Record<string, unknown> = {}> = (prev: T, next: T) => boolean;

export interface GraphNGProps extends Themeable2 {
  frames: DataFrame[];
  structureRev?: number; // a number that will change when the frames[] structure changes
  width: number;
  height: number;
  timeRange: TimeRange;
  timeZone: TimeZone[] | TimeZone;
  legend: VizLegendOptions;
  fields?: XYFieldMatchers; // default will assume timeseries data
  renderers?: Renderers;
  tweakScale?: (opts: ScaleProps, forField: Field) => ScaleProps;
  tweakAxis?: (opts: AxisProps, forField: Field) => AxisProps;
  onLegendClick?: (event: GraphNGLegendEvent) => void;
  children?: (builder: UPlotConfigBuilder, alignedFrame: DataFrame) => React.ReactNode;
  prepConfig: (alignedFrame: DataFrame, allFrames: DataFrame[], getTimeRange: () => TimeRange) => UPlotConfigBuilder;
  propsToDiff?: Array<string | PropDiffFn>;
  preparePlotFrame?: (frames: DataFrame[], dimFields: XYFieldMatchers) => DataFrame | null;
  renderLegend: (config: UPlotConfigBuilder) => React.ReactElement | null;
  replaceVariables: InterpolateFunction;
  dataLinkPostProcessor?: DataLinkPostProcessor;
  cursorSync?: DashboardCursorSync;

  // Remove fields that are hidden from the visualization before rendering
  // The fields will still be available for other things like data links
  // this is a temporary hack that only works when:
  // 1. renderLegend (above) does not render <PlotLegend>
  // 2. does not have legend series toggle
  // 3. passes through all fields required for link/action gen (including those with hideFrom.viz)
  omitHideFromViz?: boolean;

  /**
   * needed for propsToDiff to re-init the plot & config
   * this is a generic approach to plot re-init, without having to specify which panel-level options
   * should cause invalidation. we can drop this in favor of something like panelOptionsRev that gets passed in
   * similar to structureRev. then we can drop propsToDiff entirely.
   */
  options?: Record<string, any>;
}

function sameProps<T extends Record<string, unknown>>(
  prevProps: T,
  nextProps: T,
  propsToDiff: Array<string | PropDiffFn> = []
) {
  for (const propName of propsToDiff) {
    if (typeof propName === 'function') {
      if (!propName(prevProps, nextProps)) {
        return false;
      }
    } else if (nextProps[propName] !== prevProps[propName]) {
      return false;
    }
  }

  return true;
}

/**
 * @internal -- not a public API
 */
export interface GraphNGState {
  alignedFrame: DataFrame;
  alignedData?: AlignedData;
  config?: UPlotConfigBuilder;
}

const defaultMatchers = {
  x: fieldMatchers.get(FieldMatcherID.firstTimeField).get({}),
  y: fieldMatchers.get(FieldMatcherID.byTypes).get(new Set([FieldType.number, FieldType.enum])),
};

/**
 * "Time as X" core component, expects ascending x
 */
export class GraphNG extends Component<GraphNGProps, GraphNGState> {
  private plotInstance: React.RefObject<uPlot>;

  constructor(props: GraphNGProps) {
    super(props);
    let state = this.prepState(props);
    state.alignedData = state.config!.prepData!([state.alignedFrame]) as AlignedData;
    this.state = state;
    this.plotInstance = React.createRef();
  }

  componentDidMount() {
    // Subscribe to series visibility changes from the global app event bus
    const eventBus = getAppEvents();
    console.log('[GraphNG] Subscribing to SeriesVisibilityChangedEvent');
    this.seriesVisibilitySubscription = eventBus.subscribe(SeriesVisibilityChangedEvent, (event) => {
      console.log('[GraphNG] Received SeriesVisibilityChangedEvent:', event);
      const { label, mode, panelId } = event.payload;

      // Filter by panelId if provided (to avoid cross-panel interference)
      // Find the panel container element that wraps this GraphNG instance
      const plot = this.plotInstance.current;
      if (panelId && plot) {
        const plotElement = (plot as any).root;
        const panelElement = plotElement?.closest('[data-panel-instance-id]');
        const thisPanelId = panelElement?.getAttribute('data-panel-instance-id');
        if (thisPanelId && thisPanelId !== panelId) {
          console.log('[GraphNG] Ignoring event for different panel:', { thisPanelId, eventPanelId: panelId });
          return;
        }
      }

      // Get the aligned frame to match field display names
      const { alignedFrame } = this.state;
      if (!alignedFrame) {
        console.warn('[GraphNG] No aligned frame available');
        return;
      }

      // Find the field index for the clicked series
      const fieldIndex = alignedFrame.fields.findIndex((field) => {
        const displayName = field.config?.displayName || field.name;
        return displayName === label;
      });

      console.log('[GraphNG] Found field index for', label, ':', fieldIndex);

      if (fieldIndex <= 0) {
        console.warn('[GraphNG] Field not found or is time field (idx:', fieldIndex, ')');
        return;
      }

      if (!plot || !plot.series || !plot.series[fieldIndex]) {
        console.warn('[GraphNG] Plot or series not available at index', fieldIndex);
        return;
      }

      // Implement isolate behavior
      if (mode === 'select') {
        // ToggleSelection mode: Isolate this series
        // Check if this is the only visible series
        const visibleSeriesCount = plot.series.filter((s, idx) => idx > 0 && s.show).length;
        const isOnlyVisible = visibleSeriesCount === 1 && plot.series[fieldIndex].show;

        console.log('[GraphNG] Isolate mode - visibleCount:', visibleSeriesCount, 'isOnlyVisible:', isOnlyVisible);

        if (isOnlyVisible) {
          // Show all series (restore)
          for (let i = 1; i < plot.series.length; i++) {
            if (!plot.series[i].show) {
              plot.setSeries(i, { show: true });
            }
          }
          console.log('[GraphNG] Restored all series');
        } else {
          // Hide all series except this one (isolate)
          for (let i = 1; i < plot.series.length; i++) {
            const shouldShow = i === fieldIndex;
            if (plot.series[i].show !== shouldShow) {
              plot.setSeries(i, { show: shouldShow });
            }
          }
          console.log('[GraphNG] Isolated series', label, 'at index', fieldIndex);
        }
      } else if (mode === 'append') {
        // AppendToSelection mode: Toggle this series
        const currentShow = plot.series[fieldIndex].show;
        plot.setSeries(fieldIndex, { show: !currentShow });
        console.log('[GraphNG] Toggled series', label, 'at index', fieldIndex, 'show:', !currentShow);
      }
    });
  }

  componentWillUnmount() {
    // Unsubscribe from events
    if (this.seriesVisibilitySubscription) {
      this.seriesVisibilitySubscription.unsubscribe();
    }
  }

  private seriesVisibilitySubscription?: any;

  getTimeRange = () => this.props.timeRange;

  prepState(props: GraphNGProps, withConfig = true) {
    let state: GraphNGState = null as any;

    const { frames, fields = defaultMatchers, preparePlotFrame, replaceVariables, dataLinkPostProcessor } = props;

    const preparePlotFrameFn = preparePlotFrame ?? defaultPreparePlotFrame;

    const withLinks = frames.some((frame) => frame.fields.some((field) => (field.config.links?.length ?? 0) > 0));

    const alignedFrame = preparePlotFrameFn(
      frames,
      {
        ...fields,
        // if there are data links, keep all fields during join so they're index-matched
        y: withLinks ? () => true : fields.y,
      },
      props.timeRange
    );

    pluginLog('GraphNG', false, 'data aligned', alignedFrame);

    if (alignedFrame) {
      let alignedFrameFinal = alignedFrame;

      if (withLinks) {
        const timeZone = Array.isArray(this.props.timeZone) ? this.props.timeZone[0] : this.props.timeZone;

        // for links gen we need to use original frames but with the aligned/joined data values
        let linkFrames = frames.map((frame, frameIdx) => ({
          ...frame,
          fields: alignedFrame.fields.filter(
            (field, fieldIdx) => fieldIdx === 0 || field.state?.origin?.frameIndex === frameIdx
          ),
          length: alignedFrame.length,
        }));

        linkFrames.forEach((linkFrame, frameIndex) => {
          linkFrame.fields.forEach((field) => {
            field.getLinks = getLinksSupplier(
              linkFrame,
              field,
              {
                ...field.state?.scopedVars,
                __dataContext: {
                  value: {
                    data: linkFrames,
                    field: field,
                    frame: linkFrame,
                    frameIndex,
                  },
                },
              },
              replaceVariables,
              timeZone,
              dataLinkPostProcessor
            );
          });
        });

        // filter join field and fields.y
        alignedFrameFinal = {
          ...alignedFrame,
          fields: alignedFrame.fields.filter((field, i) => i === 0 || fields.y(field, alignedFrame, [alignedFrame])),
        };
      }

      if (props.omitHideFromViz) {
        const nonHiddenFields = alignedFrameFinal.fields.filter((field) => field.config.custom?.hideFrom?.viz !== true);
        alignedFrameFinal = {
          ...alignedFrameFinal,
          fields: nonHiddenFields,
          length: nonHiddenFields.length,
        };
      }

      let config = this.state?.config;

      if (withConfig) {
        config = props.prepConfig(alignedFrameFinal, this.props.frames, this.getTimeRange);
        pluginLog('GraphNG', false, 'config prepared', config);
      }

      state = {
        alignedFrame: alignedFrameFinal,
        config,
      };

      pluginLog('GraphNG', false, 'data prepared', state.alignedData);
    }

    return state;
  }

  componentDidUpdate(prevProps: GraphNGProps) {
    const { frames, structureRev, timeZone, cursorSync, propsToDiff } = this.props;

    const propsChanged = !sameProps(prevProps, this.props, propsToDiff);

    if (
      frames !== prevProps.frames ||
      propsChanged ||
      timeZone !== prevProps.timeZone ||
      cursorSync !== prevProps.cursorSync
    ) {
      let newState = this.prepState(this.props, false);

      if (newState) {
        const shouldReconfig =
          this.state.config === undefined ||
          timeZone !== prevProps.timeZone ||
          cursorSync !== prevProps.cursorSync ||
          structureRev !== prevProps.structureRev ||
          !structureRev ||
          propsChanged;

        if (shouldReconfig) {
          newState.config = this.props.prepConfig(newState.alignedFrame, this.props.frames, this.getTimeRange);
          pluginLog('GraphNG', false, 'config recreated', newState.config);
        }

        newState.alignedData = newState.config!.prepData!([newState.alignedFrame]) as AlignedData;

        this.setState(newState);
      }
    }
  }

  // onToggleSeriesVisibility removed - this is now handled by VizPanel through
  // field config updates. VizPanel's context provides the handler that updates
  // fieldConfig.overrides to set custom.hideFrom.viz for hidden series.

  render() {
    const { width, height, children, renderLegend } = this.props;
    const { config, alignedFrame, alignedData } = this.state;

    console.log('[GraphNG] render called');

    if (!config) {
      return null;
    }

    // Series visibility is handled through field config (custom.hideFrom.viz)
    // VizPanel's onToggleSeriesVisibility updates field config, which is then
    // applied during data preparation in applyFieldConfig
    let displayData = alignedData;

    return (
      <VizLayout width={width} height={height} legend={renderLegend(config)}>
        {(vizWidth: number, vizHeight: number) => (
          <UPlotChart
            config={config}
            data={displayData!}
            width={vizWidth}
            height={vizHeight}
            plotRef={(u) => ((this.plotInstance as React.MutableRefObject<uPlot>).current = u)}
          >
            {children ? children(config, alignedFrame) : null}
          </UPlotChart>
        )}
      </VizLayout>
    );
  }
}

// GraphNGWithContext removed - VizPanel already provides onToggleSeriesVisibility
// through its PanelContext, which updates field config to hide series.
// The wrapper was breaking the context chain by creating a new provider.
