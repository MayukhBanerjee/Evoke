"use client";

import React from 'react';

interface CompletenessScoreProps {
  score: number; // 0 to 100
}

export const CompletenessScore: React.FC<CompletenessScoreProps> = ({ score }) => {
  const radius = 32;
  const strokeWidth = 6;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-[#0F0F1A] border border-[#1E1E30] rounded-[10px] px-4 py-2">
      <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
        <svg height={radius * 2} width={radius * 2} className="rotate-[-90deg]">
          {/* Track Circle */}
          <circle
            stroke="#1E1E30"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Fill Circle */}
          <circle
            stroke="#7C6AFF"
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
        <span className="absolute font-syne font-bold text-xs text-[#F0F0F8]">
          {score}%
        </span>
      </div>

      <div>
        <p className="text-xs font-semibold text-[#F0F0F8]">Vault Completeness</p>
        <p className="text-[11px] text-[#9090A8]">High fidelity profile</p>
      </div>
    </div>
  );
};
