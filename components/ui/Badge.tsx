import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'aws' | 'ai' | 'status' | 'violet';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'status',
  children,
  icon,
  className,
  ...props
}) => {
  const baseStyles = "inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium rounded-[10px] tracking-wide border uppercase select-none";

  const variantStyles = {
    aws: "bg-[#FF9A3C]/10 text-[#FF9A3C] border-[#FF9A3C]/30",
    ai: "bg-[#4ECCA3]/10 text-[#4ECCA3] border-[#4ECCA3]/30",
    status: "bg-[#7C6AFF]/10 text-[#9D8FFF] border-[#7C6AFF]/30",
    violet: "bg-[#7C6AFF] text-white border-transparent font-semibold shadow-sm"
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, variantStyles[variant], className))}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
