import { useCallback, useState, type ReactNode } from 'react';
import { UploadCloud } from 'lucide-react';
import { useI18n } from '@/i18n/I18nContext';

interface DropzoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  children?: ReactNode;
  className?: string;
}

export function Dropzone({
  onFiles,
  accept,
  multiple = false,
  maxSizeMB = 100,
  children,
  className = '',
}: DropzoneProps) {
  const { t } = useI18n();
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFiles(multiple ? files : [files[0]]);
      }
    },
    [onFiles, multiple],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFiles(multiple ? files : [files[0]]);
      }
      e.target.value = '';
    },
    [onFiles, multiple],
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
        dragging
          ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-500/10'
          : 'border-slate-300 hover:border-brand-400 hover:bg-slate-50 dark:border-surface-dark-border dark:hover:bg-surface-dark-muted'
      } ${className}`}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="sr-only"
      />
      {children || (
        <>
          <div
            className={`mb-3 rounded-2xl p-3 transition-colors ${
              dragging ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400' : 'bg-slate-100 text-slate-400 dark:bg-surface-dark-muted'
            }`}
          >
            <UploadCloud size={28} />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {dragging ? t('tool.dropzone.active') : t('tool.dropzone.title')}
          </p>
          <p className="mt-1 text-xs text-slate-400">{t('tool.dropzone.sub')}</p>
          {maxSizeMB && (
            <p className="mt-2 text-2xs text-slate-400">Max {maxSizeMB} MB</p>
          )}
        </>
      )}
    </label>
  );
}
