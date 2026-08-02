"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvoke } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { Button } from '../ui/Button';
import { ArrowLeft, Send, Sparkles, User, History, Shield, Mic } from 'lucide-react';

export const ConversationUI: React.FC = () => {
  const { activeVault, messages, addMessage, isGeneratingEcho } = useEvoke();
  const [inputText, setInputText] = useState('');
  const [showEntranceNotice, setShowEntranceNotice] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fade entrance notice after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntranceNotice(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when messages update
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
    <div className="w-full h-screen flex bg-[#080810] text-[#F0F0F8] overflow-hidden relative">
      {/* Subtle Slow-moving Radial Warmth Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#7C6AFF]/10 via-transparent to-transparent pointer-events-none" />

      {/* Brief 2-second Entrance Fade-in Banner */}
      <AnimatePresence>
        {showEntranceNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-2.5 rounded-pill bg-[#7C6AFF]/15 border border-[#7C6AFF]/30 text-xs text-[#F0F0F8] font-medium backdrop-blur-md shadow-glow flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#7C6AFF]" />
            You're speaking with {activeVault.name}'s echo
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR (20% width on desktop) */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-[#1E1E30] bg-[#0F0F1A] p-6 flex-col justify-between z-20">
        <div className="space-y-6">
          {/* Top Back Link */}
          <Link
            href="/vault"
            className="inline-flex items-center gap-2 text-xs text-[#9090A8] hover:text-[#F0F0F8] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Personality Vault
          </Link>

          {/* Profile Card Sidebar Header */}
          <div className="p-4 rounded-[14px] bg-[#14141F] border border-[#1E1E30] flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#7C6AFF]/20 border border-[#7C6AFF] flex items-center justify-center shrink-0 shadow-glow">
              <User className="w-6 h-6 text-[#7C6AFF]" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-sm text-[#F0F0F8] line-clamp-1">
                {activeVault.name}
              </h3>
              <p className="text-xs text-[#4ECCA3] font-mono">
                {activeVault.relationship}
              </p>
            </div>
          </div>

          {/* Persona Hints */}
          <div className="space-y-2">
            <p className="text-[11px] font-mono text-[#55556A] uppercase tracking-wider">
              Echo Profile Traits
            </p>
            <div className="p-3 rounded-[10px] bg-[#14141F]/60 border border-[#1E1E30] text-xs text-[#9090A8] space-y-1">
              <p><span className="text-[#F0F0F8]">Humor:</span> {activeVault.humorStyle.style}</p>
              <p><span className="text-[#F0F0F8]">Advice:</span> {activeVault.adviceTone.tone}</p>
            </div>
          </div>

          {/* Recent Timestamps */}
          <div className="space-y-3">
            <p className="text-[11px] font-mono text-[#55556A] uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5" />
              Recent Conversations
            </p>
            <div className="space-y-2">
              {activeVault.recentConversations.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-[8px] bg-[#14141F]/40 border border-[#1E1E30]/50 text-xs text-[#9090A8] hover:border-[#7C6AFF]/30 transition-colors"
                >
                  <p className="font-mono text-[10px] text-[#7C6AFF]">{c.timestamp}</p>
                  <p className="truncate font-light text-[#F0F0F8] mt-0.5">{c.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E1E30] text-[11px] text-[#55556A] font-mono flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-[#4ECCA3]" />
          Consent Vault Active
        </div>
      </aside>

      {/* RIGHT MAIN CONVERSATION AREA (80%) */}
      <main className="flex-grow flex flex-col justify-between h-full relative z-10">
        {/* Mobile Header */}
        <header className="lg:hidden p-4 border-b border-[#1E1E30] bg-[#0F0F1A] flex items-center justify-between">
          <Link href="/vault" className="text-xs text-[#9090A8] flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Vault
          </Link>
          <span className="font-syne font-bold text-sm text-[#F0F0F8]">
            {activeVault.name}'s Echo
          </span>
          <span className="w-2 h-2 rounded-full bg-[#4ECCA3]" />
        </header>

        {/* Scrollable Conversation Stream */}
        <div className="flex-grow overflow-y-auto px-6 md:px-16 py-8 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
              <Sparkles className="w-10 h-10 text-[#7C6AFF]/40 mb-4" />
              <p className="font-syne text-xl text-[#F0F0F8] mb-2">
                This space is quiet and ready.
              </p>
              <p className="text-xs text-[#9090A8] font-light">
                Say something to {activeVault.name}. Their echo will respond in their voice and words.
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <React.Fragment key={msg.id}>
                <MessageBubble message={msg} echoName={activeVault.name.split(' ')[0]} />
                {idx < messages.length - 1 && (
                  <div className="w-full h-px bg-[#1E1E30]/40 my-2" />
                )}
              </React.Fragment>
            ))
          )}

          {/* Typing / Generating Indicator */}
          {isGeneratingEcho && (
            <div className="py-4 flex items-center gap-3 text-xs text-[#7C6AFF] font-mono animate-pulse">
              <span className="w-2 h-2 rounded-full bg-[#7C6AFF]" />
              <span>{activeVault.name}'s echo is synthesizing a response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* FIXED BOTTOM INPUT AREA */}
        <div className="p-6 md:px-16 bg-[#080810]/95 backdrop-blur-md border-t border-[#1E1E30]">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex flex-col gap-2">
            <div className="relative flex items-center bg-[#0F0F1A] border border-[#1E1E30] rounded-[10px] focus-within:border-[#7C6AFF] focus-within:ring-2 focus-within:ring-[#7C6AFF]/20 transition-all p-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Say something to ${activeVault.name.split(' ')[0]}...`}
                rows={2}
                className="w-full bg-transparent text-sm text-[#F0F0F8] placeholder-[#55556A] focus:outline-none resize-none px-3 py-1.5"
              />

              <div className="flex items-center gap-2 pr-2 shrink-0">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!inputText.trim() || isGeneratingEcho}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#55556A] font-mono px-1">
              <span>Responses shaped by {activeVault.name}'s personality profile</span>
              <span>Powered by Groq + ElevenLabs</span>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
