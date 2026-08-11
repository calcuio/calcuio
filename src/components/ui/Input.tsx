import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="label-base">
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={`input-base ${error ? 'border-red-400 dark:border-red-500' : ''} ${className}`} {...props} />
        {error && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
