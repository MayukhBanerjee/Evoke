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
import { Plus, MessageSquare, BookOpen, Activity, Sparkles, Clock, ShieldCheck, Heart } from 'lucide-react';

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
      title: "Conversation held with Rajesh Banerjee",
      time: "Yesterday at 9:42 PM",
      type: "Conversation"
    },
    {
      icon: <Sparkles className="w-4 h-4 text-[#4ECCA3]" />,
      title: "Voice pattern neural clone updated for Sunita Patel",
      time: "3 days ago",
      type: "AI Pipeline"
    },
    {
      icon: <BookOpen className="w-4 h-4 text-[#FF9A3C]" />,
      title: "New signature phrase extracted from journal entry",
      time: "5 days ago",
      type: "Memory Added"
    },
    {
      icon: <Heart className="w-4 h-4 text-[#7C6AFF]" />,
      title: "Vault created for Rajesh Banerjee",
      time: "Nov 14, 2025",
      type: "Vault Creation"
    }
  ];

  return (
    <main className="min-h-screen bg-[#080810] text-[#F0F0F8] pt-28 pb-16 relative">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E1E30]">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#7C6AFF] font-medium">
              Overview
            </span>
            <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-[#F0F0F8] mt-1">
              Your Memory Vaults
            </h1>
          </div>

          <Link href="/onboard">
            <Button variant="primary" size="lg" icon={<Plus className="w-5 h-5" />}>
              Create New Vault
            </Button>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-[#1E1E30] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#9090A8] font-mono uppercase">Total Vaults Created</p>
              <h3 className="font-syne text-3xl font-extrabold text-[#F0F0F8] mt-1">{totalVaults}</h3>
            </div>
            <div className="w-12 h-12 rounded-[10px] bg-[#7C6AFF]/10 border border-[#7C6AFF]/30 flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#7C6AFF]" />
            </div>
          </Card>

          <Card className="p-6 border-[#1E1E30] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#9090A8] font-mono uppercase">Total Conversations</p>
              <h3 className="font-syne text-3xl font-extrabold text-[#F0F0F8] mt-1">{totalConversations}</h3>
            </div>
            <div className="w-12 h-12 rounded-[10px] bg-[#4ECCA3]/10 border border-[#4ECCA3]/30 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[#4ECCA3]" />
            </div>
          </Card>

          <Card className="p-6 border-[#1E1E30] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#9090A8] font-mono uppercase">Completeness Average</p>
              <h3 className="font-syne text-3xl font-extrabold text-[#F0F0F8] mt-1">{avgCompleteness}%</h3>
            </div>
            <div className="w-12 h-12 rounded-[10px] bg-[#FF9A3C]/10 border border-[#FF9A3C]/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#FF9A3C]" />
            </div>
          </Card>
        </div>

        {/* Vault Cards Grid */}
        <div>
          <h2 className="font-syne text-xl font-bold text-[#F0F0F8] mb-6">
            Active Vaults
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {vaults.map((vault) => (
              <Card
                key={vault.id}
                className="p-8 border-[#1E1E30] hover:border-[#7C6AFF]/50 hover:shadow-glow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge variant="status" className="mb-2">
                        {vault.relationship}
                      </Badge>
                      <h3 className="font-syne text-2xl font-bold text-[#F0F0F8]">
                        {vault.name}
                      </h3>
                      <p className="text-xs text-[#9090A8] font-light mt-1 line-clamp-2">
                        {vault.description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <CompletenessScore score={vault.completenessScore} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[#55556A] font-mono my-4">
                    <Clock className="w-3.5 h-3.5" />
                    Last conversation: {vault.lastConversationDate}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#1E1E30] flex items-center gap-3">
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
                    <Button variant="primary" size="md" className="w-full" icon={<MessageSquare className="w-4 h-4" />}>
                      Converse
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="pt-6 border-t border-[#1E1E30]">
          <h2 className="font-syne text-xl font-bold text-[#F0F0F8] mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#7C6AFF]" />
            Recent Activity Feed
          </h2>

          <Card className="p-6 border-[#1E1E30]">
            <div className="space-y-4">
              {ACTIVITIES.map((act, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-[10px] bg-[#0F0F1A] border border-[#1E1E30]/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#14141F] border border-[#1E1E30] flex items-center justify-center shrink-0">
                      {act.icon}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[#F0F0F8]">{act.title}</p>
                      <p className="text-[11px] text-[#9090A8] font-mono">{act.time}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[#55556A] uppercase px-2 py-0.5 rounded-[100px] border border-[#1E1E30]">
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
