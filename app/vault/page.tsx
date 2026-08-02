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
import { MessageSquare, Plus, ArrowRight, History, Shield, Heart } from 'lucide-react';

export default function VaultPage() {
  const { activeVault, vaults, setActiveVaultId } = useEvoke();

  return (
    <main className="min-h-screen bg-[#080810] text-[#F0F0F8] pt-28 pb-16 relative">
      <Navbar />

      {/* Vault Container */}
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        
        {/* Vault Switcher Header */}
        {vaults.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-xs text-[#9090A8] uppercase font-mono">Switch Vault:</span>
            {vaults.map((v) => (
              <button
                key={v.id}
                onClick={() => setActiveVaultId(v.id)}
                className={`px-3 py-1.5 rounded-[100px] text-xs font-medium transition-all ${
                  v.id === activeVault.id
                    ? 'bg-[#7C6AFF] text-white shadow-glow'
                    : 'bg-[#0F0F1A] border border-[#1E1E30] text-[#9090A8] hover:text-[#F0F0F8]'
                }`}
              >
                {v.name} ({v.relationship})
              </button>
            ))}
          </div>
        )}

        {/* Page Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#1E1E30]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-[#F0F0F8]">
                {activeVault.name}
              </h1>
              <Badge variant="status" className="text-xs">
                {activeVault.relationship}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#9090A8] font-light max-w-xl">
              {activeVault.description}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <CompletenessScore score={activeVault.completenessScore} />

            <Link href="/onboard">
              <Button variant="ghost" size="md" icon={<Plus className="w-4 h-4 text-[#7C6AFF]" />}>
                Add Memories
              </Button>
            </Link>

            <Link href="/converse">
              <Button variant="primary" size="md" icon={<MessageSquare className="w-4 h-4" />}>
                Converse
              </Button>
            </Link>
          </div>
        </div>

        {/* Voice Preview Banner */}
        <VoicePreview name={activeVault.name.split(' ')[0]} />

        {/* 4 Personality Cards Row */}
        <div>
          <h3 className="font-syne text-lg font-bold text-[#F0F0F8] mb-4">
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
        <div className="space-y-4 pt-4 border-t border-[#1E1E30]">
          <div className="flex items-center justify-between">
            <h3 className="font-syne text-lg font-bold text-[#F0F0F8] flex items-center gap-2">
              <History className="w-5 h-5 text-[#7C6AFF]" />
              Recent Echo Exchanges
            </h3>

            <Link href="/converse">
              <span className="text-xs text-[#7C6AFF] hover:text-[#9D8FFF] font-medium flex items-center gap-1">
                Open Conversation Space <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeVault.recentConversations.map((conv) => (
              <Card key={conv.id} className="p-5 border-[#1E1E30] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#9090A8] font-mono mb-2">
                    <span>{conv.timestamp}</span>
                    {conv.duration && <span>{conv.duration}</span>}
                  </div>
                  <p className="text-xs text-[#F0F0F8] font-light italic leading-relaxed mb-4">
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
