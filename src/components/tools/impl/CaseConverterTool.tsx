import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { useI18n } from '@/i18n/I18nContext';
import { track } from '@/lib/analytics';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'pascal' | 'snake' | 'kebab';

function convertCase(text: string, type: CaseType): string {
  switch (type) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case 'sentence': return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
    case 'camel': {
      const words = text.toLowerCase().split(/[\s_-]+/).filter(Boolean);
      return words.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
    }
    case 'pascal': {
      const words = text.toLowerCase().split(/[\s_-]+/).filter(Boolean);
      return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    }
    case 'snake': return text.toLowerCase().trim().replace(/[\s-]+/g, '_').replace(/[^a-z0-9_]/g, '');
    case 'kebab': return text.toLowerCase().trim().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '');
    default: return text;
  }
}

const CASES: { type: CaseType; label: string }[] = [
  { type: 'upper', label: 'UPPERCASE' },
  { type: 'lower', label: 'lowercase' },
  { type: 'title', label: 'Title Case' },
  { type: 'sentence', label: 'Sentence case' },
  { type: 'camel', label: 'camelCase' },
  { type: 'pascal', label: 'PascalCase' },
  { type: 'snake', label: 'snake_case' },
  { type: 'kebab', label: 'kebab-case' },
];

export function CaseConverterTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [activeCase, setActiveCase] = useState<CaseType>('upper');

  const output = useMemo(() => convertCase(text, activeCase), [text, activeCase]);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('tool.input')}</label>
        <textarea value={text} onChange={(e) => { setText(e.target.value); if (e.target.value) track('tool_start', { tool_id: 'case-converter' }); }} placeholder="Type or paste text to convert…" className="input-base scrollbar-thin h-32 resize-y" autoFocus />
      </div>
      <div className="flex flex-wrap gap-2">
        {CASES.map((c) => (
          <button key={c.type} onClick={() => setActiveCase(c.type)} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${activeCase === c.type ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-surface-dark-muted dark:text-slate-300'}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('tool.output')}</label>
          {output && <CopyButton text={output} size="sm" />}
        </div>
        <textarea value={output} readOnly placeholder="Converted text will appear here…" className="input-base scrollbar-thin h-32 resize-y font-mono text-sm" />
      </div>
      <button onClick={() => { setText(''); }} className="btn btn-ghost">{t('tool.clear')}</button>
    </div>
  );
}
