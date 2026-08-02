"use client";

import React, { useState } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioWaveformProps {
  durationSeconds?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ durationSeconds = 12 }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="inline-flex items-center gap-3 p-2.5 px-4 rounded-[10px] bg-evoke-surface border border-evoke-border my-2">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-8 h-8 rounded-full bg-[#4ECCA3] hover:bg-[#68E2B9] text-[#080810] flex items-center justify-center shrink-0 transition-transform active:scale-95 shadow-glow-mint"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-[#080810]" />
        ) : (
          <Play className="w-4 h-4 ml-0.5 fill-[#080810]" />
        )}
      </button>

      {/* Pulsing Waveform Bars */}
      <div className="flex items-center gap-1 h-6 w-36">
        {[40, 70, 30, 90, 50, 80, 40, 100, 60, 30, 75, 45, 85, 55, 35].map((h, i) => (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-200 ${
              isPlaying ? 'bg-[#4ECCA3] animate-wave' : 'bg-evoke-border'
            }`}
            style={{
              height: isPlaying ? `${h}%` : '25%',
              animationDelay: `${i * 0.08}s`
            }}
          />
        ))}
      </div>

      <span className="text-xs font-mono text-[#4ECCA3] shrink-0">
        0:{durationSeconds < 10 ? `0${durationSeconds}` : durationSeconds}
      </span>
    </div>
  );
};
