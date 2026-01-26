/**
 * NebulaIQ "Obsidian Command Center" Color Palette
 * Violet-tinted dark theme with high contrast text
 */
export const palette = {
  white: '#ffffff',
  black: '#000000',

  // NebulaIQ Dark Grays - Violet-tinted obsidian (not pure black)
  gray25: '#2A2639',  // --bg-surface-highlight
  gray15: '#1A1823',  // --bg-surface-raised
  gray10: '#13111A',  // --bg-surface (panels, cards)
  gray05: '#08070B',  // --bg-base (dashboard background)

  // NebulaIQ Layer system
  darkLayer0: '#08070B',  // Base/canvas background
  darkLayer1: '#13111A',  // Primary surface (panels)
  darkLayer2: '#1A1823',  // Raised surface (cards, dropdowns)

  // NebulaIQ Borders - Very subtle
  darkBorder1: 'rgba(255, 255, 255, 0.06)',  // Subtle border
  darkBorder2: 'rgba(255, 255, 255, 0.12)',  // Medium border

  // Dashboard bg / layer 0 (light theme) - keeping defaults
  gray90: '#f4f5f5',
  gray100: '#f4f5f5',
  gray80: '#d0d1d3',
  lightBorder1: '#e4e7e7',

  // NebulaIQ Accent Colors - Violet as primary
  blueDarkMain: '#8B5CF6',  // Violet primary
  blueDarkText: '#A78BFA',  // Violet text (lighter for readability)
  redDarkMain: '#EF4444',   // Error red
  redDarkText: '#F87171',   // Error text
  greenDarkMain: '#10B981', // Success green
  greenDarkText: '#34D399', // Success text
  orangeDarkMain: '#F97316', // Warning orange
  orangeDarkText: '#FB923C', // Warning text

  // Light theme colors - keeping defaults
  blueLightMain: '#3871dc',
  blueLightText: '#1f62e0',
  redLightMain: '#e0226e',
  redLightText: '#cf0e5B',
  greenLightMain: '#1b855e',
  greenLightText: '#0a764e',
  orangeLightMain: '#ff9900',
  orangeLightText: '#b5510d',

  // NebulaIQ Additional Colors
  violetMain: '#8B5CF6',
  violetText: '#A78BFA',
  violetMuted: 'rgba(139, 92, 246, 0.15)',
  cyanMain: '#06B6D4',
  cyanText: '#22D3EE',
};
