import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Zap, Shield, Heart, Smartphone, Gift, Sparkles, Clock, Star, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { useSEO, websiteJsonLd } from '@/lib/seo';
import { searchTools } from '@/lib/search';
import { tools, getPopularTools } from '@/data/tools';
import { categories } from '@/data/categories';
import { getCategory } from '@/data/categories';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { FAQ } from '@/components/ui/FAQ';
import { getRecent, getFavorites } from '@/lib/storage';
import { Link } from 'react-router-dom';

export function HomePage() {
  const { t, dir } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useSEO({
    title: 'Calcuio — Free tools that just work.',
    description: t('home.subhead'),
    canonical: '/',
    jsonLd: websiteJsonLd(),
  });

  const popular = getPopularTools();
  const recent = useMemo(() => getRecent().map((r) => tools.find((tool) => tool.id === r.id)).filter(Boolean).slice(0, 6) as typeof tools, []);
  const favorites = useMemo(() => getFavorites().map((id) => tools.find((tool) => tool.id === id)).filter(Boolean).slice(0, 6) as typeof tools, []);
  const searchResults = useMemo(() => query ? searchTools(query, 5) : [], [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(`/tools/${searchResults[0].tool.slug}`);
    } else if (query) {
      navigate('/tools');
    }
  };

  const whyCards = [
    { icon: Zap, titleKey: 'why.fast.title', descKey: 'why.fast.desc' },
    { icon: Gift, titleKey: 'why.free.title', descKey: 'why.free.desc' },
    { icon: Shield, titleKey: 'why.privacy.title', descKey: 'why.privacy.desc' },
    { icon: Sparkles, titleKey: 'why.nosignup.title', descKey: 'why.nosignup.desc' },
    { icon: Smartphone, titleKey: 'why.mobile.title', descKey: 'why.mobile.desc' },
    { icon: Heart, titleKey: 'why.simple.title', descKey: 'why.simple.desc' },
  ];

  const howSteps = [
    { num: '01', titleKey: 'how.step1.title', descKey: 'how.step1.desc' },
    { num: '02', titleKey: 'how.step2.title', descKey: 'how.step2.desc' },
    { num: '03', titleKey: 'how.step3.title', descKey: 'how.step3.desc' },
  ];

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-radial-hero" aria-hidden="true" />
        <div className="absolute inset-0 bg-grid opacity-30 dark:opacity-20" aria-hidden="true" />
        <div className="container-page relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="chip chip-brand mx-auto mb-5 animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              {t('home.eyebrow')}
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl lg:text-5xl animate-fade-in-up">
              {t('home.h1')}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-500 dark:text-slate-400 sm:text-lg animate-fade-in-up">
              {t('home.subhead')}
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-xl animate-fade-in-up">
              <div className="relative">
                <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('home.search.prompt')}
                  className="w-full rounded-2xl border border-slate-200/80 bg-white py-4 pl-12 pr-4 text-base text-slate-900 shadow-soft-lg transition-all placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-surface-dark-border dark:bg-surface-dark-subtle dark:text-white dark:placeholder-slate-500"
                  aria-label={t('home.search.prompt')}
                />
                {searchResults.length > 0 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-start shadow-soft-xl dark:border-surface-dark-border dark:bg-surface-dark-subtle">
                    {searchResults.map((r) => {
                      const cat = getCategory(r.tool.category);
                      return (
                        <button
                          key={r.tool.id}
                          type="button"
                          onClick={() => navigate(`/tools/${r.tool.slug}`)}
                          className="flex w-full items-center gap-3 px-4 py-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-surface-dark-muted"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-surface-dark-muted">
                            <ToolIcon name={r.tool.icon} size={15} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{r.tool.name}</p>
                            <p className="truncate text-xs text-slate-400">{cat ? t(cat.nameKey) : ''}</p>
                          </div>
                          <ArrowRight size={14} className={`shrink-0 text-slate-300 dark:text-slate-600 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {['Compress an image', 'Convert HEIC to JPG', 'Make a PDF smaller', 'Format JSON', 'Count words'].map((ex) => (
                  <button key={ex} type="button" onClick={() => setQuery(ex)} className="chip chip-neutral hover:chip-brand transition-colors">
                    {ex}
                  </button>
                ))}
              </div>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-400">
              <ShieldCheck size={15} className="text-accent-500" />
              {t('home.privacy.badge')}
            </div>
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 pb-16">
        {/* Popular Tools */}
        <section>
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{t('home.popular')}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('home.popular.sub')}</p>
            </div>
            <Link to="/popular" className="link-quiet flex items-center gap-1 text-sm font-medium">
              {t('search.seeAll')}
              <ArrowRight size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </Link>
          </div>
          <ToolGrid tools={popular} showFavorite columns={4} />
        </section>

        {/* Recently Used */}
        {recent.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-2">
              <Clock size={18} className="text-slate-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('home.recent')}</h2>
            </div>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{t('home.recent.sub')}</p>
            <ToolGrid tools={recent} columns={4} />
          </section>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-2">
              <Star size={18} className="text-amber-400" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('home.favorites')}</h2>
            </div>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">{t('home.favorites.sub')}</p>
            <ToolGrid tools={favorites} columns={4} />
          </section>
        )}

        {/* Categories */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{t('home.categories')}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('home.categories.sub')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => {
              const count = tools.filter((tool) => tool.category === cat.id).length;
              return (
                <Link key={cat.id} to={`/categories/${cat.slug}`} className="card card-hover group flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-surface-dark-muted dark:text-slate-400 dark:group-hover:bg-brand-500/15">
                    <ToolIcon name={cat.icon} size={19} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{t(cat.nameKey)}</p>
                    <p className="text-2xs text-slate-400">{count} tool{count !== 1 ? 's' : ''}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Why Calcuio */}
        <section>
          <div className="mb-5 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{t('home.why')}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('home.why.sub')}</p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {whyCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.titleKey} className="card p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t(card.titleKey)}</h3>
                  <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{t(card.descKey)}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How it works */}
        <section>
          <div className="mb-5 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{t('home.how')}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t('home.how.sub')}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {howSteps.map((step) => (
              <div key={step.num} className="card p-5 text-center">
                <p className="text-3xl font-bold text-brand-200 dark:text-brand-500/30">{step.num}</p>
                <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{t(step.titleKey)}</h3>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <div className="mb-5 text-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{t('home.faq')}</h2>
          </div>
          <FAQ questions={faqs} />
        </section>

        {/* Final CTA */}
        <section>
          <div className="overflow-hidden rounded-3xl gradient-brand-soft border border-brand-100/50 dark:border-brand-500/10 p-10 text-center sm:p-14">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{t('home.cta.title')}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{t('home.cta.sub')}</p>
            <Link to="/tools" className="btn btn-primary mt-6 inline-flex">
              {t('home.cta.button')}
              <ArrowRight size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
