/**
 * RAANJAAI NATURALS — Design System Color Tokens
 */
export const palette = {
  white: '#FFFFFF',
  gold: '#FFBB59',
  amber: '#F18F01',
  forest: '#2D5028',
  burgundy: '#4B0F0F',
} as const;

export const colors = {
  light: {
    background: '#FFFBF5',
    foreground: '#1A1A1A',
    surface: palette.white,
    surfaceMuted: '#FFF8EE',
    border: '#E8DFD0',
    borderStrong: '#D4C4A8',
    primary: palette.forest,
    primaryForeground: palette.white,
    secondary: palette.amber,
    secondaryForeground: palette.white,
    accent: palette.gold,
    accentForeground: palette.burgundy,
    heritage: palette.burgundy,
    heritageForeground: palette.white,
    muted: '#F5EFE6',
    mutedForeground: '#5C5348',
    success: '#2D5028',
    warning: '#F18F01',
    error: '#9B2C2C',
    ring: palette.amber,
  },
  dark: {
    background: '#0F1410',
    foreground: '#F5F0E8',
    surface: '#1A2218',
    surfaceMuted: '#232D22',
    border: '#2E3D2C',
    borderStrong: '#3D5239',
    primary: palette.gold,
    primaryForeground: palette.burgundy,
    secondary: palette.amber,
    secondaryForeground: palette.white,
    accent: palette.forest,
    accentForeground: palette.white,
    heritage: '#6B1A1A',
    heritageForeground: '#F5E6E6',
    muted: '#1E2A1C',
    mutedForeground: '#A8B5A4',
    success: '#6BBF59',
    warning: '#FFBB59',
    error: '#F87171',
    ring: palette.gold,
  },
} as const;

export type ColorMode = keyof typeof colors;
