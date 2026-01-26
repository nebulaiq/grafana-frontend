import { css } from '@emotion/css';
import { memo } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { SceneTimePicker, SceneRefreshPicker } from '@grafana/scenes';
import { Stack, useStyles2 } from '@grafana/ui';

interface CompactTimeControlsProps {
  timePicker?: SceneTimePicker;
  refreshPicker?: SceneRefreshPicker;
  hideTimeControls?: boolean;
}

/**
 * NebulaIQ Compact Time Controls
 *
 * Renders time picker and refresh controls in a compact format
 * suitable for the top bar. Uses smaller buttons and reduced padding.
 */
export const CompactTimeControls = memo(function CompactTimeControls({
  timePicker,
  refreshPicker,
  hideTimeControls,
}: CompactTimeControlsProps) {
  const styles = useStyles2(getStyles);

  if (hideTimeControls && !refreshPicker) {
    return null;
  }

  return (
    <div className={styles.container}>
      <Stack gap={0.5} alignItems="center" wrap="nowrap">
        {!hideTimeControls && timePicker && (
          <div className={styles.timePickerWrapper}>
            <timePicker.Component model={timePicker} />
          </div>
        )}
        {refreshPicker && (
          <div className={styles.refreshPickerWrapper}>
            <refreshPicker.Component model={refreshPicker} />
          </div>
        )}
      </Stack>
    </div>
  );
});

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    flexShrink: 0,
  }),
  timePickerWrapper: css({
    // Compact styling for time picker
    '& button': {
      height: '28px',
      padding: theme.spacing(0, 0.75),
      fontSize: theme.typography.bodySmall.fontSize,
    },
    '& .refresh-picker button': {
      height: '28px',
    },
  }),
  refreshPickerWrapper: css({
    // Compact styling for refresh picker
    '& button': {
      height: '28px',
      padding: theme.spacing(0, 0.75),
    },
  }),
});
