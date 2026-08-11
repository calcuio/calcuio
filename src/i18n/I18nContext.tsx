import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Locale } from '@/types';
import {
  defaultLocale,
  localeDirections,
  localeNames,
  locales,
  translate,
} from '@/i18n/translations';

interface I18nContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  localeNames: Record<Locale, string>;
  locales: Locale[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'calcuio:locale';

function detectInitialLocale(): Locale {
  if (typeof window === 'undefined') return defaultLocale;
  const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && locales.includes(stored)) return stored;
  const browser = navigator.language.slice(0, 2);
  if (locales.includes(browser as Locale)) return browser as Locale;
  return defaultLocale;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    setLocaleState(detectInitialLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const dir = localeDirections[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale, dir]);

  const t = useCallback((key: string) => translate(locale, key), [locale]);

  const value = useMemo(
    () => ({ locale, dir, setLocale, t, localeNames, locales }),
    [locale, dir, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
