import { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { CopyButton } from '@/components/ui/CopyButton';
import { useI18n } from '@/i18n/I18nContext';
import { track } from '@/lib/analytics';

export function Base64Tool() {
  const { t } = useI18n();
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');

  const output = useMemo(() => {
    if (!input) return '';
    try {
      if (mode === 'encode') {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(input);
        let binary = '';
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return btoa(binary);
      } else {
        const binary = atob(input.trim());
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        return new TextDecoder().decode(bytes);
      }
    } catch {
      return '';
    }
  }, [input, mode]);

  const swap = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInput(output);
  };

  const clear = () => { setInput(''); };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex rounded-xl border border-slate-200 p-0.5 dark:border-surface-dark-border">
          <button onClick={() => setMode('encode')} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mode === 'encode' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}>Encode</button>
          <button onClick={() => setMode('decode')} className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${mode === 'decode' ? 'bg-brand-600 text-white' : 'text-slate-600 dark:text-slate-300'}`}>Decode</button>
        </div>
        <button onClick={swap} className="btn btn-ghost p-2" aria-label={t('tool.swap')}><ArrowLeftRight size={16} /></button>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{t('tool.input')}</label>
          <textarea value={input} onChange={(e) => { setInput(e.target.value); if (e.target.value) track('tool_start', { tool_id: 'base64-encoder-decoder' }); }} placeholder={mode === 'encode' ? 'Enter text to encode…' : 'Enter Base64 to decode…'} className="input-base scrollbar-thin h-48 resize-y font-mono text-sm" spellCheck={false} />
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('tool.output')}</label>
            {output && <CopyButton text={output} size="sm" />}
          </div>
          <textarea value={output} readOnly placeholder="Result will appear here" className="input-base scrollbar-thin h-48 resize-y font-mono text-sm" spellCheck={false} />
          {input && !output && <p className="mt-1.5 text-xs text-red-400">{mode === 'decode' ? 'Invalid Base64 input.' : 'Could not encode.'}</p>}
        </div>
      </div>
      <button onClick={clear} className="btn btn-ghost">{t('tool.clear')}</button>
    </div>
  );
}
