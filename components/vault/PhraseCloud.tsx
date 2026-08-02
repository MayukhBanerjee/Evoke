"use client";

import React, { useState } from 'react';
import { SignaturePhrase } from '@/lib/types';
import { Quote, Info } from 'lucide-react';

interface PhraseCloudProps {
  phrases: SignaturePhrase[];
}

export const PhraseCloud: React.FC<PhraseCloudProps> = ({ phrases }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-syne text-lg font-bold text-evoke-text-primary flex items-center gap-2">
          <Quote className="w-5 h-5 text-[#C5A880]" />
          Signature Phrases
        </h3>
        <span className="text-xs text-evoke-text-secondary">Hover a phrase to view extracted context</span>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none">
        {phrases.map((item) => {
          const isHovered = hoveredId === item.id;
          return (
            <div
              key={item.id}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative shrink-0 group cursor-pointer"
            >
              {/* Premium Gold Background for Signature Phrases */}
              <div className="px-5 py-2.5 rounded-[100px] bg-[#C5A880] hover:bg-[#D4B890] text-[#080810] text-sm font-semibold transition-all shadow-glow-gold hover:scale-105 flex items-center gap-2">
                <span>"{item.phrase}"</span>
                <Info className="w-3.5 h-3.5 opacity-70" />
              </div>

              {/* Hover Context Popover */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 rounded-[10px] bg-evoke-surface border border-[#C5A880]/50 shadow-2xl z-30 pointer-events-none animate-fadeIn">
                  <p className="text-[11px] font-mono text-[#C5A880] mb-1 font-semibold">
                    {item.confidence}% Match Confidence
                  </p>
                  <p className="text-xs text-evoke-text-secondary font-light">
                    {item.context}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
