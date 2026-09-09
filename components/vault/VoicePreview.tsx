"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Play, Pause, Sparkles, Volume2 } from 'lucide-react';

interface VoicePreviewProps {
  name: string;
  relationship?: string;
  sampleQuote?: string;
}

export const VoicePreview: React.FC<VoicePreviewProps> = ({ 
  name, 
  relationship,
  sampleQuote 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Compute a dignified display name
  const displayName = React.useMemo(() => {
    if (name.includes('Kalam')) return 'Dr. Kalam';
    if (name.includes('Obama')) return 'Barack Obama';
    return name;
  }, [name]);

  const quoteText = sampleQuote || (
    name.includes('Kalam')
      ? '"Dreams are not what you see in sleep, dreams are things that do not let you sleep."'
      : name.includes('Obama')
      ? '"The arc of the moral universe is long, but it bends toward justice."'
      : `"Greetings. It is wonderful to converse with you today. What thoughts would you like to explore?"`
  );

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      if (timerRef.current) clearInterval(timerRef.current);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio("https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg");
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setProgress(0);
          if (timerRef.current) clearInterval(timerRef.current);
        };
      }
      audioRef.current.play().catch(() => {
        // graceful fallback if browser blocks auto-audio
      });
      setIsPlaying(true);

      // Simulate a smooth 14-second playback progress loop
      let cur = 0;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        cur += 1;
        if (cur > 14) {
          cur = 0;
          setIsPlaying(false);
          if (timerRef.current) clearInterval(timerRef.current);
        }
        setProgress(cur);
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Formatted timer
  const formattedCurrentTime = `0:${progress < 10 ? `0${progress}` : progress}`;

  const barHeights = [
    28, 45, 75, 90, 60, 40, 85, 100, 70, 50, 
    80, 95, 65, 35, 75, 90, 55, 40, 68, 88, 
    42, 60, 82, 98, 72, 48, 78, 62, 35, 50
  ];

  return (
    <Card 
      className="p-5 sm:p-6 border-[#C5A880]/30 bg-gradient-to-r from-evoke-card via-evoke-card to-evoke-surface/80 shadow-md relative overflow-hidden"
      hoverEffect={true}
      borderTheme="gold"
    >
      {/* Subtle ambient gold gradient orb behind play button */}
      <div className="absolute -left-10 -top-10 w-40 h-40 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left Play Control & Metadata */}
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause voice preview" : "Play voice preview"}
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#C5A880] to-[#E6C594] hover:from-[#D4B890] hover:to-[#F0D5AA] text-[#080810] flex items-center justify-center shrink-0 transition-all shadow-[0_0_20px_rgba(197,168,128,0.35)] hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-[#080810]" />
            ) : (
              <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-1 fill-[#080810]" />
            )}
          </button>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                Cloned Archival Voice
              </span>
              <span className="text-[10px] bg-[#4ECCA3]/10 text-[#4ECCA3] border border-[#4ECCA3]/25 px-2 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                11Labs Neural v2 • 48kHz
              </span>
            </div>

            <h3 className="font-heading font-bold text-base sm:text-lg text-evoke-text-primary tracking-tight">
              Hear {displayName}'s Voice
            </h3>

            <p className="text-xs text-evoke-text-secondary font-light italic max-w-xl line-clamp-1 sm:line-clamp-2">
              {quoteText}
            </p>
          </div>
        </div>

        {/* Right Audio Visualizer & Scrub Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:shrink-0">
          {/* Time indicator */}
          <div className="text-[11px] font-mono text-evoke-text-muted shrink-0">
            <span className={isPlaying ? "text-[#C5A880] font-medium" : ""}>
              {isPlaying ? formattedCurrentTime : "0:00"}
            </span>
            <span className="opacity-50"> / 0:14</span>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="w-full sm:w-64 h-11 flex items-center gap-1 bg-evoke-surface/60 border border-evoke-border/60 rounded-xl px-3 py-2">
            {barHeights.map((h, i) => {
              const activeIndex = Math.floor((progress / 14) * barHeights.length);
              const isPast = isPlaying && i <= activeIndex;
              return (
                <div
                  key={i}
                  className={`flex-grow rounded-full transition-all duration-200 ${
                    isPlaying
                      ? isPast
                        ? 'bg-[#C5A880]'
                        : 'bg-[#C5A880]/40 animate-pulse'
                      : 'bg-evoke-text-muted/30 group-hover:bg-[#C5A880]/30'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, h * (isPast ? 1 : 0.6))}%` : `${Math.max(15, h * 0.35)}%`,
                    transitionDelay: `${i * 12}ms`
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
