interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-surface-dark-muted ${className}`}>
      <div
        className="h-full rounded-full bg-brand-500 transition-all duration-300 ease-out-soft"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
