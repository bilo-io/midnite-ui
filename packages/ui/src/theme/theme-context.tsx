'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { THEME_STORAGE_KEY } from './theme-script';

export type ThemePreference = 'light' | 'dawn' | 'dusk' | 'dark' | 'system' | 'time';
export type ResolvedTheme = 'light' | 'dawn' | 'dusk' | 'dark';

type ThemeContextValue = {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (next: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Dawn around sunrise, light during the day, dusk around sunset, dark at night.
function timeOfDayTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  const d = new Date();
  const hour = d.getHours() + d.getMinutes() / 60;
  if (hour >= 5.75 && hour < 6.5) return 'dawn';
  if (hour >= 6.5 && hour < 18) return 'light';
  if (hour >= 18 && hour < 18.75) return 'dusk';
  return 'dark';
}

function resolve(pref: ThemePreference): ResolvedTheme {
  if (pref === 'system') return systemTheme();
  if (pref === 'time') return timeOfDayTheme();
  return pref;
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dawn' || stored === 'dusk' || stored === 'dark' || stored === 'time'
    ? stored
    : 'system';
}

function applyResolved(resolved: ResolvedTheme) {
  const root = document.documentElement;
  const isDark = resolved === 'dark' || resolved === 'dusk';
  root.classList.toggle('dark', isDark);
  if (resolved === 'dawn' || resolved === 'dusk') {
    root.setAttribute('data-theme', resolved);
  } else {
    root.removeAttribute('data-theme');
  }
  root.style.colorScheme = isDark ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [resolved, setResolved] = useState<ResolvedTheme>('dark');

  useEffect(() => {
    const initial = readStoredPreference();
    setPreferenceState(initial);
    setResolved(resolve(initial));
  }, []);

  useEffect(() => {
    if (preference !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => setResolved(mql.matches ? 'dark' : 'light');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [preference]);

  // Re-evaluate periodically so the theme flips at the dawn/day/dusk/night
  // boundaries while the page stays open.
  useEffect(() => {
    if (preference !== 'time') return;
    const tick = () => setResolved(timeOfDayTheme());
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, [preference]);

  useEffect(() => {
    applyResolved(resolved);
  }, [resolved]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    setResolved(resolve(next));
    if (next === 'system') {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    }
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, resolved, setPreference }),
    [preference, resolved, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
