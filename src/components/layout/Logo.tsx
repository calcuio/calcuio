interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function Logo({ size = 28, showText = true, className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="calcuio-logo-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2f7fff" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#calcuio-logo-grad)" />
        <g
          fill="none"
          stroke="#fff"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 22h28" />
          <path d="M22 22v22a4 4 0 004 4h12a4 4 0 004-4V22" />
          <path d="M28 32h8" />
          <path d="M32 28v8" />
        </g>
        <circle cx="46" cy="20" r="2.4" fill="#fff" />
      </svg>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Calcuio
        </span>
      )}
    </span>
  );
}
