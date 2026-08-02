"use client";

import React, { useState } from 'react';
import { TopicOpinion } from '@/lib/types';
import { Card } from '../ui/Card';
import { ChevronDown, ChevronUp, Compass } from 'lucide-react';

interface TopicAccordionProps {
  topics: TopicOpinion[];
}

export const TopicAccordion: React.FC<TopicAccordionProps> = ({ topics }) => {
  const [expandedTopic, setExpandedTopic] = useState<string | null>(topics[0]?.topic || null);

  const toggleTopic = (topicName: string) => {
    setExpandedTopic(expandedTopic === topicName ? null : topicName);
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-syne text-lg font-bold text-[#F0F0F8] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#4ECCA3]" />
          Topic Stances & Core Beliefs
        </h3>
      </div>

      <div className="space-y-3">
        {topics.map((item) => {
          const isExpanded = expandedTopic === item.topic;
          return (
            <Card
              key={item.topic}
              hoverEffect={false}
              className="p-5 border-[#1E1E30] bg-[#14141F] transition-all cursor-pointer"
              onClick={() => toggleTopic(item.topic)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-syne font-bold text-base text-[#F0F0F8]">
                    {item.topic}
                  </span>
                  {/* Intensity Bar */}
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-[11px] text-[#9090A8] font-mono">Intensity:</span>
                    <div className="w-24 h-1.5 bg-[#0F0F1A] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#7C6AFF] to-[#4ECCA3]"
                        style={{ width: `${item.intensity}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-[#7C6AFF]">{item.intensity}%</span>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-[#7C6AFF]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#9090A8]" />
                )}
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#1E1E30] space-y-2 animate-fadeIn">
                  <p className="text-sm text-[#F0F0F8] font-medium leading-relaxed">
                    "{item.stance}"
                  </p>
                  <p className="text-xs text-[#9090A8] font-light leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
