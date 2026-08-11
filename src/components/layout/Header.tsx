import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useI18n } from '@/i18n/I18nContext';
import { categories } from '@/data/categories';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenMobileMenu: () => void;
}

export function Header({ onOpenSearch, onOpenMobileMenu }: HeaderProps) {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { to: '/tools', label: t('nav.tools') },
    { to: '/categories', label: t('nav.categories') },
    { to: '/popular', label: t('nav.popular') },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'glass border-b border-slate-200/60 dark:border-surface-dark-border/60'
          : 'border-b border-transparent'
      }`}
    >
      <div className="container-wide flex h-12 items-center justify-between gap-4 sm:h-13">
        <div className="flex items-center gap-1">
          <Link to="/" className="flex items-center rounded-lg" aria-label="Calcuio">
            <Logo size={24} />
          </Link>
          <nav className="ms-6 hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-slate-300 hover:text-slate-600 dark:border-surface-dark-border dark:bg-surface-dark-muted/60 dark:hover:text-slate-200 sm:min-w-[180px] md:min-w-[220px]"
            aria-label={t('nav.search')}
          >
            <Search size={15} />
            <span className="hidden sm:inline">{t('search.placeholder.short')}</span>
            <kbd className="ms-auto hidden rounded border border-slate-200 px-1.5 py-0.5 font-mono text-2xs text-slate-400 dark:border-surface-dark-border sm:inline">
              ⌘K
            </kbd>
          </button>

          <div className="hidden items-center sm:flex">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>

          <button
            onClick={onOpenMobileMenu}
            className="btn btn-ghost p-2 md:hidden"
            aria-label={t('nav.menu')}
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  if (!open) return null;

  const navLinks = [
    { to: '/', label: t('app.name') },
    { to: '/tools', label: t('nav.tools') },
    { to: '/categories', label: t('nav.categories') },
    { to: '/popular', label: t('nav.popular') },
    { to: '/about', label: t('nav.about') },
    { to: '/faq', label: t('nav.faq') },
    { to: '/blog', label: t('nav.blog') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/privacy', label: t('nav.privacy') },
    { to: '/terms', label: t('nav.terms') },
  ];

  const handleNavigate = (to: string) => {
    navigate(to);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[90] md:hidden" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute end-0 top-0 h-full w-72 max-w-[85vw] animate-slide-down overflow-y-auto bg-white p-4 shadow-soft-xl dark:bg-surface-dark-subtle">
        <div className="mb-4 flex items-center justify-between">
          <Logo size={24} />
          <button onClick={onClose} className="btn btn-ghost p-2" aria-label={t('common.close')}>
            <X size={18} />
          </button>
        </div>
        <nav className="flex flex-col gap-0.5">
          {navLinks.map((link) => (
            <button
              key={link.to}
              onClick={() => handleNavigate(link.to)}
              className={`rounded-lg px-3 py-2.5 text-start text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-surface-dark-muted'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-4 dark:border-surface-dark-border">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
