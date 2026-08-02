"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
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
        return <HeartHandshake className="w-5 h-5 text-[#9D8FFF]" />;
    }
  };

  return (
    <Card className="p-5 flex flex-col justify-between h-full bg-[#14141F] border-[#1E1E30]">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-[8px] bg-[#0F0F1A] border border-[#1E1E30] flex items-center justify-center">
            {getIcon()}
          </div>
          {confidence && (
            <span className="text-[10px] font-mono text-[#4ECCA3] bg-[#4ECCA3]/10 px-2 py-0.5 rounded-[100px]">
              {confidence}% Confidence
            </span>
          )}
        </div>

        <h4 className="text-xs uppercase tracking-wider text-[#9090A8] font-medium mb-1">
          {title}
        </h4>

        {badgeValue && (
          <div className="my-2">
            <span className="font-syne font-bold text-base text-[#F0F0F8]">
              {badgeValue}
            </span>
          </div>
        )}

        {tags && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((t) => (
              <span
                key={t}
                className="text-[11px] px-2.5 py-1 rounded-[100px] bg-[#0F0F1A] border border-[#1E1E30] text-[#F0F0F8]"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {description && (
          <p className="text-xs text-[#9090A8] font-light leading-relaxed mt-2">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};
