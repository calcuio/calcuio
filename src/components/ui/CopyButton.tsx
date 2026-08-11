import { useCallback, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { track } from '@/lib/analytics';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export function CopyButton({ text, label = 'Copy', className = '', size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      track('tool_copy');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      track('tool_copy');
      setTimeout(() => setCopied(false), 1500);
    }
  }, [text]);

  const sizeClass = size === 'sm' ? 'text-xs px-2.5 py-1.5' : 'text-sm px-3.5 py-2';

  return (
    <button
      onClick={handleCopy}
      className={`btn btn-secondary ${sizeClass} ${className}`}
      aria-label={label}
    >
      {copied ? <Check size={size === 'sm' ? 13 : 15} className="text-accent-500" /> : <Copy size={size === 'sm' ? 13 : 15} />}
      {copied ? 'Copied' : label}
    </button>
  );
}
