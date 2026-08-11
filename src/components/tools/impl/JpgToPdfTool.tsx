import { useState } from 'react';
import { Dropzone } from '@/components/ui/Dropzone';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SuccessState, ErrorState } from '@/components/ui/ResultStates';
import { useI18n } from '@/i18n/I18nContext';
import { fileToDataURL, formatBytes, getBaseName } from '@/lib/files';
import { track } from '@/lib/analytics';
import jsPDF from 'jspdf';

interface ImageFile {
  file: File;
  dataUrl: string;
}

export function JpgToPdfTool() {
  const { t } = useI18n();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: File[]) => {
    setError(null);
    setResult(null);
    try {
      const loaded: ImageFile[] = [];
      for (const file of files) {
        if (!file.type.match(/image\/(jpeg|jpg)/i) && !file.name.match(/\.(jpe?g)$/i)) {
          setError('That file format isn\'t supported yet. Use JPG or JPEG images.');
          return;
        }
        const dataUrl = await fileToDataURL(file);
        loaded.push({ file, dataUrl });
      }
      setImages((prev) => [...prev, ...loaded]);
      track('tool_start', { tool_id: 'jpg-to-pdf' });
    } catch {
      setError('The image could not be processed. Try another file.');
    }
  };

  const process = async () => {
    if (images.length === 0) return;
    setProcessing(true);
    setProgress(10);
    setError(null);
    try {
      const pdf = new jsPDF({ unit: 'px', format: 'a4', orientation: 'portrait' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const imgEl = new Image();
        imgEl.src = img.dataUrl;
        await new Promise((resolve) => { imgEl.onload = resolve; imgEl.onerror = resolve; });

        const ratio = Math.min(pageWidth / imgEl.width, pageHeight / imgEl.height);
        const w = imgEl.width * ratio;
        const h = imgEl.height * ratio;
        const x = (pageWidth - w) / 2;
        const y = (pageHeight - h) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(img.dataUrl, 'JPEG', x, y, w, h);
        setProgress(10 + Math.round(((i + 1) / images.length) * 80));
      }

      const blob = pdf.output('blob');
      setResult(blob);
      setProgress(100);
      track('tool_complete', { tool_id: 'jpg-to-pdf' });
    } catch {
      setError('The PDF could not be created. Try fewer or smaller images.');
    } finally {
      setProcessing(false);
    }
  };

  const reset = () => {
    setImages([]);
    setResult(null);
    setError(null);
    setProgress(0);
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  if (result) {
    return (
      <SuccessState onReset={reset} downloadButton={<DownloadButton blob={result} filename="calcuio-converted.pdf" />}>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{images.length} image{images.length !== 1 ? 's' : ''} combined into a PDF.</p>
      </SuccessState>
    );
  }

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} onReset={reset} />}
      {images.length === 0 ? (
        <Dropzone onFiles={handleFiles} accept=".jpg,.jpeg,image/jpeg" multiple maxSizeMB={50} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {images.map((img, i) => (
              <div key={i} className="group relative overflow-hidden rounded-xl border border-slate-200 dark:border-surface-dark-border">
                <img src={img.dataUrl} alt="" className="aspect-square w-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 rounded-lg bg-black/50 px-2 py-0.5 text-2xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  Remove
                </button>
                <p className="truncate p-1.5 text-2xs text-slate-500">{formatBytes(img.file.size)}</p>
              </div>
            ))}
            <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-xs text-slate-400 transition-colors hover:border-brand-400 dark:border-surface-dark-border">
              <input type="file" accept=".jpg,.jpeg,image/jpeg" multiple className="sr-only" onChange={(e) => { const f = Array.from(e.target.files || []); if (f.length) handleFiles(f); e.target.value = ''; }} />
              <span className="px-2 text-center">+ Add</span>
            </label>
          </div>
          {processing && <ProgressBar value={progress} />}
          <div className="flex gap-2.5">
            <button onClick={process} disabled={processing || images.length === 0} className="btn btn-primary">
              {processing ? t('tool.processing') : `Create PDF (${images.length})`}
            </button>
            <button onClick={reset} className="btn btn-ghost">{t('tool.reset')}</button>
          </div>
        </>
      )}
    </div>
  );
}
