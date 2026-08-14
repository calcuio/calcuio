import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Tool } from '@/types';
import { ToolIcon } from '@/components/tools/ToolIcon';
import { getCategory } from '@/data/categories';
import { useI18n } from '@/i18n/I18nContext';
import { FavoriteButton } from '@/components/tools/FavoriteButton';

interface ToolCardProps {
  tool: Tool;
  showFavorite?: boolean;
}

export function ToolCard({ tool, showFavorite = false }: ToolCardProps) {
  const { t } = useI18n();
  const cat = getCategory(tool.category);

  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="card card-hover group relative flex flex-col p-4"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-surface-dark-muted dark:text-slate-400 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-400">
          <ToolIcon name={tool.icon} size={19} />
        </div>
        {showFavorite && (
          <div onClick={(e) => e.preventDefault()}>
            <FavoriteButton toolId={tool.id} size="sm" />
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{tool.name}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{tool.description}</p>
      <div className="mt-3 flex items-center gap-2">
        {cat && (
          <span className="chip chip-neutral">
            {t(cat.nameKey)}
          </span>
        )}
        {tool.isNew && (
          <span className="chip chip-accent">{t('tool.new')}</span>
        )}
      </div>
    </Link>
  );
}
