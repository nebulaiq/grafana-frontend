import { css, cx } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';

import { useStyles2 } from '../../themes';
import { InlineList } from '../List/InlineList';
import { List } from '../List/List';

import { VizLegendListItem } from './VizLegendListItem';
import { VizLegendBaseProps, VizLegendItem } from './types';

export interface Props<T> extends VizLegendBaseProps<T> {}

/**
 * @internal
 */
export const VizLegendList = <T extends unknown>({
  items,
  itemRenderer,
  onLabelMouseOver,
  onLabelMouseOut,
  onLabelClick,
  placement,
  className,
  readonly,
}: Props<T>) => {
  const styles = useStyles2(getStyles);

  if (!itemRenderer) {
    /* eslint-disable-next-line react/display-name */
    itemRenderer = (item) => (
      <VizLegendListItem
        item={item}
        onLabelClick={onLabelClick}
        onLabelMouseOver={onLabelMouseOver}
        onLabelMouseOut={onLabelMouseOut}
        readonly={readonly}
      />
    );
  }

  const getItemKey = (item: VizLegendItem<T>) => `${item.getItemKey ? item.getItemKey() : item.label}`;

  switch (placement) {
    case 'top': {
      const renderItem = (item: VizLegendItem<T>, index: number) => {
        return <span className={styles.itemTop}>{itemRenderer!(item, index)}</span>;
      };

      return (
        <div className={cx(styles.topWrapper, className)}>
          <InlineList items={items} renderItem={renderItem} getItemKey={getItemKey} />
        </div>
      );
    }
    case 'right': {
      const renderItem = (item: VizLegendItem<T>, index: number) => {
        return <span className={styles.itemRight}>{itemRenderer!(item, index)}</span>;
      };

      return (
        <div className={cx(styles.rightWrapper, className)}>
          <List items={items} renderItem={renderItem} getItemKey={getItemKey} />
        </div>
      );
    }
    case 'bottom':
    default: {
      const leftItems = items.filter((item) => item.yAxis === 1);
      const rightItems = items.filter((item) => item.yAxis !== 1);

      const renderItem = (item: VizLegendItem<T>, index: number) => {
        return <span className={styles.itemBottom}>{itemRenderer!(item, index)}</span>;
      };

      return (
        <div className={cx(styles.bottomWrapper, className)}>
          {leftItems.length > 0 && (
            <div className={styles.section}>
              <InlineList items={leftItems} renderItem={renderItem} getItemKey={getItemKey} />
            </div>
          )}
          {rightItems.length > 0 && (
            <div className={cx(styles.section, styles.sectionRight)}>
              <InlineList items={rightItems} renderItem={renderItem} getItemKey={getItemKey} />
            </div>
          )}
        </div>
      );
    }
  }
};

VizLegendList.displayName = 'VizLegendList';

const getStyles = (theme: GrafanaTheme2) => {
  const itemStyles = css({
    paddingRight: '10px',
    display: 'flex',
    fontSize: theme.typography.bodySmall.fontSize,
    whiteSpace: 'nowrap',
  });

  return {
    itemTop: css({
      paddingRight: '6px', // NebulaIQ: Spacing between legend items (max 6px)
      display: 'flex',
      fontSize: '12px', // Compact font for top placement
      whiteSpace: 'nowrap',
      lineHeight: '1.2',
      alignItems: 'center', // Ensure vertical centering within item
    }),
    itemBottom: itemStyles,
    itemRight: cx(
      itemStyles,
      css({
        marginBottom: theme.spacing(0.5),
      })
    ),
    topWrapper: css({
      display: 'flex',
      flexWrap: 'nowrap',
      overflow: 'hidden',
      padding: '0', // NebulaIQ: No wrapper padding, spacing handled by items
      gap: '0', // NebulaIQ: No gap, spacing handled by itemTop paddingRight
      alignItems: 'center',
      justifyContent: 'flex-end', // Right-align legend items
      height: '32px', // Match panel header height
    }),
    rightWrapper: css({
      padding: theme.spacing(0.5),
    }),
    bottomWrapper: css({
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%',
      padding: theme.spacing(0.5),
      gap: '15px 25px',
    }),
    section: css({
      display: 'flex',
    }),
    sectionRight: css({
      justifyContent: 'flex-end',
      flexGrow: 1,
      flexBasis: '50%',
    }),
  };
};
