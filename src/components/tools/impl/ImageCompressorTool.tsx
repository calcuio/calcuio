import { useState } from 'react';
import { Dropzone } from '@/components/ui/Dropzone';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SuccessState, ErrorState } from '@/components/ui/ResultStates';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { useI18n } from '@/i18n/I18nContext';
import { fileToDataURL, loadImage, formatBytes, getBaseName, validateFile } from '@/lib/files';
import { track } from '@/lib/analytics';

export function ImageCompressorTool() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [quality, setQuality] = useState(70);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    setError(null);
    setResult(null);
    const err = validateFile(f, ['image/jpeg', 'image/png', 'image/webp'], 50);
    if (err) { setError(err); return; }
    try {
      const url = await fileToDataURL(f);
      setFile(f);
      setPreview(url);
      track('tool_start', { tool_id: 'image-compressor' });
    } catch {
      setError('The image could not be processed. Try another file.');
    }
  };

  const compress = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(20);
    setError(null);
    try {
      const img = await loadImage(preview);
      setProgress(40);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      setProgress(60);

      const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Compression failed')), type, quality / 100);
      });
      setProgress(100);
      setResult({ blob, size: blob.size });
      track('tool_complete', { tool_id: 'image-compressor' });
    } catch {
      setError('The image could not be compressed. Try another file.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => { setFile(null); setPreview(''); setResult(null); setError(null); setProgress(0); };

  if (result && file) {
    return (
      <SuccessState
        originalSize={file.size}
        newSize={result.size}
        onReset={reset}
        downloadButton={<DownloadButton blob={result.blob} filename={`${getBaseName(file.name)}-compressed.${file.name.split('.').pop()}`} />}
      />
    );
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
              <div>
                <p className="text-sm text-slate-500">{file.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
              </div>
              <div>
                <label className="label-base">Quality: {quality}%</label>
                <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-brand-500" />
              </div>
            </div>
          </div>
          {processing && <ProgressBar value={progress} />}
          <div className="flex gap-2.5">
            <button onClick={compress} disabled={processing} className="btn btn-primary">
              {processing ? t('tool.processing') : t('tool.process')}
            </button>
            <button onClick={reset} className="btn btn-ghost">{t('tool.reset')}</button>
          </div>
        </>
      )}
    </div>
  );
}
