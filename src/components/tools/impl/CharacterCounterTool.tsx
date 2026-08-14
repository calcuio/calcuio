import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { useI18n } from '@/i18n/I18nContext';

export function CharacterCounterTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');

  const stats = useMemo(() => ({
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split('\n').length : 0,
    sentences: text.trim() ? (text.match(/[.!?]+(\s|$)/g) || []).length || 1 : 0,
  }), [text]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('tool.editor')}</label>
        <div className="flex gap-2">
          <CopyButton text={text} size="sm" />
          <button onClick={() => setText('')} className="btn btn-ghost text-xs">{t('tool.clear')}</button>
        </div>
      </div>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t('tool.textPlaceholder')} className="input-base scrollbar-thin h-56 resize-y text-base" autoFocus />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="card p-4 text-center"><p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{stats.chars.toLocaleString()}</p><p className="mt-0.5 text-2xs font-medium uppercase tracking-wider text-slate-400">{t('tool.chars')}</p></div>
        <div className="card p-4 text-center"><p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{stats.charsNoSpaces.toLocaleString()}</p><p className="mt-0.5 text-2xs font-medium uppercase tracking-wider text-slate-400">{t('tool.noSpaces')}</p></div>
        <div className="card p-4 text-center"><p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{stats.words.toLocaleString()}</p><p className="mt-0.5 text-2xs font-medium uppercase tracking-wider text-slate-400">{t('tool.words')}</p></div>
        <div className="card p-4 text-center"><p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{stats.lines.toLocaleString()}</p><p className="mt-0.5 text-2xs font-medium uppercase tracking-wider text-slate-400">{t('tool.lines')}</p></div>
      </div>
    </div>
  );
}
