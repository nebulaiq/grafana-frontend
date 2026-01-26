import { cx, css } from '@emotion/css';
import * as React from 'react';
import SVG from 'react-inlinesvg';

import { GrafanaTheme2 } from '@grafana/data';

import { useStyles2 } from '../../themes';
import { IconSize, isIconSize } from '../../types';
import { t } from '../../utils/i18n';
import { spin } from '../../utils/keyframes';

export interface Props {
  className?: string;
  style?: React.CSSProperties;
  iconClassName?: string;
  inline?: boolean;
  size?: IconSize;
}

/**
 * @deprecated
 * use a predefined size, e.g. 'md' or 'lg' instead
 */
interface PropsWithDeprecatedSize extends Omit<Props, 'size'> {
  size?: number | string;
}

/**
 * @public
 */
export const Spinner = ({
  className,
  inline = false,
  iconClassName,
  style,
  size = 'md',
}: Props | PropsWithDeprecatedSize) => {
  const styles = useStyles2(getStyles);

  const deprecatedStyles = useStyles2(getDeprecatedStyles, size);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Use NebulaIQ logo instead of default Grafana spinner
  const nebulaiqLogoPath = '/public/img/nebulaiq-icon.svg';

  // this entire if statement is handling the deprecated size prop
  // TODO remove once we fully remove the deprecated type
  if (typeof size !== 'string' || !isIconSize(size)) {
    return (
      <div
        data-testid="Spinner"
        style={style}
        className={cx(
          {
            [styles.inline]: inline,
          },
          deprecatedStyles.wrapper,
          className
        )}
      >
        <SVG
          src={nebulaiqLogoPath}
          width={size}
          height={size}
          className={cx(prefersReducedMotion ? '' : styles.spin, deprecatedStyles.icon, className)}
          style={style}
        />
      </div>
    );
  }

  // Get pixel size for the logo based on IconSize
  const sizeInPx = getSizeInPixels(size);

  return (
    <div
      data-testid="Spinner"
      style={style}
      className={cx(
        {
          [styles.inline]: inline,
        },
        className
      )}
    >
      <img
        src={nebulaiqLogoPath}
        alt="Loading"
        width={sizeInPx}
        height={sizeInPx}
        className={cx(prefersReducedMotion ? '' : styles.spin, styles.nebulaiqLogo, iconClassName)}
        aria-label={t('grafana-ui.spinner.aria-label', 'Loading')}
      />
    </div>
  );
};

// Helper function to convert IconSize to pixels
function getSizeInPixels(size: IconSize): number {
  const sizeMap: Record<IconSize, number> = {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
    xxxl: 80,
  };
  return sizeMap[size] || 24;
}

const getStyles = (theme: GrafanaTheme2) => ({
  inline: css({
    display: 'inline-block',
  }),
  spin: css({
    [theme.transitions.handleMotion('no-preference')]: {
      animation: `${spin} 2s infinite linear`,
    },
  }),
  nebulaiqLogo: css({
    display: 'inline-block',
    verticalAlign: 'middle',
    // Ensure the logo stays crisp during rotation
    imageRendering: '-webkit-optimize-contrast',
  }),
});

// TODO remove once we fully remove the deprecated type
const getDeprecatedStyles = (theme: GrafanaTheme2, size: number | string) => ({
  wrapper: css({
    fontSize: typeof size === 'string' ? size : `${size}px`,
  }),
  icon: css({
    display: 'inline-block',
    fill: 'currentColor',
    flexShrink: 0,
    label: 'Icon',
    // line-height: 0; is needed for correct icon alignment in Safari
    lineHeight: 0,
    verticalAlign: 'middle',
  }),
});
