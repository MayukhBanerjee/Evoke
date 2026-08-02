"use client";

import React from 'react';

interface CompletenessScoreProps {
  score: number;
}

export const CompletenessScore: React.FC<CompletenessScoreProps> = ({ score }) => {
  const radius = 32;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-evoke-surface border border-evoke-border rounded-[10px] px-4 py-2">
      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          {/* Track Circle */}
          <circle
            stroke="var(--border-color)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Fill Circle in Premium Gold */}
          <circle
            stroke="#C5A880"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <span className="absolute font-syne font-bold text-xs text-[#C5A880]">
          {score}%
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold text-evoke-text-primary">Vault Completeness</p>
        <p className="text-[11px] text-evoke-text-secondary">High fidelity profile</p>
      </div>
    </div>
  );
};
