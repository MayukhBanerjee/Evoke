import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
  borderTheme?: 'violet' | 'gold';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  borderTheme = 'violet',
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-evoke-card border border-evoke-border rounded-[14px] p-6 transition-all duration-200 relative overflow-hidden",
          hoverEffect && (
            borderTheme === 'gold'
              ? "hover:border-[#C5A880]/60 hover:shadow-glow-gold hover:-translate-y-0.5 group"
              : "hover:border-[rgba(124,106,255,0.4)] hover:shadow-glow hover:-translate-y-0.5 group"
          ),
          className
        )
      )}
      {...props}
    >
      {/* Top subtle 2px line shift on hover */}
      {hoverEffect && (
        <div 
          className={`absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${
            borderTheme === 'gold'
              ? 'from-transparent via-[#C5A880] to-transparent'
              : 'from-transparent via-[#7C6AFF] to-transparent'
          }`} 
        />
      )}
      {children}
    </div>
  );
};
