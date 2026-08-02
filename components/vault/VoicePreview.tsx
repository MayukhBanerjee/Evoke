"use client";

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Play, Pause, Volume2, Sparkles } from 'lucide-react';

interface VoicePreviewProps {
  name: string;
}

export const VoicePreview: React.FC<VoicePreviewProps> = ({ name }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="p-6 border-[#7C6AFF]/40 bg-gradient-to-r from-[#14141F] to-[#0F0F1A]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="w-14 h-14 rounded-full bg-[#7C6AFF] hover:bg-[#9D8FFF] text-white flex items-center justify-center shrink-0 transition-all shadow-glow hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-[#7C6AFF] font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Cloned Voice Sample
              </span>
              <span className="text-[10px] bg-[#4ECCA3]/10 text-[#4ECCA3] px-2 py-0.5 rounded-[100px] font-mono">
                11Labs Neural
              </span>
            </div>
            <h4 className="font-syne font-bold text-lg text-[#F0F0F8]">
              Hear {name}'s Voice
            </h4>
            <p className="text-xs text-[#9090A8] font-light">
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
                  : 'bg-[#7C6AFF]/40'
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
