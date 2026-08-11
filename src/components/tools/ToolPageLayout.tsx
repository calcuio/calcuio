import { useEffect, type ReactNode } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Shield, Lightbulb, ListChecks } from 'lucide-react';
import type { Tool } from '@/types';
import { getTool } from '@/data/tools';
import { getCategory } from '@/data/categories';
import { useI18n } from '@/i18n/I18nContext';
import { useSEO, toolJsonLd, faqJsonLd, breadcrumbJsonLd } from '@/lib/seo';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FavoriteButton } from '@/components/tools/FavoriteButton';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { FAQ } from '@/components/ui/FAQ';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { track } from '@/lib/analytics';
import { addRecent } from '@/lib/storage';

interface ToolPageLayoutProps {
  children: ReactNode;
}

export function ToolPageLayout({ children }: ToolPageLayoutProps) {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useI18n();
  const tool = slug ? getTool(slug) : undefined;

  useEffect(() => {
    if (tool) {
      track('tool_view', { tool_id: tool.id, tool_slug: tool.slug });
      addRecent(tool.id);
    }
  }, [tool]);

  if (!tool) {
    return <Navigate to="/404" replace />;
  }

  const cat = getCategory(tool.category);
  const seoTitle = tool.seoTitle || `${tool.name} — Free Online Tool | Calcuio`;
  const seoDesc = tool.seoDescription || tool.description;
  const canonical = `/tools/${tool.slug}`;
  const faqs = tool.faq.map((f) => ({ q: t(f.qKey), a: t(f.aKey) }));

  const jsonLd = [
    toolJsonLd(tool),
    faqJsonLd(faqs),
    breadcrumbJsonLd([
      { name: 'Calcuio', url: '/' },
      { name: t('nav.tools'), url: '/tools' },
      { name: tool.name, url: `/tools/${tool.slug}` },
    ]),
  ];

  return <ToolPageContent tool={tool} seoTitle={seoTitle} seoDesc={seoDesc} canonical={canonical} jsonLd={jsonLd} cat={cat} faqs={faqs}>{children}</ToolPageContent>;
}

interface ToolPageContentProps {
  tool: Tool;
  seoTitle: string;
  seoDesc: string;
  canonical: string;
  jsonLd: object[];
  cat: ReturnType<typeof getCategory>;
  faqs: { q: string; a: string }[];
  children: ReactNode;
}

function ToolPageContent({ tool, seoTitle, seoDesc, canonical, jsonLd, cat, faqs, children }: ToolPageContentProps) {
  const { t } = useI18n();

  useSEO({
    title: seoTitle,
    description: seoDesc,
    canonical,
    jsonLd: jsonLd[0],
  });

  return (
    <div className="container-page py-6 sm:py-8">
      <Breadcrumbs
        items={[
          { label: t('app.name'), to: '/' },
          { label: t('nav.tools'), to: '/tools' },
          ...(cat ? [{ label: t(cat.nameKey), to: `/categories/${cat.slug}` }] : []),
          { label: tool.name },
        ]}
      />

      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
            <ToolIcon name={tool.icon} size={21} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">{tool.name}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{tool.description}</p>
          </div>
        </div>
        <FavoriteButton toolId={tool.id} showLabel />
      </div>

      <div className="card p-5 sm:p-6">{children}</div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">{t('tool.how')}</h2>
            <p className="prose-calcuio">{t(tool.howItWorksKey)}</p>
          </section>

          {tool.supportedFormats && tool.supportedFormats.length > 0 && (
            <section>
              <h2 className="mb-2 text-base font-semibold text-slate-900 dark:text-white">{t('tool.formats')}</h2>
              <div className="flex flex-wrap gap-2">
                {tool.supportedFormats.map((fmt) => (
                  <span key={fmt} className="chip chip-neutral">{fmt}</span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-2 flex items-center gap-1.5 text-base font-semibold text-slate-900 dark:text-white">
              <Lightbulb size={16} className="text-amber-500" />
              {t('tool.tips')}
            </h2>
            <p className="prose-calcuio">{t(tool.tipsKey)}</p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-4">
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-white">
              <Shield size={15} className="text-accent-500" />
              {t('tool.privacy.info')}
            </h2>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t(tool.privacyKey)}</p>
          </section>
        </div>
      </div>

      <FAQ questions={faqs} />
      <RelatedTools tool={tool} />
    </div>
  );
}
