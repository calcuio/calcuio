import { useState } from 'react';
import { Dropzone } from '@/components/ui/Dropzone';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SuccessState, ErrorState } from '@/components/ui/ResultStates';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { useI18n } from '@/i18n/I18nContext';
import { fileToDataURL, loadImage, formatBytes, getBaseName, validateFile } from '@/lib/files';
import { track } from '@/lib/analytics';

export function HeicToJpgTool() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    const f = files[0];
    setError(null); setResult(null);
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'heic' && ext !== 'heif' && f.type !== 'image/heic' && f.type !== 'image/heif') {
      setError('That file format isn\'t supported yet. Use HEIC or HEIF files.');
      return;
    }
    setFile(f);
    track('tool_start', { tool_id: 'heic-to-jpg' });
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true); setProgress(15); setError(null);
    try {
      const heic2any = (await import('heic2any')).default;
      setProgress(30);
      const dataUrl = await fileToDataURL(file);
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      setProgress(50);
      const converted = await heic2any({ blob, toType: 'image/jpeg', quality: 0.9 }) as Blob;
      setProgress(90);
      const jpgBlob = Array.isArray(converted) ? converted[0] : converted;
      setProgress(100);
      setResult({ blob: jpgBlob, size: jpgBlob.size });
      track('tool_complete', { tool_id: 'heic-to-jpg' });
    } catch {
      setError('The HEIC file could not be converted. It may be corrupted or unsupported.');
    } finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setResult(null); setError(null); setProgress(0); };

  if (result && file) {
    return <SuccessState originalSize={file.size} newSize={result.size} onReset={reset} downloadButton={<DownloadButton blob={result.blob} filename={`${getBaseName(file.name)}.jpg`} />} />;
  }

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} onReset={reset} />}
      {!file ? (
        <Dropzone onFiles={handleFiles} accept=".heic,.heif,image/heic,image/heif" maxSizeMB={100} />
      ) : (
        <>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-surface-dark-muted/50">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
            <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
          </div>
          {processing && <div><ProgressBar value={progress} /><p className="mt-2 text-xs text-slate-400">Decoding HEIC… this may take a moment.</p></div>}
          <div className="flex gap-2.5">
            <button onClick={convert} disabled={processing} className="btn btn-primary">{processing ? t('tool.processing') : t('tool.process')}</button>
            <button onClick={reset} className="btn btn-ghost">{t('tool.reset')}</button>
          </div>
        </>
      )}
    </div>
  );
}
