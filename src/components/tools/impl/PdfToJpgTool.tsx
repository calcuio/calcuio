import { useState } from 'react';
import { Dropzone } from '@/components/ui/Dropzone';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SuccessState, ErrorState } from '@/components/ui/ResultStates';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { useI18n } from '@/i18n/I18nContext';
import { fileToArrayBuffer, formatBytes, getBaseName, validateFile } from '@/lib/files';
import { track } from '@/lib/analytics';

export function PdfToJpgTool() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ blob: Blob; pageNum: number }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    setError(null); setResults(null);
    const err = validateFile(f, ['application/pdf'], 100);
    if (err) { setError(err); return; }
    setFile(f);
    track('tool_start', { tool_id: 'pdf-to-jpg' });
  };

  const convert = async () => {
    if (!file) return;
    setProcessing(true); setProgress(10); setError(null);
    try {
      const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
      const arrayBuffer = await fileToArrayBuffer(file);
      setProgress(20);
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const total = pdf.numPages;
      const pages: { blob: Blob; pageNum: number }[] = [];

      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => b ? resolve(b) : reject(new Error('Render failed')), 'image/jpeg', 0.9);
        });
        pages.push({ blob, pageNum: i });
        setProgress(20 + Math.round((i / total) * 75));
      }
      await pdf.destroy();
      setProgress(100);
      setResults(pages);
      track('tool_complete', { tool_id: 'pdf-to-jpg' });
    } catch {
      setError('The PDF could not be converted. It may be encrypted or corrupted.');
    } finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setResults(null); setError(null); setProgress(0); };

  if (results && file) {
    return (
      <div className="animate-fade-in-up rounded-2xl border border-accent-200/60 bg-accent-50/50 p-5 dark:border-accent-500/20 dark:bg-accent-500/5">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{t('tool.result.success')}</h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{results.length} page{results.length !== 1 ? 's' : ''} converted.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((r) => (
            <div key={r.pageNum} className="card flex flex-col items-center gap-2 p-3">
              <div className="text-2xs font-medium text-slate-400">Page {r.pageNum}</div>
              <p className="text-2xs text-slate-400">{formatBytes(r.blob.size)}</p>
              <DownloadButton blob={r.blob} filename={`${getBaseName(file.name)}-page-${r.pageNum}.jpg`} variant="secondary" label="Download" />
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2.5">
          <button onClick={reset} className="btn btn-ghost">{t('tool.processAnother')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} onReset={reset} />}
      {!file ? (
        <Dropzone onFiles={handleFiles} accept="application/pdf,.pdf" maxSizeMB={100} />
      ) : (
        <>
          <div className="rounded-xl bg-slate-50 p-4 dark:bg-surface-dark-muted/50">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{file.name}</p>
            <p className="text-xs text-slate-400">{formatBytes(file.size)}</p>
          </div>
          {processing && <div><ProgressBar value={progress} /><p className="mt-2 text-xs text-slate-400">Rendering PDF pages…</p></div>}
          <div className="flex gap-2.5">
            <button onClick={convert} disabled={processing} className="btn btn-primary">{processing ? t('tool.processing') : t('tool.process')}</button>
            <button onClick={reset} className="btn btn-ghost">{t('tool.reset')}</button>
          </div>
        </>
      )}
    </div>
  );
}
