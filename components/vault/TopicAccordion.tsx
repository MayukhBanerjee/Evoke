"use client";

import React, { useState } from 'react';
import { TopicOpinion } from '@/lib/types';
import { Card } from '../ui/Card';
import { ChevronDown, ChevronUp, Compass, Sparkles, BookOpen } from 'lucide-react';

interface TopicAccordionProps {
  topics: TopicOpinion[];
}

export const TopicAccordion: React.FC<TopicAccordionProps> = ({ topics }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(topics[0]?.topic || null);

  const toggleTopic = (topicName: string) => {
    setExpandedTopic(expandedTopic === topicName ? null : topicName);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#4ECCA3]/15 border border-[#4ECCA3]/30 flex items-center justify-center">
            <Compass className="w-3.5 h-3.5 text-[#4ECCA3]" />
          </div>
          <h3 className="font-heading text-lg font-bold text-evoke-text-primary tracking-tight">
            Topic Stances & Philosophical Positions
          </h3>
          <span className="text-[11px] font-mono text-[#4ECCA3] bg-[#4ECCA3]/10 border border-[#4ECCA3]/20 px-2 py-0.5 rounded-full">
            {topics.length} Stances
          </span>
        </div>
        <p className="text-xs text-evoke-text-secondary font-light">
          Calibrated belief intensities and historical evidence backing each viewpoint
        </p>
      </div>

      <div className="space-y-2.5">
        {topics.map((item) => {
          const isExpanded = expandedTopic === item.topic;
          return (
            <Card
              key={item.topic}
              hoverEffect={false}
              className={`p-4 sm:p-5 border transition-all duration-200 cursor-pointer ${
                isExpanded 
                  ? 'border-[#C5A880]/50 bg-evoke-card shadow-sm' 
                  : 'border-evoke-border bg-evoke-card/70 hover:border-evoke-border hover:bg-evoke-card'
              }`}
              onClick={() => toggleTopic(item.topic)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                    isExpanded ? 'bg-[#C5A880]' : 'bg-evoke-text-muted/40'
                  }`} />
                  <span className="font-heading font-semibold text-sm sm:text-base text-evoke-text-primary truncate">
                    {item.topic}
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  {/* Intensity Meter */}
                  <div className="hidden sm:flex items-center gap-2.5">
                    <span className="text-[10px] text-evoke-text-muted font-mono uppercase tracking-wider">Conviction:</span>
                    <div className="w-24 h-1.5 bg-evoke-surface border border-evoke-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C5A880] to-[#4ECCA3] transition-all duration-500 rounded-full"
                        style={{ width: `${item.intensity}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-[#C5A880] w-8 text-right">{item.intensity}%</span>
                  </div>

                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 ${
                    isExpanded ? 'bg-[#C5A880]/15 text-[#C5A880] rotate-180' : 'text-evoke-text-secondary hover:text-evoke-text-primary'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-evoke-border/80 space-y-3">
                  <div className="border-l-2 border-[#C5A880] pl-3.5 py-0.5">
                    <p className="text-xs sm:text-sm text-evoke-text-primary font-medium leading-relaxed italic">
                      "{item.stance}"
                    </p>
                  </div>
                  
                  <div className="bg-evoke-surface/60 rounded-lg p-3 border border-evoke-border/60">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#C5A880] uppercase tracking-wider mb-1">
                      <BookOpen className="w-3 h-3" />
                      Historical Archival Evidence
                    </div>
                    <p className="text-xs text-evoke-text-secondary font-light leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
