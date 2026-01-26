import { css, cx } from '@emotion/css';
import { HTMLProps } from 'react';
import * as React from 'react';

import { GrafanaTheme2, NavModelItem } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { useStyles2 } from '../../themes';
import { getFocusStyles } from '../../themes/mixins';
import { IconName } from '../../types';
import { clearButtonStyles } from '../Button';
import { Icon } from '../Icon/Icon';

import { Counter } from './Counter';

export interface TabProps extends HTMLProps<HTMLElement> {
  label: string;
  active?: boolean;
  /** When provided, it is possible to use the tab as a hyperlink. Use in cases where the tabs update location. */
  href?: string;
  icon?: IconName;
  onChangeTab?: (event: React.MouseEvent<HTMLElement>) => void;
  /** A number rendered next to the text. Usually used to display the number of items in a tab's view. */
  counter?: number | null;
  /** Extra content, displayed after the tab label and counter */
  suffix?: NavModelItem['tabSuffix'];
}

export const Tab = React.forwardRef<HTMLElement, TabProps>(
  ({ label, active, icon, onChangeTab, counter, suffix: Suffix, className, href, ...otherProps }, ref) => {
    const tabsStyles = useStyles2(getStyles);
    const clearStyles = useStyles2(clearButtonStyles);

    const content = () => (
      <>
        {icon && <Icon name={icon} />}
        {label}
        {typeof counter === 'number' && <Counter value={counter} />}
        {Suffix && <Suffix className={tabsStyles.suffix} />}
      </>
    );

    const linkClass = cx(clearStyles, tabsStyles.link, active ? tabsStyles.activeStyle : tabsStyles.notActive);

    const commonProps = {
      className: linkClass,
      'data-testid': selectors.components.Tab.title(label),
      ...otherProps,
      onClick: onChangeTab,
      role: 'tab',
      'aria-selected': active,
    };

    if (href) {
      return (
        <div className={tabsStyles.item}>
          <a
            {...commonProps}
            href={href}
            // don't think we can avoid the type assertion here :(
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            ref={ref as React.ForwardedRef<HTMLAnchorElement>}
          >
            {content()}
          </a>
        </div>
      );
    }

    return (
      <div className={tabsStyles.item}>
        <button
          {...commonProps}
          type="button"
          // don't think we can avoid the type assertion here :(
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          ref={ref as React.ForwardedRef<HTMLButtonElement>}
        >
          {content()}
        </button>
      </div>
    );
  }
);

Tab.displayName = 'Tab';

/**
 * NebulaIQ: Pill-style tabs
 * - No bottom indicator bar
 * - Background color for active state
 * - Rounded pill shape
 */
const getStyles = (theme: GrafanaTheme2) => {
  return {
    item: css({
      listStyle: 'none',
      position: 'relative',
      display: 'flex',
      whiteSpace: 'nowrap',
      padding: 0,  // NebulaIQ: No extra padding, handled by link
    }),
    link: css({
      color: theme.colors.text.secondary,
      padding: theme.spacing(1, 2),  // NebulaIQ: Pill padding
      borderRadius: theme.spacing(1),  // NebulaIQ: Rounded pill
      display: 'flex',
      alignItems: 'center',
      height: 'auto',
      transition: 'all 150ms ease',
      textDecoration: 'none',

      svg: {
        marginRight: theme.spacing(1),
      },

      '&:focus-visible': getFocusStyles(theme),

      // NebulaIQ: Remove the bottom indicator bar
      '&::before': {
        display: 'none',
      },
    }),
    notActive: css({
      'a:hover, &:hover, &:focus': {
        color: theme.colors.text.primary,
        background: 'rgba(255, 255, 255, 0.06)',  // NebulaIQ: Subtle hover
        textDecoration: 'none',
      },
    }),
    activeStyle: css({
      label: 'activeTabStyle',
      color: theme.colors.text.primary,
      background: 'rgba(255, 255, 255, 0.10)',  // NebulaIQ: Active background
      overflow: 'hidden',

      // NebulaIQ: No bottom indicator
      '&::before': {
        display: 'none',
      },
    }),
    suffix: css({
      marginLeft: theme.spacing(1),
    }),
  };
};
