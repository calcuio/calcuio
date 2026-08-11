import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { dir } = useI18n();

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center gap-1.5 text-xs text-slate-400">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {item.to ? (
              <Link to={item.to} className="transition-colors hover:text-brand-600 dark:hover:text-brand-400">
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
            )}
            {i < items.length - 1 && (
              <ChevronRight size={13} className={dir === 'rtl' ? 'rotate-180' : ''} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
