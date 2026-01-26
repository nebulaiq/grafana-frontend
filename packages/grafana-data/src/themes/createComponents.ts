import { ThemeColors } from './createColors';
import { ThemeShadows } from './createShadows';

/** @beta */
export interface ThemeComponents {
  /** Applies to normal buttons, inputs, radio buttons, etc */
  height: {
    sm: number;
    md: number;
    lg: number;
  };
  input: {
    background: string;
    borderColor: string;
    borderHover: string;
    text: string;
  };
  tooltip: {
    text: string;
    background: string;
  };
  panel: {
    padding: number;
    headerHeight: number;
    borderColor: string;
    boxShadow: string;
    background: string;
  };
  dropdown: {
    background: string;
  };
  overlay: {
    background: string;
  };
  dashboard: {
    background: string;
    padding: number;
  };
  textHighlight: {
    background: string;
    text: string;
  };
  sidemenu: {
    width: number;
  };
  menuTabs: {
    height: number;
  };
  horizontalDrawer: {
    defaultHeight: number;
  };
  table: {
    rowHoverBackground: string;
    rowSelected: string;
  };
}

/**
 * NebulaIQ Component Defaults
 * - Borderless panels (floating card design)
 * - Subtle shadows for depth
 * - Clean, minimal aesthetic
 */
export function createComponents(colors: ThemeColors, shadows: ThemeShadows): ThemeComponents {
  // NebulaIQ: Borderless panels with subtle shadow
  const panel = {
    padding: 1,
    headerHeight: 4,
    background: colors.background.primary,
    borderColor: 'transparent',  // No visible borders
    boxShadow: 'none',           // Clean, no shadow by default
  };

  // NebulaIQ: Subtle input styling - use secondary (raised) background for better contrast
  const input = {
    borderColor: colors.border.weak,     // Very subtle border
    borderHover: colors.border.medium,   // Slightly stronger on hover
    text: colors.text.primary,
    background: colors.background.secondary,  // Raised background for inputs & dropdowns
  };

  return {
    height: {
      sm: 3,
      md: 4,
      lg: 6,
    },
    input,
    panel,
    dropdown: {
      background: input.background,  // Same as input for consistency
    },
    tooltip: {
      background: colors.background.secondary,
      text: colors.text.primary,
    },
    dashboard: {
      background: colors.background.canvas,
      padding: 1,
    },
    overlay: {
      // NebulaIQ: Darker overlay with violet tint
      background: colors.mode === 'dark' ? 'rgba(8, 7, 11, 0.75)' : 'rgba(208, 209, 211, 0.24)',
    },
    sidemenu: {
      width: 56,  // Match our NavRail collapsed width
    },
    menuTabs: {
      height: 5,
    },
    textHighlight: {
      text: colors.warning.contrastText,
      background: colors.warning.main,
    },
    horizontalDrawer: {
      defaultHeight: 400,
    },
    table: {
      rowHoverBackground: colors.action.hover,
      rowSelected: colors.action.selected,
    },
  };
}
