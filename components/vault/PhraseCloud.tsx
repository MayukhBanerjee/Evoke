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
        <h3 className="font-syne text-lg font-bold text-[#F0F0F8] flex items-center gap-2">
          <Quote className="w-5 h-5 text-[#7C6AFF]" />
          Signature Phrases
        </h3>
        <span className="text-xs text-[#9090A8]">Hover a phrase to view extracted context</span>
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
              <div className="px-5 py-2.5 rounded-[100px] bg-[#7C6AFF] hover:bg-[#9D8FFF] text-white text-sm font-medium transition-all shadow-glow hover:scale-105 flex items-center gap-2">
                <span>"{item.phrase}"</span>
                <Info className="w-3.5 h-3.5 opacity-70" />
              </div>

              {/* Hover Context Popover */}
              {isHovered && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 rounded-[10px] bg-[#0F0F1A] border border-[#7C6AFF]/50 shadow-2xl z-30 pointer-events-none animate-fadeIn">
                  <p className="text-[11px] font-mono text-[#4ECCA3] mb-1">
                    {item.confidence}% Match Confidence
                  </p>
                  <p className="text-xs text-[#9090A8] font-light">
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
