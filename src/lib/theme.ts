export type AccentName = 'agua' | 'azul' | 'coral' | 'violeta';
export type ThemeMode = 'light' | 'dark';

/** Each accent has a darker shade for white backgrounds and a lighter one for black backgrounds. */
export const ACCENTS: Record<AccentName, { light: string; dark: string }> = {
  agua: { light: '#0D7F73', dark: '#2DD4BF' },
  azul: { light: '#2563EB', dark: '#60A5FA' },
  coral: { light: '#C2410C', dark: '#FB923C' },
  violeta: { light: '#7C3AED', dark: '#A78BFA' },
};

export const ACCENT_NAMES = Object.keys(ACCENTS) as AccentName[];

export type Theme = {
  mode: ThemeMode;
  bg: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  accent: string;
  onAccent: string;
  accentSoft: string;
  warn: string;
  danger: string;
};

export function buildTheme(mode: ThemeMode, accentName: AccentName): Theme {
  const accent = ACCENTS[accentName] ?? ACCENTS.agua;
  if (mode === 'dark') {
    return {
      mode,
      bg: '#000000',
      surface: '#141414',
      border: '#2A2A2A',
      text: '#FAFAFA',
      muted: '#A3A3A3',
      accent: accent.dark,
      onAccent: '#000000',
      accentSoft: accent.dark + '26',
      warn: '#FBBF24',
      danger: '#F87171',
    };
  }
  return {
    mode,
    bg: '#FFFFFF',
    surface: '#F4F4F5',
    border: '#E4E4E7',
    text: '#0A0A0A',
    muted: '#52525B',
    accent: accent.light,
    onAccent: '#FFFFFF',
    accentSoft: accent.light + '1A',
    warn: '#B45309',
    danger: '#B91C1C',
  };
}

export const radius = { sm: 10, md: 14, lg: 16, pill: 999 } as const;
export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24 } as const;
