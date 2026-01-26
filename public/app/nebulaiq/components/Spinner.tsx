import { css, keyframes } from '@emotion/css';

export interface NebulaIQSpinnerProps {
  /** Size of the spinner in pixels, or 'sm' | 'md' | 'lg' */
  size?: number | 'sm' | 'md' | 'lg';
  /** Whether to display inline (default: false) */
  inline?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * NebulaIQ Branded Loading Spinner
 * Displays a rotating NebulaIQ logo instead of the default Grafana spinner
 */
export function NebulaIQSpinner({ size = 'md', inline = false, className }: NebulaIQSpinnerProps) {
  const sizeInPx = typeof size === 'number' ? size : getSizeInPixels(size);
  const styles = getStyles(sizeInPx, inline);

  return (
    <span className={css(styles.container, className)}>
      <img
        src="/public/img/nebulaiq-icon.svg"
        alt="Loading..."
        className={styles.spinner}
        width={sizeInPx}
        height={sizeInPx}
      />
    </span>
  );
}

function getSizeInPixels(size: 'sm' | 'md' | 'lg'): number {
  const sizes = {
    sm: 16,
    md: 24,
    lg: 32,
  };
  return sizes[size];
}

function getStyles(size: number, inline: boolean) {
  const rotate = keyframes`
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  `;

  return {
    container: css({
      display: inline ? 'inline-flex' : 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
    }),
    spinner: css({
      display: 'block',
      width: `${size}px`,
      height: `${size}px`,
      animation: `${rotate} 2s linear infinite`,
      // Ensure the logo stays crisp during rotation
      imageRendering: '-webkit-optimize-contrast',
    }),
  };
}
