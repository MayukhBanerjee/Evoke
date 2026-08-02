"use client";

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Play, Pause, Sparkles } from 'lucide-react';

interface VoicePreviewProps {
  name: string;
}

export const VoicePreview: React.FC<VoicePreviewProps> = ({ name }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card 
      className="p-6 border-[#C5A880]/30 bg-gradient-to-r from-evoke-card to-evoke-surface"
      hoverEffect={true}
      borderTheme="gold"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-[#C5A880] hover:bg-[#D4B890] text-[#080810] flex items-center justify-center shrink-0 transition-all shadow-glow-gold hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-[#080810]" />
            ) : (
              <Play className="w-6 h-6 ml-1 fill-[#080810]" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Cloned Voice Sample
              </span>
              <span className="text-[10px] bg-[#4ECCA3]/10 text-[#4ECCA3] px-2 py-0.5 rounded-[100px] font-mono">
                11Labs Neural
              </span>
            </div>
            <h4 className="font-syne font-bold text-lg text-evoke-text-primary">
              Hear {name}'s Voice
            </h4>
            <p className="text-xs text-evoke-text-secondary font-light">
              "Hey kiddo, good to hear your voice today. What's on your mind?"
            </p>
          </div>
        </div>

        {/* Animated Waveform Visualizer */}
        <div className="w-full sm:w-48 h-12 flex items-center gap-1">
          {[30, 60, 90, 45, 80, 100, 65, 40, 75, 95, 50, 30, 85, 60, 40, 70, 90, 55, 35, 65].map((h, i) => (
            <div
              key={i}
              className={`flex-grow rounded-full transition-all duration-300 ${
                isPlaying
                  ? 'bg-[#4ECCA3] animate-wave'
                  : 'bg-[#C5A880]/30'
              }`}
              style={{
                height: isPlaying ? `${h}%` : '20%',
                animationDelay: `${i * 0.08}s`
              }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};
