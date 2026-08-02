"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { Smile, Shield, Tag, HeartHandshake } from 'lucide-react';

interface PersonalityCardProps {
  type: 'humor' | 'advice' | 'topics' | 'relationship';
  title: string;
  badgeValue?: string;
  confidence?: number;
  tags?: string[];
  description?: string;
}

export const PersonalityCard: React.FC<PersonalityCardProps> = ({
  type,
  title,
  badgeValue,
  confidence,
  tags,
  description,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'humor':
        return <Smile className="w-5 h-5 text-[#7C6AFF]" />;
      case 'advice':
        return <Shield className="w-5 h-5 text-[#4ECCA3]" />;
      case 'topics':
        return <Tag className="w-5 h-5 text-[#FF9A3C]" />;
      case 'relationship':
        return <HeartHandshake className="w-5 h-5 text-[#C5A880]" />;
    }
  };

  return (
    <Card 
      className="p-5 flex flex-col justify-between h-full bg-evoke-card border-evoke-border"
      borderTheme={type === 'relationship' || type === 'humor' ? 'gold' : 'violet'}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-[8px] bg-evoke-surface border border-evoke-border flex items-center justify-center">
            {getIcon()}
          </div>
          {confidence && (
            <span className="text-[10px] font-mono text-[#4ECCA3] bg-[#4ECCA3]/10 px-2 py-0.5 rounded-[100px]">
              {confidence}% Confidence
            </span>
          )}
        </div>

        <h4 className="text-xs uppercase tracking-wider text-evoke-text-secondary font-semibold mb-1">
          {title}
        </h4>

        {badgeValue && (
          <div className="my-2">
            <span className="font-syne font-bold text-base text-evoke-text-primary">
              {badgeValue}
            </span>
          </div>
        )}

        {tags && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2.5 py-1 rounded-[100px] bg-evoke-surface border border-evoke-border text-evoke-text-primary font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {description && (
          <p className="text-xs text-evoke-text-secondary font-light leading-relaxed mt-2">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};
