import React from 'react';
import { css } from '@emotion/css';
import { DesignTokens } from '../design/tokens';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled,
  loading,
  icon,
  type = 'button',
}: ButtonProps) {
  const styles = getStyles(variant, size, disabled);

  return (
    <button type={type} className={styles.button} onClick={onClick} disabled={disabled || loading}>
      {loading && <Spinner size={size} />}
      {!loading && icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

function Spinner({ size }: { size: string }) {
  const spinnerSize = size === 'sm' ? 12 : size === 'lg' ? 20 : 16;

  const styles = css({
    display: 'inline-block',
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: '#ffffff',
    borderRadius: '50%',
    animation: 'spin 600ms linear infinite',

    '@keyframes spin': {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  });

  return <span className={styles} />;
}

function getStyles(variant: string, size: string, disabled?: boolean) {
  // Base styles
  const baseButton = css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: DesignTokens.spacing['2'],
    fontFamily: DesignTokens.fontFamily.primary,
    fontWeight: DesignTokens.fontWeight.medium,
    border: 'none',
    borderRadius: DesignTokens.borderRadius.md,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${DesignTokens.transitions.fast}`,
    outline: 'none',
    position: 'relative',

    // No gradients! Flat colors only
    '&:focus-visible': {
      boxShadow: `0 0 0 2px ${DesignTokens.colors.primary[500]}`,
    },

    opacity: disabled ? 0.5 : 1,
  });

  // Size variants
  const sizeStyles: Record<string, any> = {
    sm: {
      height: '28px',
      padding: '0 12px',
      fontSize: DesignTokens.fontSize['12'],
    },
    md: {
      height: '36px',
      padding: '0 16px',
      fontSize: DesignTokens.fontSize['14'],
    },
    lg: {
      height: '44px',
      padding: '0 24px',
      fontSize: DesignTokens.fontSize['16'],
    },
  };

  // Variant styles - ALL FLAT, NO GRADIENTS
  const variantStyles: Record<string, any> = {
    primary: {
      background: DesignTokens.colors.primary[500],
      color: '#ffffff',

      '&:hover:not(:disabled)': {
        background: DesignTokens.colors.primary[600], // Flat darker
      },

      '&:active:not(:disabled)': {
        background: DesignTokens.colors.primary[700], // Even darker flat
      },
    },

    secondary: {
      background: DesignTokens.colors.gray[800],
      color: DesignTokens.colors.gray[50],

      '&:hover:not(:disabled)': {
        background: DesignTokens.colors.gray[700],
      },

      '&:active:not(:disabled)': {
        background: DesignTokens.colors.gray[600],
      },
    },

    ghost: {
      background: 'transparent',
      color: DesignTokens.colors.gray[300],

      '&:hover:not(:disabled)': {
        background: 'rgba(255, 255, 255, 0.05)', // Subtle flat overlay
      },

      '&:active:not(:disabled)': {
        background: 'rgba(255, 255, 255, 0.1)',
      },
    },

    danger: {
      background: DesignTokens.colors.error.main,
      color: '#ffffff',

      '&:hover:not(:disabled)': {
        background: '#dc2626', // Darker flat red
      },

      '&:active:not(:disabled)': {
        background: '#b91c1c',
      },
    },
  };

  return {
    button: css(baseButton, sizeStyles[size], variantStyles[variant]),
    icon: css({
      display: 'flex',
      alignItems: 'center',
    }),
  };
}
