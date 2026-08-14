import { useState } from 'react';
import { Dropzone } from '@/components/ui/Dropzone';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SuccessState, ErrorState } from '@/components/ui/ResultStates';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { Select } from '@/components/ui/Select';
import { useI18n } from '@/i18n/I18nContext';
import { fileToArrayBuffer, formatBytes, getBaseName, validateFile } from '@/lib/files';
import { track } from '@/lib/analytics';
import { PDFDocument, degrees } from 'pdf-lib';

export function PdfCompressorTool() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(60);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ blob: Blob; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    const f = files[0];
    setError(null); setResult(null);
    const err = validateFile(f, ['application/pdf'], 100);
    if (err) { setError(err); return; }
    setFile(f);
    track('tool_start', { tool_id: 'pdf-compressor' });
  };

  const compress = async () => {
    if (!file) return;
    setProcessing(true); setProgress(10); setError(null);
    try {
      const arrayBuffer = await fileToArrayBuffer(file);
      setProgress(20);
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      setProgress(35);

      // Render each page to a JPEG using a canvas, then rebuild the PDF
      const newPdf = await PDFDocument.create();
      const scale = quality / 100;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();

        // Create a canvas to render the page
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * scale * 2);
        canvas.height = Math.round(height * scale * 2);
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render the PDF page using pdf.js
        const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer.slice(0) });
        const pdf = await loadingTask.promise;
        const pdfPage = await pdf.getPage(i + 1);
        const viewport = pdfPage.getViewport({ scale: scale * 2 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await pdfPage.render({ canvasContext: ctx, viewport }).promise;
        await pdf.destroy();

        const jpgDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
        const jpgBytes = Uint8Array.from(atob(jpgDataUrl.split(',')[1]), (c) => c.charCodeAt(0));
        const img = await newPdf.embedJpg(jpgBytes);
        const newPage = newPdf.addPage([width, height]);
        newPage.drawImage(img, { x: 0, y: 0, width, height });

        setProgress(35 + Math.round(((i + 1) / pages.length) * 55));
      }

      const bytes = await newPdf.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setProgress(100);
      setResult({ blob, size: blob.size });
      track('tool_complete', { tool_id: 'pdf-compressor' });
    } catch (e) {
      setError('The PDF could not be compressed. It may be encrypted or corrupted.');
    } finally { setProcessing(false); }
  };

  const reset = () => { setFile(null); setResult(null); setError(null); setProgress(0); };

  if (result && file) {
    return <SuccessState originalSize={file.size} newSize={result.size} onReset={reset} downloadButton={<DownloadButton blob={result.blob} filename={`${getBaseName(file.name)}-compressed.pdf`} />} />;
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
          <Select
            label="Quality"
            value={String(quality)}
            onChange={(e) => setQuality(Number(e.target.value))}
            options={[
              { value: '40', label: 'High compression (smaller file)' },
              { value: '60', label: 'Balanced (recommended)' },
              { value: '80', label: 'High quality (larger file)' },
            ]}
          />
          {processing && <div><ProgressBar value={progress} /><p className="mt-2 text-xs text-slate-400">{t('tool.rerenderingPdfPages')}</p></div>}
          <div className="flex gap-2.5">
            <button onClick={compress} disabled={processing} className="btn btn-primary">{processing ? t('tool.processing') : t('tool.process')}</button>
            <button onClick={reset} className="btn btn-ghost">{t('tool.reset')}</button>
          </div>
        </>
      )}
    </div>
  );
}
