import { css, cx } from '@emotion/css';
import { forwardRef, ReactNode } from 'react';

import { GrafanaTheme2 } from '@grafana/data';

import { useStyles2 } from '../../themes';

export interface Props {
  /** Children should be a single <Tab /> or an array of <Tab /> */
  children: ReactNode;
  className?: string;
  /** For hiding the bottom border (on PageHeader for example) */
  hideBorder?: boolean;
}

export const TabsBar = forwardRef<HTMLDivElement, Props>(({ children, className, hideBorder = false }, ref) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={cx(styles.tabsWrapper, hideBorder && styles.noBorder, className)} ref={ref}>
      <div className={styles.tabs} role="tablist">
        {children}
      </div>
    </div>
  );
});

/**
 * NebulaIQ: Pill-style tabs
 * - No bottom border
 * - Subtle background container
 * - Rounded pill shape
 */
const getStyles = (theme: GrafanaTheme2) => ({
  tabsWrapper: css({
    borderBottom: 'none',  // NebulaIQ: No bottom border
    overflowX: 'auto',
  }),
  noBorder: css({
    borderBottom: 0,
  }),
  tabs: css({
    position: 'relative',
    display: 'inline-flex',
    height: 'auto',
    alignItems: 'center',
    // NebulaIQ: Pill container background
    background: 'rgba(255, 255, 255, 0.04)',
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(1.25),
    gap: theme.spacing(0.5),
  }),
});

TabsBar.displayName = 'TabsBar';
