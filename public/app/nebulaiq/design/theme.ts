import { DesignTokens } from './tokens';

/**
 * NebulaIQ Theme Configuration
 * This provides CSS custom properties and design tokens for the NebulaIQ UI
 *
 * Note: For full Grafana theme integration, use this alongside CSS variables
 * defined in the SCSS files
 */

export const NebulaIQThemeConfig = {
  colors: {
    background: {
      primary: DesignTokens.colors.gray[950],
      secondary: DesignTokens.colors.gray[900],
      canvas: DesignTokens.colors.gray[950],
    },
    border: {
      weak: DesignTokens.colors.gray[800],
      medium: DesignTokens.colors.gray[700],
      strong: DesignTokens.colors.gray[600],
    },
    text: {
      primary: DesignTokens.colors.gray[50],
      secondary: DesignTokens.colors.gray[300],
      disabled: DesignTokens.colors.gray[600],
    },
    primary: {
      main: DesignTokens.colors.primary[500],
      text: DesignTokens.colors.primary[500],
      border: DesignTokens.colors.primary[600],
    },
    success: DesignTokens.colors.success,
    warning: DesignTokens.colors.warning,
    error: DesignTokens.colors.error,
    info: DesignTokens.colors.info,
  },
  typography: {
    fontFamily: DesignTokens.fontFamily.primary,
    fontFamilyMonospace: DesignTokens.fontFamily.mono,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: DesignTokens.fontWeight.regular,
    fontWeightMedium: DesignTokens.fontWeight.medium,
    fontWeightBold: DesignTokens.fontWeight.bold,
  },
  spacing: {
    gridSize: 8, // 8px base grid
  },
  shape: {
    borderRadius: 6, // 6px default
  },
  shadows: DesignTokens.shadows,
};

export type NebulaIQThemeConfig = typeof NebulaIQThemeConfig;
