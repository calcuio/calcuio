import { useState } from 'react';
import { Download } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { track } from '@/lib/analytics';
import { downloadBlob } from '@/lib/files';

const SIZES = [16, 32, 48, 64, 180, 192, 512];

export function FaviconGeneratorTool() {
  const { t } = useI18n();
  const [text, setText] = useState('C');
  const [bgColor, setBgColor] = useState('#2f7fff');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(60);
  const [results, setResults] = useState<{ size: number; dataUrl: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = () => {
    setError(null);
    if (!text.trim()) { setError('Enter some text or an emoji first.'); return; }
    track('tool_start', { tool_id: 'favicon-generator' });
    try {
      const generated = SIZES.map((size) => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        const fs = Math.round(size * (fontSize / 100));
        ctx.font = `bold ${fs}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = textColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.slice(0, 2), size / 2, size / 2 + size * 0.02);
        return { size, dataUrl: canvas.toDataURL('image/png') };
      });
      setResults(generated);
      track('tool_complete', { tool_id: 'favicon-generator' });
    } catch { setError('The favicon could not be generated. Try different settings.'); }
  };

  const downloadSingle = (dataUrl: string, size: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `favicon-${size}x${size}.png`;
    link.click();
    track('tool_download', { tool_id: 'favicon-generator' });
  };

  const downloadAll = () => {
    if (!results) return;
    results.forEach((r) => downloadSingle(r.dataUrl, r.size));
  };

  const reset = () => { setResults(null); setError(null); setText('C'); };

  return (
    <div className="space-y-4">
      {error && <div className="rounded-xl border border-red-200/60 bg-red-50/50 p-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/5 dark:text-red-400">{error}</div>}

      {!results ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-base">{t('tool.textOrEmoji')}</label>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} maxLength={2} className="input-base" placeholder="C" />
            </div>
            <div>
              <label className="label-base">Font size: {fontSize}%</label>
              <input type="range" min="30" max="90" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full accent-brand-500" />
            </div>
            <div>
              <label className="label-base">{t('tool.backgroundColor')}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 dark:border-surface-dark-border" />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="input-base flex-1" />
              </div>
            </div>
            <div>
              <label className="label-base">{t('tool.textColor')}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 dark:border-surface-dark-border" />
                <input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="input-base flex-1" />
              </div>
            </div>
          </div>
          {/* Live preview */}
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 dark:bg-surface-dark-muted/50">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl text-2xl font-bold" style={{ backgroundColor: bgColor, color: textColor, fontSize: `${fontSize * 0.16}px` }}>
              {text.slice(0, 2)}
            </div>
            <p className="text-xs text-slate-400">{t('tool.livePreview')}</p>
          </div>
          <div className="flex gap-2.5">
            <button onClick={generate} className="btn btn-primary">{t('tool.process')}</button>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl border border-accent-200/60 bg-accent-50/50 p-5 dark:border-accent-500/20 dark:bg-accent-500/5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t('tool.result.success')}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{SIZES.length} favicon sizes generated.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {results.map((r) => (
              <div key={r.size} className="card flex flex-col items-center gap-2 p-3">
                <img src={r.dataUrl} alt={`Favicon ${r.size}x${r.size}`} className="h-12 w-12" />
                <p className="text-2xs font-medium text-slate-500">{r.size}×{r.size}</p>
                <button onClick={() => downloadSingle(r.dataUrl, r.size)} className="btn btn-ghost text-2xs">
                  <Download size={12} /> PNG
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2.5">
            <button onClick={downloadAll} className="btn btn-primary">
              <Download size={16} /> Download all
            </button>
            <button onClick={reset} className="btn btn-ghost">{t('tool.processAnother')}</button>
          </div>
        </>
      )}
    </div>
  );
}
