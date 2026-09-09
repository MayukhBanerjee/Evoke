"use client";

import React from 'react';
import { Card } from '../ui/Card';
import { Smile, Shield, Tag, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

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
        return <Smile className="w-4 h-4 text-[#7C6AFF]" />;
      case 'advice':
        return <Shield className="w-4 h-4 text-[#4ECCA3]" />;
      case 'topics':
        return <Tag className="w-4 h-4 text-[#FF9A3C]" />;
      case 'relationship':
        return <HeartHandshake className="w-4 h-4 text-[#C5A880]" />;
    }
  };

  const getDimensionNumber = () => {
    switch (type) {
      case 'humor':
        return 'DIMENSION 01';
      case 'advice':
        return 'DIMENSION 02';
      case 'topics':
        return 'DIMENSION 03';
      case 'relationship':
        return 'DIMENSION 04';
    }
  };

  const getAccentTheme = () => {
    switch (type) {
      case 'humor':
        return 'violet';
      case 'advice':
        return 'gold';
      case 'topics':
        return 'gold';
      case 'relationship':
        return 'gold';
    }
  };

  return (
    <Card 
      className="p-5 flex flex-col justify-between h-full bg-evoke-card border-evoke-border hover:shadow-lg transition-all duration-300 relative group"
      borderTheme={getAccentTheme() as 'gold' | 'violet'}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-evoke-surface border border-evoke-border flex items-center justify-center shadow-xs">
              {getIcon()}
            </div>
            <span className="text-[10px] font-mono tracking-wider text-evoke-text-muted uppercase">
              {getDimensionNumber()}
            </span>
          </div>

          {confidence ? (
            <span className="text-[10px] font-mono text-[#4ECCA3] bg-[#4ECCA3]/10 border border-[#4ECCA3]/25 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
              <CheckCircle2 className="w-2.5 h-2.5" />
              {confidence}% Match
            </span>
          ) : tags ? (
            <span className="text-[10px] font-mono text-[#FF9A3C] bg-[#FF9A3C]/10 border border-[#FF9A3C]/25 px-2 py-0.5 rounded-full font-medium">
              {tags.length} Domains
            </span>
          ) : (
            <span className="text-[10px] font-mono text-[#C5A880] bg-[#C5A880]/10 border border-[#C5A880]/25 px-2 py-0.5 rounded-full font-medium">
              Archival Stance
            </span>
          )}
        </div>

        {/* Trait Category Title */}
        <h4 className="text-[11px] uppercase tracking-wider text-evoke-text-secondary font-semibold mb-1.5">
          {title}
        </h4>

        {/* Primary Trait Content */}
        {badgeValue && (
          <p className="font-heading font-semibold text-sm sm:text-base text-evoke-text-primary leading-snug mb-2">
            {badgeValue}
          </p>
        )}

        {/* Tags for Topics */}
        {tags && (
          <div className="flex flex-wrap gap-1.5 mt-1 mb-2">
            {tags.slice(0, 5).map((t) => (
              <span
                key={t}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-evoke-surface border border-evoke-border text-evoke-text-secondary group-hover:text-evoke-text-primary transition-colors font-medium"
              >
                #{t}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-evoke-surface/60 border border-evoke-border text-evoke-text-muted">
                +{tags.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Description for Relationship or Nuance */}
        {description && (
          <p className="text-xs text-evoke-text-secondary font-normal leading-relaxed mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Bottom Subtle Status Line */}
      <div className="mt-4 pt-3 border-t border-evoke-border/60 flex items-center justify-between text-[10px] font-mono text-evoke-text-muted">
        <span className="flex items-center gap-1 text-evoke-text-muted">
          <Sparkles className="w-2.5 h-2.5 text-[#C5A880]/60" />
          Fidelity Calibrated
        </span>
        <span className="text-evoke-text-muted">Extracted from Persona Corpus</span>
      </div>
    </Card>
  );
};
