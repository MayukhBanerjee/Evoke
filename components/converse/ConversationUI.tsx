"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvoke } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { Button } from '../ui/Button';
import { ArrowLeft, Send, User, Shield, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { AuditLogDrawer } from './AuditLogDrawer';

export const ConversationUI: React.FC = () => {
  const { 
    vaults, 
    activeVault, 
    setActiveVaultId, 
    messages, 
    addMessage, 
    isGeneratingEcho, 
    theme, 
    toggleTheme 
  } = useEvoke();

  const [inputText, setInputText] = useState('');
  const [showEntranceNotice, setShowEntranceNotice] = useState(true);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntranceNotice(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [activeVault.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGeneratingEcho]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isGeneratingEcho) return;
    addMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="w-full h-screen flex bg-evoke-bg text-evoke-text-primary overflow-hidden relative transition-colors duration-300">
      {/* Subtle Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C5A880]/5 via-transparent to-transparent pointer-events-none" />

      {/* Entrance Fade-in Banner */}
      <AnimatePresence>
        {showEntranceNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2 rounded-[100px] bg-evoke-surface/90 border border-evoke-border text-xs text-evoke-text-primary font-medium backdrop-blur-md shadow-lg flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#4ECCA3]" />
            Active Session: {activeVault.name}
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR: PROFILE SELECTION & ARCHIVAL SCHEMA */}
      <aside className="hidden lg:flex w-80 shrink-0 border-r border-evoke-border bg-evoke-surface p-5 flex-col justify-between z-20 overflow-y-auto">
        <div className="space-y-6">
          {/* Top Back Link */}
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 text-xs text-evoke-text-secondary hover:text-evoke-text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back to Personality Vault</span>
          </Link>

          {/* Clean Segregated Persona Selector */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-evoke-text-muted uppercase tracking-wider">
                Persona Profile
              </span>
              <span className="text-[10px] font-mono text-[#C5A880]">
                {vaults.length} Profiles
              </span>
            </div>

            <div className="space-y-2">
              {vaults.map((vault) => {
                const isSelected = vault.id === activeVault.id;
                return (
                  <button
                    key={vault.id}
                    type="button"
                    onClick={() => setActiveVaultId(vault.id)}
                    className={`w-full text-left p-3 rounded-[10px] transition-all border flex items-start justify-between ${
                      isSelected
                        ? 'bg-evoke-card border-[#C5A880]/50 shadow-sm ring-1 ring-[#C5A880]/20'
                        : 'bg-transparent border-transparent hover:bg-evoke-card/60 hover:border-evoke-border'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-0.5 ${
                          isSelected
                            ? 'bg-[#C5A880]/15 border-[#C5A880]/40 text-[#C5A880]'
                            : 'bg-evoke-surface border-evoke-border text-evoke-text-muted'
                        }`}
                      >
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-syne font-bold text-xs truncate ${isSelected ? 'text-evoke-text-primary' : 'text-evoke-text-secondary'}`}>
                          {vault.name}
                        </p>
                        <p className="text-[10px] text-evoke-text-muted truncate mt-0.5">
                          {vault.relationship}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-1 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profile Behavioral Traits */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-mono text-evoke-text-muted uppercase tracking-wider">
              Cognitive Blueprint
            </p>
            <div className="p-3.5 rounded-[10px] bg-evoke-card border border-evoke-border text-xs text-evoke-text-secondary space-y-2.5">
              <div>
                <span className="text-[10px] font-mono text-evoke-text-muted block">Humor Profile</span>
                <span className="text-evoke-text-primary font-medium text-[11px]">{activeVault.humorStyle.style}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-evoke-text-muted block">Advice Tone</span>
                <span className="text-evoke-text-primary font-medium text-[11px]">{activeVault.adviceTone.tone}</span>
              </div>
              <div className="pt-2 border-t border-evoke-border/50 flex items-center justify-between text-[10px] font-mono">
                <span className="text-evoke-text-muted">Archival Provenance</span>
                <span className="text-[#4ECCA3] font-semibold">{activeVault.completenessScore}% Verified</span>
              </div>
            </div>
          </div>

          {/* Indexed Archival Topics */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-mono text-evoke-text-muted uppercase tracking-wider">
              Indexed Topics
            </p>
            <div className="flex flex-wrap gap-1.5">
              {activeVault.activeTopics.map((topic, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-[6px] bg-evoke-card border border-evoke-border/60 text-[10px] font-mono text-evoke-text-secondary"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Audit Trail Invariants (I4) */}
        <div className="pt-4 border-t border-evoke-border space-y-2">
          <button
            onClick={() => setIsAuditOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] bg-evoke-card border border-evoke-border hover:border-[#4ECCA3]/50 text-xs text-evoke-text-secondary hover:text-evoke-text-primary transition-all group"
          >
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Shield className="w-3.5 h-3.5 text-[#4ECCA3]" />
              Audit Trail (I4)
            </span>
            <span className="text-[10px] text-[#4ECCA3] font-mono group-hover:underline">Inspect</span>
          </button>
          <div className="text-[10px] text-evoke-text-muted font-mono flex items-center gap-1.5 px-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ECCA3]" />
            Consent Verification Active
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONVERSATION AREA */}
      <main className="flex-grow flex flex-col justify-between h-full relative z-10">
        {/* Top App Header with Persona Tabs and Light/Dark Mode Button on the Top Right */}
        <header className="px-6 py-3.5 border-b border-evoke-border bg-evoke-surface/90 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center">
              <User className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div>
              <h2 className="font-syne font-bold text-sm text-evoke-text-primary leading-none">
                {activeVault.name}
              </h2>
              <p className="text-[10px] text-evoke-text-muted font-mono mt-0.5">
                {activeVault.relationship}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Persona Switcher in Header */}
            <div className="flex items-center p-1 rounded-[8px] bg-evoke-card border border-evoke-border text-xs">
              {vaults.map((v) => {
                const isSelected = v.id === activeVault.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setActiveVaultId(v.id)}
                    className={`px-3 py-1 rounded-[6px] text-[11px] font-mono transition-all ${
                      isSelected
                        ? 'bg-evoke-surface text-evoke-text-primary font-bold border border-evoke-border shadow-xs'
                        : 'text-evoke-text-muted hover:text-evoke-text-secondary'
                    }`}
                  >
                    {v.id.includes('kalam') ? 'Dr. Kalam' : 'Barack Obama'}
                  </button>
                );
              })}
            </div>

            {/* Light / Dark Mode Toggle Button on the Top Right Section */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Light and Dark Mode"
              className="flex items-center gap-2 px-3 py-1.5 rounded-[8px] bg-evoke-card border border-evoke-border hover:border-[#C5A880]/50 text-xs text-evoke-text-secondary hover:text-evoke-text-primary transition-all shadow-xs"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FF9A3C]" />
                  <span className="font-mono text-[11px] hidden sm:inline">Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#7C6AFF]" />
                  <span className="font-mono text-[11px] hidden sm:inline">Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* Scrollable Conversation Stream */}
        <div className="flex-grow overflow-y-auto px-6 md:px-16 py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto my-auto py-12">
              <div className="w-12 h-12 rounded-full bg-[#C5A880]/10 border border-[#C5A880]/30 flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-[#C5A880]" />
              </div>
              <h2 className="font-syne text-xl font-bold text-evoke-text-primary mb-1">
                {activeVault.name}
              </h2>
              <p className="text-xs text-[#C5A880] font-mono mb-3">
                {activeVault.relationship}
              </p>
              <p className="text-xs text-evoke-text-secondary font-light leading-relaxed max-w-md mb-6">
                {activeVault.description}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md">
                {activeVault.activeTopics.map((topic, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-[6px] bg-evoke-surface border border-evoke-border text-[10px] font-mono text-evoke-text-muted"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <React.Fragment key={msg.id}>
                <MessageBubble message={msg} echoName={activeVault.name.split(' ')[0]} />
                {idx < messages.length - 1 && (
                  <div className="w-full h-px bg-evoke-border/40 my-2" />
                )}
              </React.Fragment>
            ))
          )}

          {/* Typing Indicator */}
          {isGeneratingEcho && (
            <div className="py-4 flex items-center gap-3 text-xs text-[#C5A880] font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
              <span>Generating response grounded in {activeVault.name}'s profile...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* FIXED BOTTOM INPUT AREA (Clean, unencumbered input) */}
        <div className="p-4 md:px-16 bg-evoke-bg/95 backdrop-blur-md border-t border-evoke-border">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex flex-col gap-2">
            <div className="relative flex items-center bg-evoke-surface border border-evoke-border rounded-[10px] focus-within:border-[#C5A880] focus-within:ring-1 focus-within:ring-[#C5A880]/30 transition-all p-2.5">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Inquire with ${activeVault.name}...`}
                rows={2}
                className="w-full bg-transparent text-sm text-evoke-text-primary placeholder-evoke-text-muted focus:outline-none resize-none px-3 py-1.5"
              />

              <div className="flex items-center gap-2 pr-2 shrink-0">
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={!inputText.trim() || isGeneratingEcho}
                  icon={<Send className="w-3.5 h-3.5 text-[#080810]" />}
                >
                  Inquire
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-evoke-text-muted font-mono px-1">
              <span>Verified persona blueprint: {activeVault.name}</span>
              <span>Epistemic Humility Gate τ = 0.70</span>
            </div>
          </form>
        </div>
      </main>

      {/* Tamper-Evident Audit Log Drawer (Invariant I4) */}
      <AuditLogDrawer
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        vaultId={activeVault.id}
      />
    </div>
  );
};
