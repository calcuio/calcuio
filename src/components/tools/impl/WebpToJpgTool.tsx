import { useState } from 'react';
import { Dropzone } from '@/components/ui/Dropzone';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SuccessState, ErrorState } from '@/components/ui/ResultStates';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Input } from '@/components/ui/Input';
import { useI18n } from '@/i18n/I18nContext';
import { fileToDataURL, loadImage, formatBytes, getBaseName, validateFile } from '@/lib/files';
import { track } from '@/lib/analytics';

export function WebpToJpgTool() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    setError(null); setResult(null);
    const err = validateFile(f, ['image/webp'], 50);
    if (err) { setError(err); return; }
    try { const url = await fileToDataURL(f); setFile(f); setPreview(url); track('tool_start', { tool_id: 'webp-to-jpg' }); }
    catch { setError('The image could not be processed. Try another file.'); }
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true); setProgress(20); setError(null);
    try {
      const img = await loadImage(preview);
      setProgress(40);
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setProgress(70);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Conversion failed')), 'image/jpeg', 0.92);
      });
      setProgress(100);
      setResult({ blob, size: blob.size });
      track('tool_complete', { tool_id: 'webp-to-jpg' });
    } catch { setError('The image could not be converted. Try another file.'); }
    finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setPreview(''); setResult(null); setError(null); setProgress(0); };

  if (result && file) {
    return <SuccessState originalSize={file.size} newSize={result.size} onReset={reset} downloadButton={<DownloadButton blob={result.blob} filename={`${getBaseName(file.name)}.jpg`} />} />;
  }

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} onReset={reset} />}
      {!file ? (
        <Dropzone onFiles={handleFiles} accept="image/webp,.webp" maxSizeMB={50} />
      ) : (
        <>
          <div className="flex flex-col gap-4 sm:flex-row">
            <img src={preview} alt="Preview" className="max-h-48 rounded-xl border border-slate-200 object-contain dark:border-surface-dark-border" />
            <div className="flex-1 space-y-3">
              <p className="text-sm text-slate-500">{file.name} — {formatBytes(file.size)}</p>
              <div>
                <label className="label-base">Background color (for transparency)</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-slate-200 dark:border-surface-dark-border" />
                  <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1" />
                </div>
              </div>
            </div>
          </div>
          {processing && <ProgressBar value={progress} />}
          <div className="flex gap-2.5">
            <button onClick={convert} disabled={processing} className="btn btn-primary">{processing ? t('tool.processing') : t('tool.process')}</button>
            <button onClick={reset} className="btn btn-ghost">{t('tool.reset')}</button>
          </div>
        </>
      )}
    </div>
  );
}
