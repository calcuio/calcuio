import { useState } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { useI18n } from '@/i18n/I18nContext';
import { track } from '@/lib/analytics';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function UuidGeneratorTool() {
  const { t } = useI18n();
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = () => {
    const list = Array.from({ length: Math.min(count, 100) }, generateUUID);
    const final = uppercase ? list.map((u) => u.toUpperCase()) : list;
    setUuids(final);
    track('tool_complete', { tool_id: 'uuid-generator' });
  };

  const copyAll = () => { navigator.clipboard.writeText(uuids.join('\n')); track('tool_copy'); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="label-base">Count (1–100)</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))} className="input-base w-32" />
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} className="accent-brand-500" />
          Uppercase
        </label>
        <button onClick={generate} className="btn btn-primary">Generate</button>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">{uuids.length} UUID{uuids.length !== 1 ? 's' : ''} generated</span>
            <button onClick={copyAll} className="btn btn-secondary text-xs">Copy all</button>
          </div>
          <div className="space-y-1.5">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 dark:border-surface-dark-border dark:bg-surface-dark-muted/50">
                <code className="flex-1 font-mono text-sm text-slate-700 dark:text-slate-200">{uuid}</code>
                <CopyButton text={uuid} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
