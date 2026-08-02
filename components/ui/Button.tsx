import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'mint' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-[10px] transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const variantStyles = {
    primary: "bg-[#7C6AFF] hover:bg-[#9D8FFF] text-white shadow-glow hover:shadow-glow-lg border border-transparent active:scale-[0.98]",
    ghost: "bg-transparent hover:bg-[rgba(124,106,255,0.06)] text-evoke-text-primary border border-evoke-border hover:border-[#7C6AFF] active:scale-[0.98]",
    mint: "bg-[#4ECCA3] hover:bg-[#68E2B9] text-[#080810] font-semibold shadow-glow-mint active:scale-[0.98]",
    gold: "bg-[#C5A880] hover:bg-[#D4B890] text-[#080810] font-semibold shadow-glow-gold active:scale-[0.98] border border-transparent",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 active:scale-[0.98]",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles[size], variantStyles[variant], className))}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
