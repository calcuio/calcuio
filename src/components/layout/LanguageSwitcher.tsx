import { Globe, Check } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { track } from '@/lib/analytics';
import { useState, useRef, useEffect } from 'react';

export function LanguageSwitcher() {
  const { locale, setLocale, locales, localeNames } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (l: typeof locale) => {
    setLocale(l);
    track('language_change', { locale: l });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-ghost p-2"
        aria-label="Language"
        title="Language"
      >
        <Globe size={18} />
      </button>
      {open && (
        <div className="absolute end-0 mt-2 w-36 animate-scale-in rounded-xl border border-slate-200/80 bg-white p-1 shadow-soft-lg dark:border-surface-dark-border dark:bg-surface-dark-subtle">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => handleSelect(l)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                locale === l
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-dark-muted'
              }`}
            >
              {localeNames[l]}
              {locale === l && <Check size={15} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
