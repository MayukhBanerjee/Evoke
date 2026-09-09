"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface CompletenessScoreProps {
  score: number;
}

export const CompletenessScore: React.FC<CompletenessScoreProps> = ({ score }) => {
  const radius = 28;
  const strokeWidth = 5;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-evoke-surface/80 border border-evoke-border rounded-xl px-3.5 py-2 shadow-xs">
      <div className="relative w-13 h-13 flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          {/* Subtle Track Circle */}
          <circle
            stroke="var(--border-color)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Radiant Gold Fill */}
          <circle
            stroke="#C5A880"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute font-heading font-bold text-xs text-[#C5A880] tracking-tight">
          {score}%
        </span>
      </div>

      <div className="pr-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-semibold text-evoke-text-primary tracking-tight">Archival Fidelity</p>
          <CheckCircle2 className="w-3 h-3 text-[#4ECCA3]" />
        </div>
        <p className="text-[11px] text-evoke-text-muted font-mono">Calibrated Profile</p>
      </div>
    </div>
  );
};
