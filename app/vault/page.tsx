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
import { 
  MessageSquare, 
  Plus, 
  ArrowRight, 
  History, 
  Sparkles, 
  User, 
  Database, 
  CheckCircle2, 
  Layers,
  Volume2
} from 'lucide-react';

export default function VaultPage() {
  const { activeVault, vaults, setActiveVaultId } = useEvoke();

  // Helper to extract initials for archival monogram
  const getInitials = (name: string) => {
    if (name.includes('Kalam')) return 'AK';
    if (name.includes('Obama')) return 'BO';
    const parts = name.split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <main className="min-h-screen bg-evoke-bg text-evoke-text-primary pt-24 sm:pt-28 pb-20 relative transition-colors duration-300">
      <Navbar />

      {/* Main Archival Vault Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Vault Switcher Strip */}
        {vaults.length > 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-evoke-border/60">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-[11px] font-mono uppercase tracking-wider text-evoke-text-muted shrink-0 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-[#C5A880]" />
                Select Vault:
              </span>
              {vaults.map((v) => {
                const isActive = v.id === activeVault.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveVaultId(v.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 shrink-0 ${
                      isActive
                        ? 'bg-[#C5A880] text-[#080810] font-semibold shadow-[0_0_15px_rgba(197,168,128,0.35)]'
                        : 'bg-evoke-surface border border-evoke-border text-evoke-text-secondary hover:text-evoke-text-primary hover:border-evoke-border'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#080810]' : 'bg-[#C5A880]'}`} />
                    <span>{v.name}</span>
                    <span className={`text-[10px] hidden md:inline ${isActive ? 'opacity-80' : 'text-evoke-text-muted'}`}>
                      • {v.relationship.split('&')[0].trim()}
                    </span>
                  </button>
                );
              })}
            </div>

            <Link href="/onboard" className="hidden lg:flex items-center gap-1 text-xs text-[#C5A880] hover:text-[#D4B890] transition-colors shrink-0 font-medium">
              <Plus className="w-3.5 h-3.5" />
              <span>Create New Persona Vault</span>
            </Link>
          </div>
        )}

        {/* Archival Persona Hero Banner */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-evoke-card via-evoke-card to-evoke-surface/90 border border-evoke-border/80 shadow-md relative overflow-hidden">
          {/* Subtle Ambient Radial Halos */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-[#C5A880]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -bottom-16 w-80 h-80 bg-[#7C6AFF]/05 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4ECCA3] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4ECCA3]" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#4ECCA3] font-semibold">
                Archival Presence Active
              </span>
              <span className="text-evoke-border">•</span>
              <span className="text-[11px] font-mono text-evoke-text-muted">
                Profile ID: {activeVault.id}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-evoke-text-muted bg-evoke-surface/80 border border-evoke-border/60 px-3 py-1 rounded-full">
              <Database className="w-3 h-3 text-[#C5A880]" />
              <span>AWS Bedrock & DynamoDB Synced</span>
            </div>
          </div>

          {/* Hero Content Split */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            {/* Left: Avatar Monogram + Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {/* Monogram Archival Badge */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#C5A880]/25 via-evoke-surface to-[#C5A880]/10 border-2 border-[#C5A880]/40 flex items-center justify-center shadow-lg shadow-[#C5A880]/10 group">
                  <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#C5A880] tracking-wider">
                    {getInitials(activeVault.name)}
                  </span>
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#080810] border-2 border-[#C5A880] flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#4ECCA3]" />
                </div>
              </div>

              {/* Persona Metadata */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-evoke-text-primary tracking-tight leading-tight">
                    {activeVault.name}
                  </h1>
                </div>

                <div className="inline-block">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 tracking-wide">
                    {activeVault.relationship}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-evoke-text-secondary font-light max-w-2xl leading-relaxed">
                  {activeVault.description}
                </p>
              </div>
            </div>

            {/* Right: Fidelity Metric & Side-by-Side CTAs */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-start sm:items-center gap-4 lg:shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-evoke-border/60">
              <CompletenessScore score={activeVault.completenessScore} />

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Link href="/onboard" className="flex-1 sm:flex-none">
                  <Button 
                    variant="ghost" 
                    size="md" 
                    icon={<Plus className="w-4 h-4 text-[#C5A880]" />}
                    className="w-full sm:w-auto text-xs"
                  >
                    Add Memories
                  </Button>
                </Link>

                <Link href="/converse" className="flex-1 sm:flex-none">
                  <Button 
                    variant="gold" 
                    size="md" 
                    icon={<MessageSquare className="w-4 h-4" />}
                    className="w-full sm:w-auto text-xs font-semibold shadow-md"
                  >
                    Converse
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Footer Strip */}
          <div className="mt-8 pt-5 border-t border-evoke-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <div>
                <span className="text-evoke-text-muted text-[11px] block">Signature Axioms</span>
                <span className="font-heading font-semibold text-evoke-text-primary">
                  {activeVault.signaturePhrases?.length || 8} Verified Quotes
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-[#4ECCA3]" />
              <div>
                <span className="text-evoke-text-muted text-[11px] block">Philosophical Stances</span>
                <span className="font-heading font-semibold text-evoke-text-primary">
                  {activeVault.topicOpinions?.length || 6} Topic Dimensions
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Volume2 className="w-3.5 h-3.5 text-[#FF9A3C]" />
              <div>
                <span className="text-evoke-text-muted text-[11px] block">Neural Synthesizer</span>
                <span className="font-heading font-semibold text-evoke-text-primary">11Labs 48kHz HD</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-[#7C6AFF]" />
              <div>
                <span className="text-evoke-text-muted text-[11px] block">RAG Memory Index</span>
                <span className="font-heading font-semibold text-evoke-text-primary">OpenSearch Vector</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Voice Preview Banner */}
        <VoicePreview 
          name={activeVault.name} 
          relationship={activeVault.relationship}
        />

        {/* Section 2: Extracted Personality Traits */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#7C6AFF]/15 border border-[#7C6AFF]/30 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#7C6AFF]" />
              </div>
              <h2 className="font-heading text-lg font-bold text-evoke-text-primary tracking-tight">
                Extracted Persona Dimensions
              </h2>
              <span className="text-[11px] font-mono text-[#7C6AFF] bg-[#7C6AFF]/10 border border-[#7C6AFF]/25 px-2 py-0.5 rounded-full">
                4 Core Dimensions
              </span>
            </div>
            <p className="text-xs text-evoke-text-secondary font-light">
              Autonomous cognitive fingerprint synthesized across speeches, writings, and archival memories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <PersonalityCard
              type="humor"
              title="Humor & Conversational Nuance"
              badgeValue={activeVault.humorStyle.style}
              confidence={activeVault.humorStyle.confidence}
            />

            <PersonalityCard
              type="advice"
              title="Guidance & Mentorship Demeanor"
              badgeValue={activeVault.adviceTone.tone}
              confidence={activeVault.adviceTone.confidence}
            />

            <PersonalityCard
              type="topics"
              title="Primary Intellectual Domains"
              tags={activeVault.activeTopics}
            />

            <PersonalityCard
              type="relationship"
              title="Interpersonal Relational Stance"
              description={activeVault.relationshipTone}
            />
          </div>
        </div>

        {/* Section 3: Signature Phrases */}
        {activeVault.signaturePhrases && activeVault.signaturePhrases.length > 0 && (
          <PhraseCloud 
            phrases={activeVault.signaturePhrases} 
            vaultName={activeVault.name}
          />
        )}

        {/* Section 4: Topic Opinions */}
        {activeVault.topicOpinions && activeVault.topicOpinions.length > 0 && (
          <TopicAccordion topics={activeVault.topicOpinions} />
        )}

        {/* Section 5: Recent Conversations */}
        <div className="space-y-4 pt-6 border-t border-evoke-border/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center">
                <History className="w-3.5 h-3.5 text-[#C5A880]" />
              </div>
              <h3 className="font-heading text-lg font-bold text-evoke-text-primary tracking-tight">
                Recent Archival Exchanges
              </h3>
            </div>

            <Link href="/converse">
              <span className="text-xs text-[#C5A880] hover:text-[#D4B890] font-medium flex items-center gap-1 transition-colors">
                <span>Enter Conversation Space</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          {activeVault.recentConversations.length === 0 ? (
            <Card className="p-8 text-center bg-evoke-card/60 border-evoke-border/80" hoverEffect={false}>
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center mx-auto shadow-xs">
                  <MessageSquare className="w-6 h-6 text-[#C5A880]" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-heading font-semibold text-sm sm:text-base text-evoke-text-primary">
                    The Archive is Pristine and Ready
                  </h4>
                  <p className="text-xs text-evoke-text-secondary font-light leading-relaxed">
                    No active dialogue records logged yet for {activeVault.name}. Step into the conversation chamber to ask questions, explore past memories, and hear their voice.
                  </p>
                </div>
                <Link href="/converse" className="inline-block pt-1">
                  <Button variant="gold" size="md" icon={<MessageSquare className="w-4 h-4" />}>
                    Begin Inquiry with {activeVault.name}
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeVault.recentConversations.map((conv) => (
                <Card 
                  key={conv.id} 
                  className="p-5 border-evoke-border bg-evoke-card flex flex-col justify-between" 
                  hoverEffect={true} 
                  borderTheme="gold"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-evoke-text-muted font-mono mb-2.5">
                      <span>{conv.timestamp}</span>
                      {conv.duration && (
                        <span className="text-[#C5A880]">{conv.duration}</span>
                      )}
                    </div>
                    <p className="text-xs text-evoke-text-primary font-normal italic leading-relaxed mb-4">
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
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
