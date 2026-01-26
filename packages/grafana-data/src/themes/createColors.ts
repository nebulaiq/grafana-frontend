import { merge } from 'lodash';

import { alpha, darken, emphasize, getContrastRatio, lighten } from './colorManipulator';
import { palette } from './palette';
import { DeepPartial, ThemeRichColor } from './types';

/** @internal */
export type ThemeColorsMode = 'light' | 'dark';

/** @internal */
export interface ThemeColorsBase<TColor> {
  mode: ThemeColorsMode;

  primary: TColor;
  secondary: TColor;
  info: TColor;
  error: TColor;
  success: TColor;
  warning: TColor;

  text: {
    primary: string;
    secondary: string;
    disabled: string;
    link: string;
    /** Used for auto white or dark text on colored backgrounds */
    maxContrast: string;
  };

  background: {
    /** Dashboard and body background */
    canvas: string;
    /** Primary content pane background (panels etc) */
    primary: string;
    /** Cards and elements that need to stand out on the primary background */
    secondary: string;
  };

  border: {
    weak: string;
    medium: string;
    strong: string;
  };

  gradients: {
    brandVertical: string;
    brandHorizontal: string;
  };

  action: {
    /** Used for selected menu item / select option */
    selected: string;
    /**
     * @alpha (Do not use from plugins)
     * Used for selected items when background only change is not enough (Currently only used for FilterPill)
     **/
    selectedBorder: string;
    /** Used for hovered menu item / select option */
    hover: string;
    /** Used for button/colored background hover opacity */
    hoverOpacity: number;
    /** Used focused menu item / select option */
    focus: string;
    /** Used for disabled buttons and inputs */
    disabledBackground: string;
    /** Disabled text */
    disabledText: string;
    /** Disablerd opacity */
    disabledOpacity: number;
  };

  hoverFactor: number;
  contrastThreshold: number;
  tonalOffset: number;
}

export interface ThemeHoverStrengh {}

/** @beta */
export interface ThemeColors extends ThemeColorsBase<ThemeRichColor> {
  /** Returns a text color for the background */
  getContrastText(background: string, threshold?: number): string;
  /* Brighten or darken a color by specified factor (0-1) */
  emphasize(color: string, amount?: number): string;
}

/** @internal */
export type ThemeColorsInput = DeepPartial<ThemeColorsBase<ThemeRichColor>>;

/**
 * NebulaIQ "Obsidian Command Center" Dark Theme
 * Features:
 * - Violet-tinted backgrounds (not pure black)
 * - High contrast white text
 * - White links (not blue/purple) for cleaner look
 * - Subtle borders
 * - Violet accent color
 */
class DarkColors implements ThemeColorsBase<Partial<ThemeRichColor>> {
  mode: ThemeColorsMode = 'dark';

  // NebulaIQ: Pure white base for high contrast text
  whiteBase = '255, 255, 255';

  // NebulaIQ: Very subtle borders
  border = {
    weak: `rgba(${this.whiteBase}, 0.06)`,    // Barely visible
    medium: `rgba(${this.whiteBase}, 0.10)`,  // Subtle
    strong: `rgba(${this.whiteBase}, 0.15)`,  // Visible but not harsh
  };

  // NebulaIQ: High contrast text with white links (not blue)
  text = {
    primary: `rgba(${this.whiteBase}, 0.95)`,    // Near-white for max readability
    secondary: `rgba(${this.whiteBase}, 0.65)`,  // Secondary content
    disabled: `rgba(${this.whiteBase}, 0.40)`,   // Disabled/tertiary
    link: `rgba(${this.whiteBase}, 0.85)`,       // White links, NOT blue
    maxContrast: palette.white,
  };

  // NebulaIQ: Violet as primary accent
  primary = {
    main: palette.blueDarkMain,     // Violet (#8B5CF6)
    text: palette.blueDarkText,     // Lighter violet for text
    border: palette.blueDarkText,
  };

  // NebulaIQ: Subtle secondary colors
  secondary = {
    main: `rgba(${this.whiteBase}, 0.08)`,       // Subtle background
    shade: `rgba(${this.whiteBase}, 0.12)`,      // Slightly stronger
    transparent: `rgba(${this.whiteBase}, 0.06)`, // Very subtle
    text: this.text.primary,
    contrastText: `rgba(${this.whiteBase}, 0.95)`,
    border: `rgba(${this.whiteBase}, 0.06)`,
  };

  info = this.primary;

  error = {
    main: palette.redDarkMain,
    text: palette.redDarkText,
  };

  success = {
    main: palette.greenDarkMain,
    text: palette.greenDarkText,
  };

  warning = {
    main: palette.orangeDarkMain,
    text: palette.orangeDarkText,
  };

  // NebulaIQ: Violet-tinted backgrounds
  background = {
    canvas: palette.gray05,     // #08070B - darkest, dashboard bg
    primary: palette.gray10,    // #13111A - panels, cards
    secondary: palette.gray15,  // #1A1823 - raised elements
  };

  // NebulaIQ: Subtle interaction states
  action = {
    hover: `rgba(${this.whiteBase}, 0.06)`,      // Subtle hover
    selected: `rgba(${this.whiteBase}, 0.08)`,   // Selected state
    selectedBorder: palette.blueDarkMain,        // Violet border for selected
    focus: `rgba(${this.whiteBase}, 0.10)`,      // Focus state
    hoverOpacity: 0.06,
    disabledText: this.text.disabled,
    disabledBackground: `rgba(${this.whiteBase}, 0.02)`,
    disabledOpacity: 0.38,
  };

  // NebulaIQ: Violet-based gradients
  gradients = {
    brandHorizontal: 'linear-gradient(270deg, #8B5CF6 0%, #A78BFA 100%)',
    brandVertical: 'linear-gradient(0.01deg, #8B5CF6 0.01%, #A78BFA 99.99%)',
  };

  contrastThreshold = 3;
  hoverFactor = 0.03;
  tonalOffset = 0.15;
}

class LightColors implements ThemeColorsBase<Partial<ThemeRichColor>> {
  mode: ThemeColorsMode = 'light';

  blackBase = '36, 41, 46';

  primary = {
    main: palette.blueLightMain,
    border: palette.blueLightText,
    text: palette.blueLightText,
  };

  text = {
    primary: `rgba(${this.blackBase}, 1)`,
    secondary: `rgba(${this.blackBase}, 0.75)`,
    disabled: `rgba(${this.blackBase}, 0.64)`,
    link: this.primary.text,
    maxContrast: palette.black,
  };

  border = {
    weak: `rgba(${this.blackBase}, 0.12)`,
    medium: `rgba(${this.blackBase}, 0.3)`,
    strong: `rgba(${this.blackBase}, 0.4)`,
  };

  secondary = {
    main: `rgba(${this.blackBase}, 0.08)`,
    shade: `rgba(${this.blackBase}, 0.15)`,
    transparent: `rgba(${this.blackBase}, 0.08)`,
    contrastText: `rgba(${this.blackBase},  1)`,
    text: this.text.primary,
    border: this.border.weak,
  };

  info = {
    main: palette.blueLightMain,
    text: palette.blueLightText,
  };

  error = {
    main: palette.redLightMain,
    text: palette.redLightText,
    border: palette.redLightText,
  };

  success = {
    main: palette.greenLightMain,
    text: palette.greenLightText,
  };

  warning = {
    main: palette.orangeLightMain,
    text: palette.orangeLightText,
  };

  background = {
    canvas: palette.gray90,
    primary: palette.white,
    secondary: palette.gray100,
  };

  action = {
    hover: `rgba(${this.blackBase}, 0.12)`,
    selected: `rgba(${this.blackBase}, 0.08)`,
    selectedBorder: palette.orangeLightMain,
    hoverOpacity: 0.08,
    focus: `rgba(${this.blackBase}, 0.12)`,
    disabledBackground: `rgba(${this.blackBase}, 0.04)`,
    disabledText: this.text.disabled,
    disabledOpacity: 0.38,
  };

  gradients = {
    brandHorizontal: 'linear-gradient(90deg, #FF8833 0%, #F53E4C 100%)',
    brandVertical: 'linear-gradient(0.01deg, #F53E4C -31.2%, #FF8833 113.07%)',
  };

  contrastThreshold = 3;
  hoverFactor = 0.03;
  tonalOffset = 0.2;
}

export function createColors(colors: ThemeColorsInput): ThemeColors {
  const dark = new DarkColors();
  const light = new LightColors();
  const base = (colors.mode ?? 'dark') === 'dark' ? dark : light;
  const {
    primary = base.primary,
    secondary = base.secondary,
    info = base.info,
    warning = base.warning,
    success = base.success,
    error = base.error,
    tonalOffset = base.tonalOffset,
    hoverFactor = base.hoverFactor,
    contrastThreshold = base.contrastThreshold,
    ...other
  } = colors;

  function getContrastText(background: string, threshold: number = contrastThreshold) {
    const contrastText =
      getContrastRatio(dark.text.maxContrast, background, base.background.primary) >= threshold
        ? dark.text.maxContrast
        : light.text.maxContrast;
    // todo, need color framework
    return contrastText;
  }

  const getRichColor = ({ color, name }: GetRichColorProps): ThemeRichColor => {
    color = { ...color, name };
    if (!color.main) {
      color.main = base[name].main;
    }
    if (!color.text) {
      color.text = color.main;
    }
    if (!color.border) {
      color.border = color.text;
    }
    if (!color.shade) {
      color.shade = base.mode === 'light' ? darken(color.main, tonalOffset) : lighten(color.main, tonalOffset);
    }
    if (!color.transparent) {
      color.transparent = alpha(color.main, 0.15);
    }
    if (!color.contrastText) {
      color.contrastText = getContrastText(color.main);
    }
    if (!color.borderTransparent) {
      color.borderTransparent = alpha(color.border, 0.25);
    }
    return color as ThemeRichColor;
  };

  return merge(
    {
      ...base,
      primary: getRichColor({ color: primary, name: 'primary' }),
      secondary: getRichColor({ color: secondary, name: 'secondary' }),
      info: getRichColor({ color: info, name: 'info' }),
      error: getRichColor({ color: error, name: 'error' }),
      success: getRichColor({ color: success, name: 'success' }),
      warning: getRichColor({ color: warning, name: 'warning' }),
      getContrastText,
      emphasize: (color: string, factor?: number) => {
        return emphasize(color, factor ?? hoverFactor);
      },
    },
    other
  );
}

type RichColorNames = 'primary' | 'secondary' | 'info' | 'error' | 'success' | 'warning';

interface GetRichColorProps {
  color: Partial<ThemeRichColor>;
  name: RichColorNames;
}
