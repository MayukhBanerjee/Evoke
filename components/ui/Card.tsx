import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          "bg-[#14141F] border border-[#1E1E30] rounded-[14px] p-6 transition-all duration-200 relative overflow-hidden",
          hoverEffect && "hover:border-[rgba(124,106,255,0.4)] hover:shadow-glow hover:-translate-y-0.5 group",
          className
        )
      )}
      {...props}
    >
      {/* Top subtle 2px violet line shift on hover */}
      {hoverEffect && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#7C6AFF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      {children}
    </div>
  );
};
