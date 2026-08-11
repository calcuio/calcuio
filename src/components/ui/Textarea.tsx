import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const textareaId = id || props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="label-base">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={`input-base scrollbar-thin resize-y ${error ? 'border-red-400 dark:border-red-500' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  },
);
Textarea.displayName = 'Textarea';
