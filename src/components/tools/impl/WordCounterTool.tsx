import { useState, useMemo } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';
import { useI18n } from '@/i18n/I18nContext';

function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

function countSentences(text: string): number {
  if (!text.trim()) return 0;
  return (text.match(/[.!?]+(\s|$)/g) || []).length || 1;
}

function countParagraphs(text: string): number {
  if (!text.trim()) return 0;
  return text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
}

export function WordCounterTool() {
  const { t } = useI18n();
  const [text, setText] = useState('');

  const stats = useMemo(() => ({
    words: countWords(text),
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: countSentences(text),
    paragraphs: countParagraphs(text),
    lines: text ? text.split('\n').length : 0,
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
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('tool.textHerePlaceholder')}
        className="input-base scrollbar-thin h-56 resize-y text-base"
        autoFocus
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { label: t('tool.words'), value: stats.words },
          { label: t('tool.chars'), value: stats.chars },
          { label: t('tool.noSpaces'), value: stats.charsNoSpaces },
          { label: t('tool.sentences'), value: stats.sentences },
          { label: t('tool.paragraphs'), value: stats.paragraphs },
          { label: t('tool.lines'), value: stats.lines },
        ].map((stat) => (
          <div key={stat.label} className="card p-3 text-center">
            <p className="text-2xl font-bold text-brand-600 dark:text-brand-400">{stat.value.toLocaleString()}</p>
            <p className="mt-0.5 text-2xs font-medium uppercase tracking-wider text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400">
        {stats.words > 0 && <span>~{Math.ceil(stats.words / 200)} {t('tool.readTime')}</span>}
        {stats.chars > 0 && <span>~{Math.round(stats.words * 5)} {t('tool.keystrokes')}</span>}
      </div>
    </div>
  );
}
