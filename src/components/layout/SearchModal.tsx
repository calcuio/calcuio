import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { searchTools, getSuggestions } from '@/lib/search';
import { track } from '@/lib/analytics';
import { categories, getCategory } from '@/data/categories';
import { ToolIcon } from '@/components/tools/ToolIcon';
import type { Tool } from '@/types';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const { t, dir } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => searchTools(query, 8), [query]);
  const suggestions = useMemo(() => getSuggestions(query), [query]);
  const allItems = results.map((r) => r.tool);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && allItems[activeIndex]) {
        selectTool(allItems[activeIndex]);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, activeIndex, allItems]);

  const selectTool = (tool: Tool) => {
    track('search_result_click', { tool_id: tool.id, query });
    navigate(`/tools/${tool.slug}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[8vh]" role="dialog" aria-modal="true" aria-label={t('nav.search')}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl animate-scale-in overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft-xl dark:border-surface-dark-border dark:bg-surface-dark-subtle">
        <div className="flex items-center gap-3 border-b border-slate-200/80 px-4 py-3 dark:border-surface-dark-border">
          <Search size={20} className="shrink-0 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) track('search', { query: e.target.value });
            }}
            placeholder={t('search.placeholder')}
            className="flex-1 bg-transparent text-base text-slate-900 placeholder-slate-400 outline-none dark:text-white dark:placeholder-slate-500"
            aria-label={t('nav.search')}
          />
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-dark-muted" aria-label={t('common.close')}>
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin p-2">
          {!query && (
  <div className="py-3">
    <p className="px-3 pb-2 text-2xs font-semibold uppercase tracking-wider text-slate-400">
      Popular tools
    </p>

    {categories.slice(0, 3).map((cat) => (
      <Link
        key={cat.id}
        to={`/categories/${cat.slug}`}
        onClick={onClose}
        className="mb-1 block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-dark-muted"
      >
        {t(cat.nameKey)}
      </Link>
    ))}
  </div>
)}
            {suggestions.length > 0 && (
  <div className="mb-2 border-b border-slate-100 pb-2 dark:border-surface-dark-border">
    <p className="px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-slate-400">
      Suggestions
    </p>

    {suggestions.map((s) => (
      <button
        key={s}
        onClick={() => setQuery(s)}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-dark-muted"
      >
        <Search size={13} className="text-slate-400" />
        {s}
      </button>
    ))}
  </div>
)}
          {results.length > 0 && (
            <div>
              <p className="px-3 py-1 text-2xs font-semibold uppercase tracking-wider text-slate-400">{t('search.results')}</p>
              {results.map((result, i) => {
                const tool = result.tool;
                const cat = getCategory(tool.category);
                return (
                  <button
                    key={tool.id}
                    onClick={() => selectTool(tool)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition-colors ${
                      activeIndex === i
                        ? 'bg-brand-50 dark:bg-brand-500/10'
                        : 'hover:bg-slate-50 dark:hover:bg-surface-dark-muted'
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-surface-dark-muted dark:text-slate-400">
                      <ToolIcon name={tool.icon} size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{tool.name}</p>
                      <p className="truncate text-xs text-slate-400">{cat ? t(cat.nameKey) : ''} · {tool.description}</p>
                    </div>
                    {activeIndex === i && (
                      <CornerDownLeft size={14} className="shrink-0 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

               <div className="flex items-center justify-between border-t border-slate-200/80 px-4 py-2.5 text-2xs text-slate-400 dark:border-surface-dark-border">
          <span className="hidden sm:flex items-center gap-2">
  <kbd className="rounded border border-slate-200 px-1.5 py-0.5 font-mono dark:border-surface-dark-border">↑↓</kbd>
  to navigate
  <kbd className="ms-2 rounded border border-slate-200 px-1.5 py-0.5 font-mono dark:border-surface-dark-border">↵</kbd>
  to select
</span>

          <button
            onClick={() => {
              navigate('/tools');
              onClose();
            }}
            className="flex items-center gap-1 font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            {t('search.seeAll')}
            <ArrowRight size={12} className={dir === 'rtl' ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
}
