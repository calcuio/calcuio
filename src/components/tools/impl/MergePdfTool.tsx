import { useState } from 'react';
import { Dropzone } from '@/components/ui/Dropzone';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SuccessState, ErrorState } from '@/components/ui/ResultStates';
import { DownloadButton } from '@/components/ui/DownloadButton';
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';
import { fileToArrayBuffer, formatBytes, getBaseName, validateFile } from '@/lib/files';
import { track } from '@/lib/analytics';
import { PDFDocument } from 'pdf-lib';

interface PdfFile {
  file: File;
  arrayBuffer: ArrayBuffer;
}

export function MergePdfTool() {
  const { t } = useI18n();
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (newFiles: File[]) => {
    setError(null); setResult(null);
    const valid: PdfFile[] = [];
    for (const f of newFiles) {
      const err = validateFile(f, ['application/pdf'], 100);
      if (err) { setError(err); return; }
      try {
        const buf = await fileToArrayBuffer(f);
        valid.push({ file: f, arrayBuffer: buf });
      } catch { setError('A file could not be read.'); return; }
    }
    setFiles((prev) => [...prev, ...valid]);
    track('tool_start', { tool_id: 'merge-pdf' });
  };

  const move = (idx: number, dir: -1 | 1) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= files.length) return;
    const next = [...files];
    [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
    setFiles(next);
  };

  const remove = (idx: number) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const merge = async () => {
    if (files.length < 2) { setError('Add at least 2 PDF files to merge.'); return; }
    setProcessing(true); setProgress(10); setError(null);
    try {
      const merged = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const doc = await PDFDocument.load(files[i].arrayBuffer);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
        setProgress(10 + Math.round(((i + 1) / files.length) * 80));
      }
      const bytes = await merged.save();
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setProgress(100);
      setResult(blob);
      track('tool_complete', { tool_id: 'merge-pdf' });
    } catch {
      setError('The PDFs could not be merged. One or more files may be encrypted or corrupted.');
    } finally { setProcessing(false); }
  };

  const reset = () => { setFiles([]); setResult(null); setError(null); setProgress(0); };

  if (result) {
    return <SuccessState onReset={reset} downloadButton={<DownloadButton blob={result} filename="calcuio-merged.pdf" />}><p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{files.length} PDFs merged into one file.</p></SuccessState>;
  }

  return (
    <div className="space-y-4">
      {error && <ErrorState message={error} onReset={reset} />}
      {files.length === 0 ? (
        <Dropzone onFiles={handleFiles} accept="application/pdf,.pdf" multiple maxSizeMB={100} />
      ) : (
        <>
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-surface-dark-border dark:bg-surface-dark-muted/50">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{f.file.name}</p>
                  <p className="text-2xs text-slate-400">{formatBytes(f.file.size)}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="btn btn-ghost p-1.5" aria-label="Move up"><ArrowUp size={14} /></button>
                  <button onClick={() => move(i, 1)} disabled={i === files.length - 1} className="btn btn-ghost p-1.5" aria-label="Move down"><ArrowDown size={14} /></button>
                  <button onClick={() => remove(i)} className="btn btn-ghost p-1.5 text-red-500" aria-label="Remove"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            <label className="flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm text-slate-400 transition-colors hover:border-brand-400 dark:border-surface-dark-border">
              <input type="file" accept="application/pdf,.pdf" multiple className="sr-only" onChange={(e) => { const f = Array.from(e.target.files || []); if (f.length) handleFiles(f); e.target.value = ''; }} />
              + Add more PDFs
            </label>
          </div>
          {processing && <ProgressBar value={progress} />}
          <div className="flex gap-2.5">
            <button onClick={merge} disabled={processing || files.length < 2} className="btn btn-primary">{processing ? t('tool.processing') : `Merge ${files.length} PDFs`}</button>
            <button onClick={reset} className="btn btn-ghost">{t('tool.reset')}</button>
          </div>
        </>
      )}
    </div>
  );
}
