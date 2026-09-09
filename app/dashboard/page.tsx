"use client";

import React from 'react';
import Link from 'next/link';
import { useEvoke } from '@/lib/store';
import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CompletenessScore } from '@/components/vault/CompletenessScore';
import { Plus, MessageSquare, BookOpen, Activity, Sparkles, Clock, Heart } from 'lucide-react';

export default function DashboardPage() {
  const { vaults, setActiveVaultId } = useEvoke();

  const totalVaults = vaults.length;
  const totalConversations = vaults.reduce((acc, v) => acc + (v.recentConversations?.length || 0), 0);
  const avgCompleteness = Math.round(
    vaults.reduce((acc, v) => acc + v.completenessScore, 0) / (totalVaults || 1)
  );

  const ACTIVITIES = [
    {
      icon: <MessageSquare className="w-4 h-4 text-[#7C6AFF]" />,
      title: "Interactive session conducted with Dr. A.P.J. Abdul Kalam",
      time: "Recent session",
      type: "Conversation"
    },
    {
      icon: <Sparkles className="w-4 h-4 text-[#4ECCA3]" />,
      title: "Acoustic provenance & speech cadence verified for Barack Obama",
      time: "2 days ago",
      type: "AI Pipeline"
    },
    {
      icon: <BookOpen className="w-4 h-4 text-[#FF9A3C]" />,
      title: "Archival quote extracted from Wings of Fire",
      time: "4 days ago",
      type: "Archival Index"
    },
    {
      icon: <Heart className="w-4 h-4 text-[#C5A880]" />,
      title: "Persona vault verified for Dr. A.P.J. Abdul Kalam",
      time: "Archival Setup",
      type: "Vault Creation"
    }
  ];

  return (
    <main className="min-h-screen bg-evoke-bg text-evoke-text-primary pt-28 pb-16 relative transition-colors duration-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-evoke-border">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#C5A880] font-semibold">
              Overview
            </span>
            <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-evoke-text-primary mt-1">
              Your Memory Vaults
            </h1>
          </div>

          <Link href="/onboard">
            <Button variant="gold" size="lg" icon={<Plus className="w-5 h-5 text-[#080810]" />}>
              Create New Vault
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-evoke-border bg-evoke-card flex items-center justify-between" hoverEffect={true} borderTheme="gold">
            <div>
              <p className="text-xs text-evoke-text-secondary font-mono uppercase">Total Vaults Created</p>
              <h3 className="font-syne text-3xl font-extrabold text-evoke-text-primary mt-1">{totalVaults}</h3>
            </div>
            <div className="w-12 h-12 rounded-[10px] bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#C5A880]" />
            </div>
          </Card>

          <Card className="p-6 border-evoke-border bg-evoke-card flex items-center justify-between" hoverEffect={true}>
            <div>
              <p className="text-xs text-evoke-text-secondary font-mono uppercase">Total Conversations</p>
              <h3 className="font-syne text-3xl font-extrabold text-evoke-text-primary mt-1">{totalConversations}</h3>
            </div>
            <div className="w-12 h-12 rounded-[10px] bg-[#4ECCA3]/15 border border-[#4ECCA3]/30 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#4ECCA3]" />
            </div>
          </Card>

          <Card className="p-6 border-evoke-border bg-evoke-card flex items-center justify-between" hoverEffect={true}>
            <div>
              <p className="text-xs text-evoke-text-secondary font-mono uppercase">Completeness Average</p>
              <h3 className="font-syne text-3xl font-extrabold text-evoke-text-primary mt-1">{avgCompleteness}%</h3>
            </div>
            <div className="w-12 h-12 rounded-[10px] bg-[#7C6AFF]/10 border border-[#7C6AFF]/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#7C6AFF]" />
            </div>
          </Card>
        </div>

        {/* Vault Cards Grid */}
        <div>
          <h2 className="font-syne text-xl font-bold text-evoke-text-primary mb-6">
            Active Vaults
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vaults.map((vault) => (
              <Card
                key={vault.id}
                className="p-8 border-evoke-border hover:border-[#C5A880]/50 bg-evoke-card hover:shadow-glow-gold flex flex-col justify-between"
                borderTheme="gold"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge variant="gold" className="mb-2">
                        {vault.relationship}
                      </Badge>
                      <h3 className="font-syne text-2xl font-bold text-evoke-text-primary">
                        {vault.name}
                      </h3>
                      <p className="text-xs text-evoke-text-secondary font-light mt-1 line-clamp-2">
                        {vault.description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <CompletenessScore score={vault.completenessScore} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-evoke-text-muted font-mono my-4">
                    <Clock className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                    Last conversation: {vault.lastConversationDate}
                  </div>
                </div>

                <div className="pt-6 border-t border-evoke-border flex items-center gap-3">
                  <Link
                    href="/vault"
                    className="flex-grow"
                    onClick={() => setActiveVaultId(vault.id)}
                  >
                    <Button variant="ghost" size="md" className="w-full">
                      Open Vault
                    </Button>
                  </Link>

                  <Link
                    href="/converse"
                    className="flex-grow"
                    onClick={() => setActiveVaultId(vault.id)}
                  >
                    <Button variant="gold" size="md" className="w-full" icon={<MessageSquare className="w-4 h-4 text-[#080810]" />}>
                      Converse
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="pt-6 border-t border-evoke-border">
          <h2 className="font-syne text-xl font-bold text-evoke-text-primary mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#C5A880]" />
            Recent Activity Feed
          </h2>

          <Card className="p-6 border-evoke-border bg-evoke-card" hoverEffect={false}>
            <div className="space-y-4">
              {ACTIVITIES.map((act, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-[10px] bg-evoke-surface border border-evoke-border/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-evoke-card border border-evoke-border flex items-center justify-center shrink-0">
                      {act.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-evoke-text-primary">{act.title}</p>
                      <p className="text-[11px] text-evoke-text-secondary font-mono">{act.time}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-evoke-text-muted uppercase px-2 py-0.5 rounded-[100px] border border-evoke-border bg-evoke-card">
                    {act.type}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}
