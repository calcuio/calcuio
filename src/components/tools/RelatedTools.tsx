import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Tool } from '@/types';
import { getRelatedTools } from '@/data/tools';
import { useI18n } from '@/i18n/I18nContext';
import { track } from '@/lib/analytics';
import { ToolIcon } from '@/components/tools/ToolIcon';

interface RelatedToolsProps {
  tool: Tool;
}

export function RelatedTools({ tool }: RelatedToolsProps) {
  const { t, dir } = useI18n();
  const related = getRelatedTools(tool);

  if (related.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">{t('tool.related')}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((rt) => (
          <Link
            key={rt.id}
            to={`/tools/${rt.slug}`}
            onClick={() => track('related_tool_click', { tool_id: tool.id, target: rt.id })}
            className="card card-hover group flex items-center gap-3 p-3.5"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-surface-dark-muted dark:text-slate-400 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400">
              <ToolIcon name={rt.icon} size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{rt.name}</p>
              <p className="truncate text-xs text-slate-400">{rt.description}</p>
            </div>
            <ChevronRight size={16} className={`shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-0.5' : ''}`} />
          </Link>
        ))}
      </div>
    </section>
  );
}
