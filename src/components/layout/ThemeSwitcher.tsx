import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/theme/ThemeContext';
import { track } from '@/lib/analytics';
import { useI18n } from '@/i18n/I18nContext';
import { useState, useRef, useEffect } from 'react';

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (m: 'light' | 'dark' | 'system') => {
    setMode(m);
    track('theme_change', { theme: m });
    setOpen(false);
  };

  const Icon = mode === 'dark' ? Moon : mode === 'light' ? Sun : Monitor;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="btn btn-ghost p-2"
        aria-label={t('nav.theme')}
        title={t('nav.theme')}
      >
        <Icon size={18} />
      </button>
      {open && (
        <div className="absolute end-0 mt-2 w-36 animate-scale-in rounded-xl border border-slate-200/80 bg-white p-1 shadow-soft-lg dark:border-surface-dark-border dark:bg-surface-dark-subtle">
          {([
            { value: 'light', label: t('theme.light'), icon: Sun },
            { value: 'dark', label: t('theme.dark'), icon: Moon },
            { value: 'system', label: t('theme.system'), icon: Monitor },
          ] as const).map(({ value, label, icon: I }) => (
            <button
              key={value}
              onClick={() => handleChange(value)}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                mode === value
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-dark-muted'
              }`}
            >
              <I size={15} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
