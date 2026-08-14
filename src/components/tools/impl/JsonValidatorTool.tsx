import { useState, useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { CopyButton } from '@/components/ui/CopyButton';
import { useI18n } from '@/i18n/I18nContext';
import { track } from '@/lib/analytics';

function findJsonError(str: string): { message: string; line: number; column: number } | null {
  try {
    JSON.parse(str);
    return null;
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Invalid JSON';
    const posMatch = msg.match(/position (\d+)/);
    if (posMatch) {
      const pos = Number(posMatch[1]);
      const before = str.slice(0, pos);
      const line = before.split('\n').length;
      const column = pos - before.lastIndexOf('\n');
      return { message: msg, line, column };
    }
    return { message: msg, line: 0, column: 0 };
  }
}

export function JsonValidatorTool() {
  const { t } = useI18n();
  const [input, setInput] = useState('');

  const error = useMemo(() => findJsonError(input), [input]);

  const isValid = input.trim().length > 0 && !error;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('tool.input')}</label>
        {input.trim() && (
          <div className="flex items-center gap-2">
            {isValid ? (
              <span className="chip chip-accent"><CheckCircle2 size={14} /> {t('tool.validJson')}</span>
            ) : (
              <span className="chip bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"><XCircle2 size={14} /> {t('tool.invalid')}</span>
            )}
            <CopyButton text={input} size="sm" />
            <button onClick={() => setInput('')} className="btn btn-ghost text-xs">{t('tool.clear')}</button>
          </div>
        )}
      </div>
      <textarea
        value={input}
        onChange={(e) => { setInput(e.target.value); if (e.target.value) track('tool_start', { tool_id: 'json-validator' }); }}
        placeholder='{"name":"calcuio","valid":true}'
        className="input-base scrollbar-thin h-64 resize-y font-mono text-sm lg:h-80"
        spellCheck={false}
      />
      {error && input.trim() && (
        <div className="rounded-xl border border-red-200/60 bg-red-50/50 p-4 dark:border-red-500/20 dark:bg-red-500/5">
          <div className="flex items-start gap-2.5">
            <XCircle size={18} className="mt-0.5 shrink-0 text-red-500" />
            <div>
              <p className="text-sm font-medium text-red-600 dark:text-red-400">{t('tool.invalidJson')}</p>
              <p className="mt-0.5 text-sm text-slate-600 dark:text-slate-300">{error.message}</p>
              {error.line > 0 && <p className="mt-1 text-xs text-slate-400">Check line {error.line}, column {error.column}.</p>}
            </div>
          </div>
        </div>
      )}
      {isValid && (
        <div className="rounded-xl border border-accent-200/60 bg-accent-50/50 p-4 dark:border-accent-500/20 dark:bg-accent-500/5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-accent-500" />
            <div>
              <p className="text-sm font-medium text-accent-700 dark:text-accent-300">{t('tool.validJson')}</p>
              <p className="text-xs text-slate-500">{t('tool.jsonValidMessage')}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
