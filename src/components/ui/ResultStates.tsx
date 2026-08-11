import type { ReactNode } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { formatBytes, calculateSaved } from '@/lib/files';
import { ResetButton } from '@/components/ui/ResetButton';

interface SuccessStateProps {
  originalSize?: number;
  newSize?: number;
  downloadButton?: ReactNode;
  onReset?: () => void;
  children?: ReactNode;
}

export function SuccessState({ originalSize, newSize, downloadButton, onReset, children }: SuccessStateProps) {
  const { t } = useI18n();
  const saved = originalSize && newSize ? calculateSaved(originalSize, newSize) : null;

  return (
    <div className="animate-fade-in-up rounded-2xl border border-accent-200/60 bg-accent-50/50 p-5 dark:border-accent-500/20 dark:bg-accent-500/5">
      <div className="flex items-center gap-2.5">
        <CheckCircle2 size={22} className="text-accent-500" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t('tool.result.success')}</h3>
      </div>

      {originalSize !== undefined && newSize !== undefined && (
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="rounded-xl bg-white/60 px-4 py-2.5 dark:bg-surface-dark-muted/50">
            <p className="text-2xs font-medium uppercase tracking-wider text-slate-400">{t('tool.result.original')}</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatBytes(originalSize)}</p>
          </div>
          <div className="rounded-xl bg-white/60 px-4 py-2.5 dark:bg-surface-dark-muted/50">
            <p className="text-2xs font-medium uppercase tracking-wider text-slate-400">{t('tool.result.new')}</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatBytes(newSize)}</p>
          </div>
          {saved !== null && saved > 0 && (
            <div className="rounded-xl bg-accent-500/10 px-4 py-2.5">
              <p className="text-2xs font-medium uppercase tracking-wider text-accent-600 dark:text-accent-400">{t('tool.result.saved')}</p>
              <p className="text-sm font-bold text-accent-700 dark:text-accent-300">{saved}%</p>
            </div>
          )}
        </div>
      )}

      {children}

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {downloadButton}
        {onReset && <ResetButton onClick={onReset} label={t('tool.processAnother')} />}
      </div>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onReset?: () => void;
}

export function ErrorState({ message, onReset }: ErrorStateProps) {
  const { t } = useI18n();
  return (
    <div className="animate-fade-in-up rounded-2xl border border-red-200/60 bg-red-50/50 p-5 dark:border-red-500/20 dark:bg-red-500/5">
      <div className="flex items-start gap-2.5">
        <svg className="mt-0.5 shrink-0 text-red-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t('common.error')}</h3>
          <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        </div>
      </div>
      {onReset && (
        <div className="mt-3">
          <button onClick={onReset} className="btn btn-outline text-sm">
            <RotateCcw size={14} />
            {t('tool.tryAgain')}
          </button>
        </div>
      )}
    </div>
  );
}
