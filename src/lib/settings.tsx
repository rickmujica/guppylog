import { getLocales } from 'expo-localization';
import Storage from 'expo-sqlite/kv-store';
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { makeTranslate, type Lang, type Translate } from './i18n';
import { buildTheme, type AccentName, type Theme, type ThemeMode } from './theme';

export type TempUnit = 'C' | 'F';
export type VolumeUnit = 'L' | 'gal';

export type Settings = {
  /** null = follow the phone until the user picks one. */
  mode: ThemeMode | null;
  accent: AccentName;
  lang: Lang;
  tempUnit: TempUnit;
  volumeUnit: VolumeUnit;
};

const KEY = 'guppylog.settings.v1';

function defaultLang(): Lang {
  const code = getLocales()[0]?.languageCode ?? 'es';
  return code === 'en' ? 'en' : 'es';
}

function loadSettings(): Settings {
  const defaults: Settings = { mode: null, accent: 'agua', lang: defaultLang(), tempUnit: 'C', volumeUnit: 'L' };
  try {
    const raw = Storage.getItemSync(KEY);
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return defaults;
  }
}

type SettingsContextValue = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  theme: Theme;
  t: Translate;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        Storage.setItemSync(KEY, JSON.stringify(next));
      } catch {
        // Settings still apply for this session even if saving fails.
      }
      return next;
    });
  }, []);

  const mode: ThemeMode = settings.mode ?? (system === 'dark' ? 'dark' : 'light');
  const value = useMemo(
    () => ({ settings, update, theme: buildTheme(mode, settings.accent), t: makeTranslate(settings.lang) }),
    [settings, update, mode],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}

/** Shortcut for screens that only need colors and strings. */
export function useUI() {
  const { theme, t, settings } = useSettings();
  return { theme, t, lang: settings.lang, settings };
}
