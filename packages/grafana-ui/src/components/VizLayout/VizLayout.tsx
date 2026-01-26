import { css } from '@emotion/css';
import { FC, CSSProperties, ComponentType, useEffect, useRef } from 'react';
import * as React from 'react';
import { useMeasure } from 'react-use';

import { GrafanaTheme2 } from '@grafana/data';
import { getAppEvents } from '@grafana/runtime';
import { LegendPlacement } from '@grafana/schema';

import { useStyles2, useTheme2 } from '../../themes/ThemeContext';
import { getFocusStyles } from '../../themes/mixins';
import { SetHeaderLegendEvent } from '../PanelChrome/PanelEvents';
import { ScrollContainer } from '../ScrollContainer/ScrollContainer';

/**
 * @beta
 */
export interface VizLayoutProps {
  width: number;
  height: number;
  legend?: React.ReactElement<VizLayoutLegendProps> | null;
  children: (width: number, height: number) => React.ReactNode;
}

/**
 * @beta
 */
export interface VizLayoutComponentType extends FC<VizLayoutProps> {
  Legend: ComponentType<VizLayoutLegendProps>;
}

/**
 * @beta
 */
export const VizLayout: VizLayoutComponentType = ({ width, height, legend, children }) => {
  const theme = useTheme2();
  const styles = useStyles2(getVizStyles);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerStyle: CSSProperties = {
    display: 'flex',
    width: `${width}px`,
    height: `${height}px`,
  };
  const [legendRef, legendMeasure] = useMeasure<HTMLDivElement>();
  // Track if we've emitted the legend event to prevent infinite loops
  const legendEmittedRef = useRef<boolean>(false);

  if (!legend) {
    return (
      <>
        <div style={containerStyle} className={styles.viz}>
          {children(width, height)}
        </div>
      </>
    );
  }

  // Compute the actual placement based on screen size
  let { placement, maxHeight = '35%' } = legend.props;

  if (document.body.clientWidth < theme.breakpoints.values.lg) {
    placement = 'bottom';
  }

  // For top placement, pass legend to panel header via event bus
  useEffect(() => {
    console.log('[VizLayout] useEffect - placement:', placement, 'hasLegend:', !!legend, 'alreadyEmitted:', legendEmittedRef.current);

    if (placement === 'top' && !legendEmittedRef.current) {
      // Find the parent PanelChrome by traversing up the DOM
      let panelId: string | null = null;
      let element: HTMLElement | null = containerRef.current;

      while (element && !panelId) {
        element = element.parentElement;
        if (element?.hasAttribute('data-panel-instance-id')) {
          panelId = element.getAttribute('data-panel-instance-id');
        }
      }

      if (!panelId) {
        console.warn('[VizLayout] Could not find parent panel ID, skipping legend event');
        return undefined;
      }

      const eventBus = getAppEvents();
      console.log('[VizLayout] Emitting header legend event for panel', panelId);
      eventBus.publish(new SetHeaderLegendEvent({ panelId, legend }));
      legendEmittedRef.current = true;

      return () => {
        // Clear legend on unmount
        console.log('[VizLayout] Emitting clear header legend event for panel', panelId);
        eventBus.publish(new SetHeaderLegendEvent({ panelId, legend: null }));
        legendEmittedRef.current = false;
      };
    }

    // If placement changed away from 'top', clear the flag
    if (placement !== 'top') {
      legendEmittedRef.current = false;
    }

    // Return empty cleanup function when condition is not met
    return undefined;
  }, [placement]); // Only depend on placement, not legend

  let size: VizSize | null = null;

  const legendStyle: CSSProperties = {};

  switch (placement) {
    case 'top':
      // Top placement: legend is rendered in panel header via context
      // Don't render legend here, just use full dimensions for chart
      containerStyle.flexDirection = 'column';
      size = { width, height };
      break;
    case 'bottom':
      containerStyle.flexDirection = 'column';
      legendStyle.maxHeight = maxHeight;

      if (legendMeasure.height) {
        size = { width, height: height - legendMeasure.height };
      }
      break;
    case 'right':
      containerStyle.flexDirection = 'row';

      if (legendMeasure.width) {
        size = { width: width - legendMeasure.width, height };
      }

      if (legend.props.width) {
        legendStyle.width = legend.props.width;
        size = { width: width - legend.props.width, height };
      }
      break;
  }

  // This happens when position is switched from bottom to right
  // Then we preserve old with for one render cycle until legend is measured in it's new position
  if (size?.width === 0) {
    size.width = width;
  }

  if (size?.height === 0) {
    size.height = height;
  }

  return (
    <div style={containerStyle} ref={containerRef}>
      {/* Top placement legends are rendered in panel header via context, not here */}
      <div className={styles.viz}>{size && children(size.width, size.height)}</div>
      {placement !== 'top' && (
        <div style={legendStyle} ref={legendRef}>
          <ScrollContainer>{legend}</ScrollContainer>
        </div>
      )}
    </div>
  );
};

export const getVizStyles = (theme: GrafanaTheme2) => {
  return {
    viz: css({
      flexGrow: 2,
      borderRadius: theme.shape.radius.default,
      '&:focus-visible': getFocusStyles(theme),
    }),
  };
};
interface VizSize {
  width: number;
  height: number;
}

/**
 * @beta
 */
export interface VizLayoutLegendProps {
  placement: LegendPlacement;
  children: React.ReactNode;
  maxHeight?: string;
  maxWidth?: string;
  width?: number;
}

/**
 * @beta
 */
export const VizLayoutLegend: FC<VizLayoutLegendProps> = ({ children }) => {
  return <>{children}</>;
};

VizLayout.Legend = VizLayoutLegend;
