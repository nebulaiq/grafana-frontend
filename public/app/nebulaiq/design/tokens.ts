/**
 * NebulaIQ Design Tokens
 * Inspired by DataDog, Apple, Linear
 * Flat design, no gradients
 */

export const DesignTokens = {
  // Spacing - 8px base grid
  spacing: {
    '0': '0',
    '1': '4px',   // 0.5 × base
    '2': '8px',   // 1 × base
    '3': '12px',  // 1.5 × base
    '4': '16px',  // 2 × base
    '6': '24px',  // 3 × base
    '8': '32px',  // 4 × base
    '10': '40px', // 5 × base
    '12': '48px', // 6 × base
    '16': '64px', // 8 × base
    '20': '80px', // 10 × base
  },

  // Typography
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
  },

  fontSize: {
    '10': '10px',
    '11': '11px',
    '12': '12px',
    '13': '13px',
    '14': '14px',
    '15': '15px',
    '16': '16px',
    '18': '18px',
    '20': '20px',
    '24': '24px',
    '28': '28px',
    '32': '32px',
    '40': '40px',
  },

  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Colors - Flat, no gradients
  colors: {
    // Neutrals (Apple-inspired grays)
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },

    // Primary (NebulaIQ Blue)
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#4da6ff',  // Main brand color
      600: '#3d8ce6',
      700: '#2d7cd6',
      800: '#1e6cc6',
      900: '#1a5cb6',
    },

    // Accent (Teal/Cyan)
    accent: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#00d4aa',  // Secondary brand
      600: '#00c49a',
      700: '#00b48a',
      800: '#00a47a',
      900: '#00946a',
    },

    // Semantic colors
    success: {
      main: '#10b981',
      bg: '#d1fae5',
      text: '#065f46',
    },

    warning: {
      main: '#f59e0b',
      bg: '#fef3c7',
      text: '#92400e',
    },

    error: {
      main: '#ef4444',
      bg: '#fee2e2',
      text: '#991b1b',
    },

    info: {
      main: '#3b82f6',
      bg: '#dbeafe',
      text: '#1e3a8a',
    },
  },

  // Borders
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },

  borderWidth: {
    '0': '0',
    '1': '1px',
    '2': '2px',
    '4': '4px',
  },

  // Shadows - Subtle, Apple-style
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Animation timing
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-index layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
  },
};

export type DesignTokensType = typeof DesignTokens;
