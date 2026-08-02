import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-evoke-text-secondary tracking-wider uppercase">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={twMerge(
            clsx(
              "w-full bg-evoke-surface border border-evoke-border rounded-[10px] px-4 py-2.5 text-sm text-evoke-text-primary placeholder-evoke-text-muted transition-all duration-200 focus:outline-none focus:border-[#7C6AFF] focus:ring-2 focus:ring-[#7C6AFF]/20",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
              className
            )
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-evoke-text-muted font-light">{helperText}</p>
        )}
        {error && (
          <p className="text-xs text-red-400 font-light">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-evoke-text-secondary tracking-wider uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={twMerge(
            clsx(
              "w-full bg-evoke-surface border border-evoke-border rounded-[10px] px-4 py-3 text-sm text-evoke-text-primary placeholder-evoke-text-muted transition-all duration-200 focus:outline-none focus:border-[#7C6AFF] focus:ring-2 focus:ring-[#7C6AFF]/20 resize-none min-h-[110px]",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
              className
            )
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-xs text-evoke-text-muted font-light">{helperText}</p>
        )}
        {error && (
          <p className="text-xs text-red-400 font-light">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
