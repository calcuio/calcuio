import { useState } from 'react';
import { Dropzone } from '@/components/ui/Dropzone';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SuccessState, ErrorState } from '@/components/ui/ResultStates';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Input } from '@/components/ui/Input';
import { useI18n } from '@/i18n/I18nContext';
import { fileToDataURL, loadImage, formatBytes, getBaseName, validateFile } from '@/lib/files';
import { track } from '@/lib/analytics';

export function ImageResizerTool() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [origSize, setOrigSize] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [lockRatio, setLockRatio] = useState(true);
  const [scale, setScale] = useState(100);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    setError(null); setResult(null);
    const err = validateFile(f, ['image/jpeg', 'image/png', 'image/webp'], 50);
    if (err) { setError(err); return; }
    try {
      const url = await fileToDataURL(f);
      const img = await loadImage(url);
      setFile(f); setPreview(url);
      setOrigSize({ w: img.width, h: img.height });
      setWidth(img.width); setHeight(img.height); setScale(100);
      track('tool_start', { tool_id: 'image-resizer' });
    } catch { setError('The image could not be processed. Try another file.'); }
  };

  const onWidthChange = (w: number) => {
    setWidth(w);
    if (lockRatio && origSize.w > 0) setHeight(Math.round(w * origSize.h / origSize.w));
  };
  const onHeightChange = (h: number) => {
    setHeight(h);
    if (lockRatio && origSize.h > 0) setWidth(Math.round(h * origSize.w / origSize.h));
  };
  const onScaleChange = (s: number) => {
    setScale(s);
    setWidth(Math.round(origSize.w * s / 100));
    setHeight(Math.round(origSize.h * s / 100));
  };

  const resize = async () => {
    if (!file || width <= 0 || height <= 0) return;
    setProcessing(true); setProgress(20); setError(null);
    try {
      const img = await loadImage(preview);
      setProgress(40);
      const canvas = document.createElement('canvas');
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      setProgress(70);
      const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Resize failed')), type, 0.92);
      });
      setProgress(100);
      setResult({ blob, size: blob.size });
      track('tool_complete', { tool_id: 'image-resizer' });
    } catch { setError('The image could not be resized. Try another file.'); }
    finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setPreview(''); setResult(null); setError(null); setProgress(0); };

  if (result && file) {
    return <SuccessState originalSize={file.size} newSize={result.size} onReset={reset} downloadButton={<DownloadButton blob={result.blob} filename={`${getBaseName(file.name)}-${width}x${height}.${file.name.split('.').pop()}`} />} />;
  }

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} onReset={reset} />}
      {!file ? (
        <Dropzone onFiles={handleFiles} accept="image/jpeg,image/png,image/webp" maxSizeMB={50} />
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row">
            <img src={preview} alt="Preview" className="max-h-48 rounded-xl border border-slate-200 object-contain dark:border-surface-dark-border" />
            <div className="flex-1 space-y-3">
              <p className="text-sm text-slate-500">{file.name} — {origSize.w}×{origSize.h}px — {formatBytes(file.size)}</p>
              <div>
                <label className="label-base">Scale: {scale}%</label>
                <input type="range" min="1" max="200" value={scale} onChange={(e) => onScaleChange(Number(e.target.value))} className="w-full accent-brand-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Width (px)" type="number" value={width} onChange={(e) => onWidthChange(Number(e.target.value))} />
                <Input label="Height (px)" type="number" value={height} onChange={(e) => onHeightChange(Number(e.target.value))} />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} className="accent-brand-500" />
                Lock aspect ratio
              </label>
            </div>
          </div>
          {processing && <ProgressBar value={progress} />}
          <div className="flex gap-2.5">
            <button onClick={resize} disabled={processing} className="btn btn-primary">{processing ? t('tool.processing') : t('tool.process')}</button>
            <button onClick={reset} className="btn btn-ghost">{t('tool.reset')}</button>
          </div>
        </>
      )}
    </div>
  );
}
