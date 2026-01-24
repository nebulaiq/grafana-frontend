import React from 'react';
import { css } from '@emotion/css';
import { DesignTokens } from '../design/tokens';

export interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  icon?: React.ReactNode;
  name?: string;
  id?: string;
}

export function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  error,
  icon,
  name,
  id,
}: InputProps) {
  const styles = getStyles(error, disabled, !!icon);

  return (
    <div className={styles.wrapper}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={styles.input}
        name={name}
        id={id}
      />
    </div>
  );
}

function getStyles(error?: boolean, disabled?: boolean, hasIcon?: boolean) {
  return {
    wrapper: css({
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    }),

    input: css({
      width: '100%',
      height: '36px',
      padding: hasIcon ? '0 12px 0 36px' : '0 12px',
      fontSize: DesignTokens.fontSize['14'],
      fontFamily: DesignTokens.fontFamily.primary,
      color: DesignTokens.colors.gray[50],
      background: DesignTokens.colors.gray[900], // Flat
      border: `1px solid ${error ? DesignTokens.colors.error.main : DesignTokens.colors.gray[700]}`,
      borderRadius: DesignTokens.borderRadius.md,
      transition: `all ${DesignTokens.transitions.fast}`,
      outline: 'none',

      '&::placeholder': {
        color: DesignTokens.colors.gray[500],
      },

      '&:hover:not(:disabled)': {
        borderColor: DesignTokens.colors.gray[600],
      },

      '&:focus': {
        borderColor: DesignTokens.colors.primary[500],
        // No glow - just subtle ring
        boxShadow: `0 0 0 2px rgba(77, 166, 255, 0.15)`,
      },

      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
      },
    }),

    icon: css({
      position: 'absolute',
      left: '12px',
      color: DesignTokens.colors.gray[500],
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
    }),
  };
}
