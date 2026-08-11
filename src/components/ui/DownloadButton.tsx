import { Download } from 'lucide-react';
import { downloadBlob } from '@/lib/files';
import { track } from '@/lib/analytics';

interface DownloadButtonProps {
  blob: Blob;
  filename: string;
  label?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

export function DownloadButton({
  blob,
  filename,
  label = 'Download',
  variant = 'primary',
  className = '',
}: DownloadButtonProps) {
  const handleDownload = () => {
    downloadBlob(blob, filename);
    track('tool_download');
  };

  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
  }[variant];

  return (
    <button onClick={handleDownload} className={`btn ${variantClass} ${className}`}>
      <Download size={16} />
      {label}
    </button>
  );
}
