import { useI18n } from '@/i18n/I18nContext';
import { useSEO, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { FAQ } from '@/components/ui/FAQ';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ArrowRight, CalendarDays, CheckCircle2, FileText, Mail, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react';

function PageHeader({ title, description }: { title: string; description: string }) {
  const { t } = useI18n();
  return <div className="mb-8"><Breadcrumbs items={[{ label: t('app.name'), to: '/' }, { label: title }]} /><div className="mt-6 max-w-3xl"><h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h1><p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{description}</p></div></div>;
}

function LastUpdated() { const { t } = useI18n(); return <div className="mb-8 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400"><CalendarDays size={14} /><span>{t('static.lastUpdated')}</span></div>; }

function ContentPage({ prefix, count }: { prefix: string; count: number }) {
  const { t } = useI18n();
  return <div className="max-w-4xl"><LastUpdated /><div className="prose-calcuio space-y-8">{Array.from({ length: count }, (_, i) => <section key={i}><h2>{t(`${prefix}.section${i + 1}`)}</h2><p>{t(`${prefix}.body`)}</p></section>)}</div></div>;
}

function useStaticSeo(prefix: string, canonical: string) {
  const { t } = useI18n();
  useSEO({ title: `${t(`${prefix}.title`)} | Calcuio`, description: t(`${prefix}.description`), canonical, jsonLd: breadcrumbJsonLd([{ name: 'Calcuio', url: '/' }, { name: t(`${prefix}.title`), url: canonical }]) });
  return t;
}

export function AboutPage() {
  const t = useStaticSeo('static.about', '/about');
  const cards = ['fast', 'privacy', 'simple'];
  return <div className="container-page py-6 sm:py-10"><PageHeader title={t('static.about.title')} description={t('static.about.description')} /><div className="max-w-4xl"><LastUpdated /><section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-surface-dark-border dark:bg-surface-dark/50 sm:p-8"><Sparkles className="text-brand-600 dark:text-brand-400" size={23} /><h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">{t('static.about.intro.title')}</h2><p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">{t('static.about.intro.body')}</p></section><div className="mt-6 grid gap-5 md:grid-cols-3">{cards.map((card) => <div className="card p-6" key={card}><h2 className="font-bold text-slate-900 dark:text-white">{t(`static.about.${card}.title`)}</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{t(`static.about.${card}.body`)}</p></div>)}</div><section className="mt-8 rounded-3xl bg-slate-50 p-6 dark:bg-slate-900/40 sm:p-8"><h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('static.about.more.title')}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('static.about.more.body')}</p><a href="/contact" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400">{t('static.about.contact')}<ArrowRight size={16} /></a></section></div></div>;
}

export function PrivacyPage() { const t = useStaticSeo('static.privacy', '/privacy'); return <div className="container-page py-6 sm:py-10"><PageHeader title={t('static.privacy.title')} description={t('static.privacy.description')} /><ContentPage prefix="static.privacy" count={12} /></div>; }
export function TermsPage() { const t = useStaticSeo('static.terms', '/terms'); return <div className="container-page py-6 sm:py-10"><PageHeader title={t('static.terms.title')} description={t('static.terms.description')} /><ContentPage prefix="static.terms" count={12} /></div>; }

export function ContactPage() {
  const t = useStaticSeo('static.contact', '/contact');
  return <div className="container-page py-6 sm:py-10"><PageHeader title={t('static.contact.title')} description={t('static.contact.description')} /><div className="max-w-4xl"><div className="grid gap-6 md:grid-cols-2"><div className="card p-6 sm:p-8"><Mail className="text-brand-600" size={22} /><h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{t('static.contact.email.title')}</h2><p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{t('static.contact.email.body')}</p><a href="mailto:hello@calcuio.com" className="mt-5 inline-flex font-semibold text-brand-600">hello@calcuio.com</a></div><div className="card p-6 sm:p-8"><MessageSquare className="text-brand-600" size={22} /><h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">{t('static.contact.reasons.title')}</h2><ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">{[1,2,3,4,5].map((i) => <li key={i} className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brand-600" /><span>{t(`static.contact.reason${i}`)}</span></li>)}</ul></div></div><section className="mt-6 rounded-3xl bg-slate-50 p-6 dark:bg-slate-900/40"><h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('static.contact.before.title')}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('static.contact.before.body')}</p></section><div className="mt-6 flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-5 dark:border-surface-dark-border dark:bg-surface-dark/50"><ShieldCheck size={20} className="shrink-0 text-brand-600" /><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{t('static.contact.notice')}</p></div></div></div>;
}

export function FaqPage() {
  const t = useStaticSeo('static.faq', '/faq');
  const faqs = Array.from({ length: 5 }, (_, i) => ({ q: t(`faq.q${i + 1}`), a: t(`faq.a${i + 1}`) }));
  useSEO({ title: `${t('static.faq.title')} | Calcuio`, description: t('static.faq.description'), canonical: '/faq', jsonLd: [breadcrumbJsonLd([{ name: 'Calcuio', url: '/' }, { name: t('static.faq.title'), url: '/faq' }]), faqJsonLd(faqs)] });
  return <div className="container-page py-6 sm:py-10"><PageHeader title={t('static.faq.title')} description={t('static.faq.description')} /><div className="max-w-4xl"><FAQ questions={faqs} /></div></div>;
}

export function BlogPage() {
  const t = useStaticSeo('static.blog', '/blog');
  const posts = Array.from({ length: 6 }, (_, i) => ({ slug: ['how-to-convert-heic-to-jpg','how-to-compress-image','jpg-vs-png-vs-webp','how-to-make-pdf-smaller','how-to-merge-pdf-files','how-to-format-json'][i], tool: ['/tools/heic-to-jpg','/tools/image-compressor','/tools/image-compressor','/tools/pdf-compressor','/tools/merge-pdf','/tools/json-formatter'][i] }));
  return <div className="container-page py-6 sm:py-10"><PageHeader title={t('static.blog.title')} description={t('static.blog.description')} /><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((post) => <article key={post.slug} className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-surface-dark-border dark:bg-surface-dark/50"><span className="text-xs font-semibold uppercase text-brand-600">{t('static.blog.category')}</span><h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{t('static.blog.postTitle')}</h2><p className="mt-3 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('static.blog.postBody')}</p><a href={post.tool} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-600">{t('static.blog.tryTool')}<ArrowRight size={16} /></a></article>)}</div><section className="mt-10 rounded-3xl bg-slate-50 p-6 dark:bg-slate-900/40"><FileText className="text-brand-600" size={22} /><h2 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">{t('static.blog.more.title')}</h2><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{t('static.blog.more.body')}</p></section></div>;
}

export function NotFoundPage() { const { t } = useI18n(); useSEO({ title: `${t('page.404.title')} | Calcuio`, description: t('page.404.sub'), canonical: '/404' }); return <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-16 text-center"><p className="text-6xl font-bold text-brand-200 dark:text-brand-500/30">404</p><h1 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{t('page.404.title')}</h1><p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{t('page.404.sub')}</p><div className="mt-6 flex flex-wrap justify-center gap-2.5"><a href="/" className="btn btn-primary">{t('page.404.back')}</a><a href="/tools" className="btn btn-outline">{t('page.404.search')}</a><a href="/categories" className="btn btn-ghost">{t('page.404.categories')}</a></div></div>; }
