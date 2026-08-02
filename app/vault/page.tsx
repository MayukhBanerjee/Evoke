"use client";

import React from 'react';
import Link from 'next/link';
import { useEvoke } from '@/lib/store';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { CompletenessScore } from '@/components/vault/CompletenessScore';
import { PersonalityCard } from '@/components/vault/PersonalityCard';
import { PhraseCloud } from '@/components/vault/PhraseCloud';
import { TopicAccordion } from '@/components/vault/TopicAccordion';
import { VoicePreview } from '@/components/vault/VoicePreview';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MessageSquare, Plus, ArrowRight, History } from 'lucide-react';

export default function VaultPage() {
  const { activeVault, vaults, setActiveVaultId } = useEvoke();

  return (
    <main className="min-h-screen bg-evoke-bg text-evoke-text-primary pt-28 pb-16 relative transition-colors duration-300">
      <Navbar />

      {/* Vault Container */}
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Vault Switcher Header */}
        {vaults.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs text-evoke-text-secondary uppercase font-mono">Switch Vault:</span>
            {vaults.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVaultId(v.id)}
                className={`px-3 py-1.5 rounded-[100px] text-xs font-semibold transition-all ${
                  v.id === activeVault.id
                    ? 'bg-[#C5A880] text-[#080810] shadow-glow-gold'
                    : 'bg-evoke-surface border border-evoke-border text-evoke-text-secondary hover:text-evoke-text-primary'
                }`}
              >
                {v.name} ({v.relationship})
              </button>
            ))}
          </div>
        )}

        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-evoke-border">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-evoke-text-primary">
                {activeVault.name}
              </h1>
              <Badge variant="gold" className="text-xs">
                {activeVault.relationship}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-evoke-text-secondary font-light max-w-xl">
              {activeVault.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <CompletenessScore score={activeVault.completenessScore} />

            <Link href="/onboard">
              <Button variant="ghost" size="md" icon={<Plus className="w-4 h-4 text-[#C5A880]" />}>
                Add Memories
              </Button>
            </Link>

            <Link href="/converse">
              <Button variant="gold" size="md" icon={<MessageSquare className="w-4 h-4" />}>
                Converse
              </Button>
            </Link>
          </div>
        </div>

        {/* Voice Preview Banner */}
        <VoicePreview name={activeVault.name.split(' ')[0]} />

        {/* 4 Personality Cards Row */}
        <div>
          <h3 className="font-syne text-lg font-bold text-evoke-text-primary mb-4">
            Extracted Personality Traits
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PersonalityCard
              type="humor"
              title="Humor Style"
              badgeValue={activeVault.humorStyle.style}
              confidence={activeVault.humorStyle.confidence}
            />

            <PersonalityCard
              type="advice"
              title="Advice Tone"
              badgeValue={activeVault.adviceTone.tone}
              confidence={activeVault.adviceTone.confidence}
            />

            <PersonalityCard
              type="topics"
              title="Most Active Topics"
              tags={activeVault.activeTopics}
            />

            <PersonalityCard
              type="relationship"
              title="Relationship Tone"
              description={activeVault.relationshipTone}
            />
          </div>
        </div>

        {/* Signature Phrases Section */}
        {activeVault.signaturePhrases && activeVault.signaturePhrases.length > 0 && (
          <PhraseCloud phrases={activeVault.signaturePhrases} />
        )}

        {/* Topic Opinions Section */}
        {activeVault.topicOpinions && activeVault.topicOpinions.length > 0 && (
          <TopicAccordion topics={activeVault.topicOpinions} />
        )}

        {/* Recent Conversations Section */}
        <div className="space-y-4 pt-4 border-t border-evoke-border">
          <div className="flex items-center justify-between">
            <h3 className="font-syne text-lg font-bold text-evoke-text-primary flex items-center gap-2">
              <History className="w-5 h-5 text-[#C5A880]" />
              Recent Echo Exchanges
            </h3>

            <Link href="/converse">
              <span className="text-xs text-[#C5A880] hover:text-[#D4B890] font-semibold flex items-center gap-1">
                Open Conversation Space <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeVault.recentConversations.map((conv) => (
              <Card key={conv.id} className="p-5 border-evoke-border bg-evoke-card flex flex-col justify-between" hoverEffect={true} borderTheme="gold">
                <div>
                  <div className="flex items-center justify-between text-xs text-evoke-text-secondary font-mono mb-2">
                    <span>{conv.timestamp}</span>
                    {conv.duration && <span>{conv.duration}</span>}
                  </div>
                  <p className="text-xs text-evoke-text-primary font-light italic leading-relaxed mb-4">
                    "{conv.snippet}"
                  </p>
                </div>

                <Link href="/converse">
                  <Button variant="ghost" size="sm" className="w-full text-xs">
                    Revisit Exchange
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
