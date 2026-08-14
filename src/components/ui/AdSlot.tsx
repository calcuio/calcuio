import { useI18n } from '@/i18n/I18nContext';

interface AdSlotProps {
  variant?: 'banner' | 'sidebar' | 'inline';
  className?: string;
}

export function AdSlot({ variant = 'banner', className = '' }: AdSlotProps) {
  const { t } = useI18n();
  const heights = {
    banner: 'min-h-[90px]',
    sidebar: 'min-h-[250px]',
    inline: 'min-h-[120px]',
  };

  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 ${heights[variant]} ${className} dark:border-surface-dark-border dark:bg-surface-dark-muted/30`}
      aria-label={t('common.advertisement')}
      role="complementary"
    >
      <span className="text-2xs font-medium uppercase tracking-wider text-slate-300 dark:text-slate-600">
        {t('common.advertisement')}
      </span>
    </div>
  );
}
