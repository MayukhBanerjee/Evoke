"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvoke } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { Button } from '../ui/Button';
import { ArrowLeft, Send, Sparkles, User, History, Shield, Sun, Moon } from 'lucide-react';

export const ConversationUI: React.FC = () => {
  const { activeVault, messages, addMessage, isGeneratingEcho, theme, toggleTheme } = useEvoke();
  const [inputText, setInputText] = useState('');
  const [showEntranceNotice, setShowEntranceNotice] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntranceNotice(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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
      {/* Subtle Slow-moving Radial Warmth Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#C5A880]/8 via-transparent to-transparent pointer-events-none" />

      {/* Entrance Fade-in Banner */}
      <AnimatePresence>
        {showEntranceNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 rounded-pill bg-[#C5A880]/15 border border-[#C5A880]/30 text-xs text-evoke-text-primary font-semibold backdrop-blur-md shadow-glow-gold flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            You're speaking with {activeVault.name}'s echo
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-evoke-border bg-evoke-surface p-6 flex-col justify-between z-20">
        <div className="space-y-6">
          {/* Top Back Link */}
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 text-xs text-evoke-text-secondary hover:text-evoke-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Personality Vault
          </Link>

          {/* Profile Card Sidebar Header */}
          <div className="p-4 rounded-[14px] bg-evoke-card border border-evoke-border flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/40 flex items-center justify-center shrink-0 shadow-glow-gold">
              <User className="w-6 h-6 text-[#C5A880]" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-sm text-evoke-text-primary line-clamp-1">
                {activeVault.name}
              </h3>
              <p className="text-xs text-[#C5A880] font-semibold">
                {activeVault.relationship}
              </p>
            </div>
          </div>

          {/* Theme switcher integrated in conversation side area */}
          <div className="flex items-center justify-between p-3 rounded-[10px] bg-evoke-card border border-evoke-border text-xs text-evoke-text-secondary">
            <span>Theme Preference:</span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-[100px] bg-evoke-surface border border-evoke-border text-evoke-text-primary hover:border-[#7C6AFF]/50 transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#FF9A3C]" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-[#7C6AFF]" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Persona Hints */}
          <div className="space-y-2">
            <p className="text-[11px] font-mono text-evoke-text-muted uppercase tracking-wider">
              Echo Profile Traits
            </p>
            <div className="p-3 rounded-[10px] bg-evoke-card border border-evoke-border text-xs text-evoke-text-secondary space-y-1">
              <p><span className="text-evoke-text-primary font-semibold">Humor:</span> {activeVault.humorStyle.style}</p>
              <p><span className="text-evoke-text-primary font-semibold">Advice:</span> {activeVault.adviceTone.tone}</p>
            </div>
          </div>

          {/* Recent Timestamps */}
          <div className="space-y-3">
            <p className="text-[11px] font-mono text-evoke-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Recent Conversations
            </p>
            <div className="space-y-2">
              {activeVault.recentConversations.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-[8px] bg-evoke-card border border-evoke-border/50 text-xs text-evoke-text-secondary hover:border-[#C5A880]/30 transition-colors"
                >
                  <p className="font-mono text-[10px] text-[#C5A880]">{c.timestamp}</p>
                  <p className="truncate font-light text-evoke-text-primary mt-0.5">{c.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-evoke-border text-[11px] text-evoke-text-muted font-mono flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#4ECCA3]" />
          Consent Vault Active
        </div>
      </aside>

      {/* RIGHT MAIN CONVERSATION AREA */}
      <main className="flex-grow flex flex-col justify-between h-full relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 border-b border-evoke-border bg-evoke-surface flex items-center justify-between">
          <Link href="/vault" className="text-xs text-evoke-text-secondary flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Vault
          </Link>
          <span className="font-syne font-bold text-sm text-evoke-text-primary">
            {activeVault.name}'s Echo
          </span>
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-[8px] bg-evoke-card border border-evoke-border flex items-center justify-center text-evoke-text-primary"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-[#FF9A3C]" /> : <Moon className="w-3.5 h-3.5 text-[#7C6AFF]" />}
          </button>
        </header>

        {/* Scrollable Conversation Stream */}
        <div className="flex-grow overflow-y-auto px-6 md:px-16 py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
              <Sparkles className="w-10 h-10 text-[#C5A880]/40 mb-4 animate-pulse" />
              <p className="font-syne text-xl text-evoke-text-primary mb-2">
                This space is quiet and ready.
              </p>
              <p className="text-xs text-evoke-text-secondary font-light">
                Say something to {activeVault.name}. Their echo will respond in their voice and words.
              </p>
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
              <span>{activeVault.name}'s echo is synthesizing a response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* FIXED BOTTOM INPUT AREA */}
        <div className="p-6 md:px-16 bg-evoke-bg/95 backdrop-blur-md border-t border-evoke-border">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex flex-col gap-2">
            <div className="relative flex items-center bg-evoke-surface border border-evoke-border rounded-[10px] focus-within:border-[#C5A880] focus-within:ring-2 focus-within:ring-[#C5A880]/15 transition-all p-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Say something to ${activeVault.name.split(' ')[0]}...`}
                rows={2}
                className="w-full bg-transparent text-sm text-evoke-text-primary placeholder-evoke-text-muted focus:outline-none resize-none px-3 py-1.5"
              />

              <div className="flex items-center gap-2 pr-2 shrink-0">
                <Button
                  type="submit"
                  variant="gold"
                  size="md"
                  disabled={!inputText.trim() || isGeneratingEcho}
                  icon={<Send className="w-4 h-4 text-[#080810]" />}
                >
                  Send
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-evoke-text-muted font-mono px-1">
              <span>Responses shaped by {activeVault.name}'s personality profile</span>
              <span>Powered by Groq + ElevenLabs</span>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
