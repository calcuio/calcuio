import { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/Input';
import { useI18n } from '@/i18n/I18nContext';
import { track } from '@/lib/analytics';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace(/^#/, '');
  const match = cleaned.match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (match) return { r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16) };
  const shortMatch = cleaned.match(/^([0-9a-f])([0-9a-f])([0-9a-f])$/i);
  if (shortMatch) return { r: parseInt(shortMatch[1] + shortMatch[1], 16), g: parseInt(shortMatch[2] + shortMatch[2], 16), b: parseInt(shortMatch[3] + shortMatch[3], 16) };
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function HexToRgbTool() {
  const { t } = useI18n();
  const [mode, setMode] = useState<'hex-to-rgb' | 'rgb-to-hex'>('hex-to-rgb');
  const [hex, setHex] = useState('#2f7fff');
  const [r, setR] = useState(47);
  const [g, setG] = useState(127);
  const [b, setB] = useState(255);

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hexFromRgb = useMemo(() => rgbToHex(r, g, b), [r, g, b]);
  const previewColor = mode === 'hex-to-rgb' ? (rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '#000') : hexFromRgb;

  const swap = () => {
    setMode(mode === 'hex-to-rgb' ? 'rgb-to-hex' : 'hex-to-rgb');
    if (mode === 'hex-to-rgb' && rgb) { setR(rgb.r); setG(rgb.g); setB(rgb.b); }
    else { setHex(hexFromRgb); }
    track('tool_start', { tool_id: 'hex-to-rgb' });
  };

  return (
    <div className="space-y-4">
      <button onClick={swap} className="btn btn-outline text-sm"><ArrowLeftRight size={15} /> {t('tool.swap')} ({mode === 'hex-to-rgb' ? 'HEX → RGB' : 'RGB → HEX'})</button>

      {mode === 'hex-to-rgb' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-base">{t('tool.hexColor')}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 dark:border-surface-dark-border" />
              <Input value={hex} onChange={(e) => setHex(e.target.value)} className="flex-1" />
            </div>
          </div>
          <div>
            <label className="label-base">{t('tool.rgbResult')}</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-surface-dark-border dark:bg-surface-dark-muted/50">
                <code className="text-sm font-mono text-slate-700 dark:text-slate-200">
                  {rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : t('tool.invalidHex')}
                </code>
              </div>
              {rgb && <CopyButton text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} size="sm" />}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label-base">{t('tool.rgbValues')}</label>
            <div className="grid grid-cols-3 gap-2">
              <Input label="R" type="number" min={0} max={255} value={r} onChange={(e) => setR(Number(e.target.value))} />
              <Input label="G" type="number" min={0} max={255} value={g} onChange={(e) => setG(Number(e.target.value))} />
              <Input label="B" type="number" min={0} max={255} value={b} onChange={(e) => setB(Number(e.target.value))} />
            </div>
          </div>
          <div>
            <label className="label-base">{t('tool.hexResult')}</label>
            <div className="flex items-center gap-2">
              <input type="color" value={hexFromRgb} readOnly className="h-10 w-14 rounded-lg border border-slate-200 dark:border-surface-dark-border" />
              <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 dark:border-surface-dark-border dark:bg-surface-dark-muted/50">
                <code className="text-sm font-mono text-slate-700 dark:text-slate-200">{hexFromRgb}</code>
              </div>
              <CopyButton text={hexFromRgb} size="sm" />
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 p-4 dark:border-surface-dark-border">
        <p className="mb-2 text-2xs font-medium uppercase tracking-wider text-slate-400">{t('tool.preview')}</p>
        <div className="h-20 rounded-xl" style={{ backgroundColor: previewColor }} />
      </div>
    </div>
  );
}
