"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { SignaturePhrase } from '@/lib/types';
import { Quote, Sparkles, MessageSquare, ArrowRight, BookOpen } from 'lucide-react';
import { Card } from '../ui/Card';

interface PhraseCloudProps {
  phrases: SignaturePhrase[];
  vaultName?: string;
}

export const PhraseCloud: React.FC<PhraseCloudProps> = ({ phrases, vaultName = "Persona" }) => {
  const [selectedPhrase, setSelectedPhrase] = useState<SignaturePhrase | null>(null);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center">
            <Quote className="w-3.5 h-3.5 text-[#C5A880]" />
          </div>
          <h3 className="font-heading text-lg font-bold text-evoke-text-primary tracking-tight">
            Archived Signature Expressions
          </h3>
          <span className="text-[11px] font-mono text-[#C5A880] bg-[#C5A880]/10 border border-[#C5A880]/20 px-2 py-0.5 rounded-full">
            {phrases.length} Verified
          </span>
        </div>
        <p className="text-xs text-evoke-text-secondary font-light">
          Key philosophical axioms and recurring verbal patterns extracted from primary corpus
        </p>
      </div>

      {/* Grid of Curated Archival Quotes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {phrases.map((item) => (
          <Card
            key={item.id}
            hoverEffect={true}
            borderTheme="gold"
            className="p-4 sm:p-5 bg-evoke-card border-evoke-border flex flex-col justify-between transition-all duration-200 hover:shadow-md group"
          >
            <div>
              {/* Quote Mark & Confidence Pill */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <Quote className="w-4 h-4 text-[#C5A880]/70 group-hover:text-[#C5A880] transition-colors" />
                <span className="text-[10px] font-mono text-[#4ECCA3] bg-[#4ECCA3]/10 border border-[#4ECCA3]/25 px-2 py-0.5 rounded-full font-medium">
                  {item.confidence}% Match
                </span>
              </div>

              {/* Quote Body */}
              <blockquote className="text-xs sm:text-sm font-normal text-evoke-text-primary italic leading-relaxed mb-3 group-hover:text-[#C5A880] transition-colors">
                "{item.phrase}"
              </blockquote>
            </div>

            {/* Source Citation & Link to Converse */}
            <div className="pt-2.5 border-t border-evoke-border/60 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <BookOpen className="w-3 h-3 text-evoke-text-muted shrink-0" />
                <span className="text-[11px] text-evoke-text-secondary font-light truncate">
                  {item.context}
                </span>
              </div>

              <Link
                href="/converse"
                className="shrink-0 text-[11px] font-medium text-[#C5A880] hover:text-[#D4B890] flex items-center gap-1 group-hover:translate-x-0.5 transition-all"
              >
                <span>Inquire</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
