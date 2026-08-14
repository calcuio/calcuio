import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useSEO } from '@/lib/seo';
import { tools } from '@/data/tools';
import { categories, getCategory } from '@/data/categories';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { ToolIcon } from '@/components/tools/ToolIcon';

export function ToolsPage() {
  const { t } = useI18n();
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');

  useSEO({ title: `${t('page.tools.title')} | Calcuio`, description: t('page.tools.sub'), canonical: '/tools' });

  const filtered = useMemo(() => {
    let list = tools;
    if (activeCat !== 'all') list = list.filter((tool) => tool.category === activeCat);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((tool) =>
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.includes(q)),
      );
    }
    return list;
  }, [query, activeCat]);

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('page.tools.title')}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('page.tools.sub')}</p>

      <div className="mt-5 relative max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search.placeholder.short')} className="input-base pl-10" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setActiveCat('all')} className={`chip ${activeCat === 'all' ? 'chip-brand' : 'chip-neutral'}`}>{t('common.all')}</button>
        {categories.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCat(cat.id)} className={`chip ${activeCat === cat.id ? 'chip-brand' : 'chip-neutral'}`}>
            {t(cat.nameKey)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {filtered.length > 0 ? (
          <ToolGrid tools={filtered} showFavorite columns={4} />
        ) : (
          <p className="py-12 text-center text-sm text-slate-400">{t('search.empty')}</p>
        )}
      </div>
    </div>
  );
}

export function CategoriesPage() {
  const { t } = useI18n();
  useSEO({ title: `${t('page.categories.title')} | Calcuio`, description: t('page.categories.sub'), canonical: '/categories' });

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('page.categories.title')}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('page.categories.sub')}</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => {
          const count = tools.filter((tool) => tool.category === cat.id).length;
          return (
            <a key={cat.id} href={`/categories/${cat.slug}`} className="card card-hover group p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-surface-dark-muted dark:text-slate-400">
                <ToolIcon name={cat.icon} size={19} />
              </div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t(cat.nameKey)}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t(cat.descriptionKey)}</p>
              <p className="mt-2 text-2xs font-medium uppercase tracking-wider text-slate-400">{count} tool{count !== 1 ? 's' : ''}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export function CategoryPage() {
  const { t } = useI18n();
  const params = new URLSearchParams(window.location.search);
  const slug = window.location.pathname.split('/').pop() || '';
  const cat = getCategory(slug);

  useSEO({ title: cat ? `${t(cat.nameKey)} tools | Calcuio` : 'Category | Calcuio', description: cat ? t(cat.descriptionKey) : '', canonical: `/categories/${slug}` });

  if (!cat) {
    return <div className="container-page py-16 text-center"><p className="text-slate-400">{t('common.categoryNotFound')}</p></div>;
  }

  const catTools = tools.filter((tool) => tool.category === cat.id);

  return (
    <div className="container-page py-6 sm:py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
          <ToolIcon name={cat.icon} size={19} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t(cat.nameKey)}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t(cat.descriptionKey)}</p>
        </div>
      </div>
      <div className="mt-6">
        <ToolGrid tools={catTools} showFavorite columns={4} />
      </div>
    </div>
  );
}

export function PopularPage() {
  const { t } = useI18n();
  const popular = tools.filter((tool) => tool.isPopular);
  useSEO({ title: `${t('page.popular.title')} | Calcuio`, description: t('page.popular.sub'), canonical: '/popular' });

  return (
    <div className="container-page py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('page.popular.title')}</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('page.popular.sub')}</p>
      <div className="mt-6">
        <ToolGrid tools={popular} showFavorite columns={4} />
      </div>
    </div>
  );
}
