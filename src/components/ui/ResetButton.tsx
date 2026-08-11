import { RotateCcw } from 'lucide-react';

interface ResetButtonProps {
  onClick: () => void;
  label?: string;
  className?: string;
}

export function ResetButton({ onClick, label = 'Reset', className = '' }: ResetButtonProps) {
  return (
    <button onClick={onClick} className={`btn btn-ghost ${className}`} aria-label={label}>
      <RotateCcw size={15} />
      {label}
    </button>
  );
}
