import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { ErrorState } from '@/components/ui/ResultStates';
import { useI18n } from '@/i18n/I18nContext';
import { track } from '@/lib/analytics';

function formatJson(str: string, indent: number): string {
  const parsed = JSON.parse(str);
  return JSON.stringify(parsed, null, indent);
}

function minifyJson(str: string): string {
  return JSON.stringify(JSON.parse(str));
}

export function JsonFormatterTool() {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState(2);

  const stats = useMemo(() => {
    if (!output) return null;
    return { lines: output.split('\n').length, chars: output.length };
  }, [output]);

  const format = () => {
    if (!input.trim()) { setError('Enter some JSON first.'); return; }
    setError(null);
    try {
      const result = formatJson(input, indent);
      setOutput(result);
      track('tool_complete', { tool_id: 'json-formatter' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      setError(`Invalid JSON. ${msg}`);
    }
  };

  const minify = () => {
    if (!input.trim()) { setError('Enter some JSON first.'); return; }
    setError(null);
    try {
      const result = minifyJson(input);
      setOutput(result);
      track('tool_complete', { tool_id: 'json-formatter' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Invalid JSON';
      setError(`Invalid JSON. ${msg}`);
    }
  };

  const swap = () => { setInput(output); setOutput(''); };
  const clear = () => { setInput(''); setOutput(''); setError(null); };

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} />}
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('tool.input')}</label>
            <div className="flex items-center gap-2">
              <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs dark:border-surface-dark-border dark:bg-surface-dark-muted">
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={0}>{t('tool.tabs')}</option>
              </select>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name":"calcuio","tools":20}'
            className="input-base scrollbar-thin h-64 resize-none font-mono text-sm lg:h-80"
            spellCheck={false}
          />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('tool.output')}</label>
            {output && <CopyButton text={output} size="sm" />}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={t('tool.resultPlaceholder')}
            className="input-base scrollbar-thin h-64 resize-none font-mono text-sm lg:h-80"
            spellCheck={false}
          />
          {stats && <p className="mt-1.5 text-2xs text-slate-400">{stats.lines} lines · {stats.chars} chars</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button onClick={format} className="btn btn-primary">{t('tool.process')} (Beautify)</button>
        <button onClick={minify} className="btn btn-secondary">{t('tool.minify')}</button>
        {output && <button onClick={swap} className="btn btn-outline">{t('tool.useOutputAsInput')}</button>}
        <button onClick={clear} className="btn btn-ghost">{t('tool.clear')}</button>
      </div>
    </div>
  );
}
