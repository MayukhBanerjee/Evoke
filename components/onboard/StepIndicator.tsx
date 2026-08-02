"use client";

import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number; // 1, 2, 3, 4, 5 (5 is completion)
  totalSteps?: number;
}

const STEP_LABELS = [
  "Identity",
  "Voice Audio",
  "Personality",
  "Memories"
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps = 4,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto mb-10 px-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[2px] bg-[#1E1E30] z-0" />
        
        {/* Active/Completed Line Fill */}
        <div 
          className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-gradient-to-r from-[#7C6AFF] to-[#4ECCA3] z-0 transition-all duration-500 ease-out"
          style={{
            width: `${Math.min(100, ((Math.min(currentStep, totalSteps) - 1) / (totalSteps - 1)) * 100)}%`
          }}
        />

        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[#4ECCA3] text-[#080810] shadow-[0_0_12px_rgba(78,204,163,0.4)] scale-100'
                    : isActive
                    ? 'bg-[#7C6AFF] text-white shadow-[0_0_15px_rgba(124,106,255,0.5)] ring-4 ring-[#7C6AFF]/20 scale-110'
                    : 'bg-[#0F0F1A] border border-[#1E1E30] text-[#55556A]'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[3]" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>

              <span
                className={`absolute top-11 text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-[#F0F0F8]'
                    : isCompleted
                    ? 'text-[#4ECCA3]'
                    : 'text-[#55556A]'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
