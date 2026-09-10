"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvoke } from '@/lib/store';
import { MessageBubble } from './MessageBubble';
import { Button } from '../ui/Button';
import { ArrowLeft, Send, User, Shield, Sun, Moon, CheckCircle2, RotateCcw, Sparkles, ArrowUpRight, Mic, MicOff, AlertCircle } from 'lucide-react';
import { AuditLogDrawer } from './AuditLogDrawer';
import { useSpeechRecognition } from '@/lib/useSpeechRecognition';

interface StarterInquiry {
  title: string;
  prompt: string;
}

const STARTER_INQUIRIES: Record<string, { quote: string; quoteSource: string; starters: StarterInquiry[] }> = {
  'vault-kalam': {
    quote: "Dreams are not what you see in sleep, dreams are things that do not let you sleep.",
    quoteSource: "Wings of Fire (1999)",
    starters: [
      {
        title: "Navigating Mission Failure",
        prompt: "When the 1979 SLV-3 mission crashed into the sea, how did you find the courage to begin again?"
      },
      {
        title: "Purpose for the Youth",
        prompt: "How should a young person decide between corporate comfort and high-risk scientific research?"
      },
      {
        title: "Ethics & Grassroots Healing",
        prompt: "What inspired you to turn aerospace defense technology into affordable healthcare stents?"
      }
    ]
  },
  'vault-obama': {
    quote: "The arc of the moral universe is long, but it bends toward justice.",
    quoteSource: "Selma 50th Anniversary Address",
    starters: [
      {
        title: "Decisions Under Uncertainty",
        prompt: "How do you make consequential executive decisions when you only have 70% of the information?"
      },
      {
        title: "Persevering Past Cynicism",
        prompt: "How do you keep from becoming cynical when systemic progress is agonizingly slow?"
      },
      {
        title: "The Office of Citizen",
        prompt: "What is the most critical responsibility of an ordinary citizen in protecting democratic norms?"
      }
    ]
  }
};

export const ConversationUI: React.FC = () => {
  const { 
    vaults, 
    activeVault, 
    setActiveVaultId, 
    messages, 
    addMessage, 
    clearMessages,
    isGeneratingEcho, 
    theme, 
    toggleTheme 
  } = useEvoke();

  const [inputText, setInputText] = useState('');
  const [showEntranceNotice, setShowEntranceNotice] = useState(true);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const baseInputBeforeVoiceRef = useRef<string>('');

  const {
    isSupported: isSpeechSupported,
    isListening,
    isSpeaking,
    error: speechError,
    startListening,
    stopListening,
    clearError: clearSpeechError,
  } = useSpeechRecognition();

  const handleToggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      clearSpeechError();
      baseInputBeforeVoiceRef.current = inputText;
      startListening({
        continuous: true,
        interimResults: true,
        lang: 'en-US',
        onResult: (spokenText) => {
          const prefix = baseInputBeforeVoiceRef.current.trim();
          if (prefix) {
            setInputText(`${prefix} ${spokenText}`);
          } else {
            setInputText(spokenText);
          }
        },
      });
    }
  };

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
    if (isListening) {
      stopListening();
    }
    addMessage(inputText);
    setInputText('');
    baseInputBeforeVoiceRef.current = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const personaContent = STARTER_INQUIRIES[activeVault.id] || STARTER_INQUIRIES['vault-kalam'];

  return (
    <div className="w-full h-screen flex bg-evoke-bg text-evoke-text-primary overflow-hidden relative transition-colors duration-300">
      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#C5A880]/8 via-transparent to-transparent pointer-events-none" />

      {/* Entrance Notification Banner */}
      <AnimatePresence>
        {showEntranceNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="absolute top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-full bg-evoke-surface/90 border border-evoke-border/80 text-xs text-evoke-text-primary font-medium backdrop-blur-md shadow-lg flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-[#4ECCA3] shadow-[0_0_8px_#4ECCA3]" />
            <span>Connected: {activeVault.name}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEFT SIDEBAR: GRACEFUL, REFINED & UNCLUTTERED */}
      <aside className="hidden lg:flex w-72 shrink-0 border-r border-evoke-border bg-evoke-surface/60 backdrop-blur-md p-5 flex-col justify-between z-20 overflow-y-auto">
        <div className="space-y-6">
          {/* Top Actions: Back to Vault & New Session */}
          <div className="flex items-center justify-between pb-1 border-b border-evoke-border/50">
            <Link
              href="/vault"
              className="inline-flex items-center gap-1.5 text-xs text-evoke-text-secondary hover:text-evoke-text-primary transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Vault</span>
            </Link>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={clearMessages}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-evoke-text-muted hover:text-evoke-text-primary transition-colors"
                title="Clear current dialogue and start fresh"
              >
                <RotateCcw className="w-3 h-3" />
                <span>New Dialogue</span>
              </button>
            )}
          </div>

          {/* Persona Selection */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-evoke-text-muted">
              Select Personality
            </span>

            <div className="space-y-2">
              {vaults.map((vault) => {
                const isSelected = vault.id === activeVault.id;
                return (
                  <button
                    key={vault.id}
                    type="button"
                    onClick={() => setActiveVaultId(vault.id)}
                    className={`w-full text-left p-3 rounded-[12px] transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#C5A880]/10 border-[#C5A880]/50 shadow-sm shadow-[#C5A880]/5'
                        : 'bg-evoke-card/40 border-evoke-border/50 hover:bg-evoke-card hover:border-evoke-border'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                          isSelected
                            ? 'bg-[#C5A880]/20 border-[#C5A880]/60 text-[#C5A880]'
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
                          {vault.id.includes('kalam') ? '11th President of India' : '44th President of US'}
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#C5A880] shadow-[0_0_6px_#C5A880] shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Personality Cognitive Essence */}
          <div className="p-3.5 rounded-[12px] bg-evoke-card/50 border border-evoke-border/70 space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-evoke-text-muted">
                Core Disposition
              </span>
              <p className="text-xs text-evoke-text-primary font-medium">
                {activeVault.adviceTone.tone}
              </p>
            </div>

            <div className="pt-2 border-t border-evoke-border/40 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-evoke-text-muted">
                Humor Style
              </span>
              <p className="text-xs text-evoke-text-secondary">
                {activeVault.humorStyle.style}
              </p>
            </div>

            <div className="pt-2 border-t border-evoke-border/40 flex items-center justify-between text-[11px] font-mono">
              <span className="text-evoke-text-muted">Archival Provenance</span>
              <span className="text-[#4ECCA3] font-semibold">{activeVault.completenessScore}% Documented</span>
            </div>
          </div>
        </div>

        {/* Bottom Audit & Invariant Info */}
        <div className="pt-4 border-t border-evoke-border/60 space-y-2">
          <button
            onClick={() => setIsAuditOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] bg-evoke-card/60 border border-evoke-border hover:border-[#4ECCA3]/50 text-xs text-evoke-text-secondary hover:text-evoke-text-primary transition-all group"
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
        {/* Top App Header */}
        <header className="px-6 py-3.5 border-b border-evoke-border bg-evoke-surface/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#C5A880]/15 border border-[#C5A880]/30 flex items-center justify-center">
              <User className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div>
              <h2 className="font-syne font-bold text-sm text-evoke-text-primary leading-none">
                {activeVault.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ECCA3] animate-pulse" />
                <span className="text-[10px] text-evoke-text-muted font-mono">Archival Presence Active</span>
              </div>
            </div>
          </div>

          {/* Top Right Controls: Theme Toggle */}
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
        </header>

        {/* Scrollable Conversation Stream */}
        <div className="flex-grow overflow-y-auto px-6 md:px-16 py-8 space-y-6">
          {messages.length === 0 ? (
            /* GRACEFUL, POETIC EMPTY STATE */
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto py-10">
              {/* Dignified Avatar Halo */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-[#C5A880]/20 to-transparent border border-[#C5A880]/40 flex items-center justify-center shadow-lg shadow-[#C5A880]/10">
                  <User className="w-8 h-8 text-[#C5A880]" />
                </div>
              </div>

              {/* Title & Role */}
              <h2 className="font-syne text-2xl sm:text-3xl font-bold text-evoke-text-primary tracking-tight mb-1">
                {activeVault.name}
              </h2>
              <p className="text-xs font-mono text-[#C5A880] tracking-wide mb-6">
                {activeVault.relationship}
              </p>

              {/* Poetic Quotation Card */}
              <blockquote className="max-w-lg mb-8 px-6 py-4 rounded-[14px] bg-evoke-card/40 border border-evoke-border/60 backdrop-blur-sm">
                <p className="text-sm italic text-evoke-text-secondary font-light leading-relaxed mb-2">
                  "{personaContent.quote}"
                </p>
                <cite className="text-[10px] font-mono text-evoke-text-muted not-italic block uppercase tracking-wider">
                  — {personaContent.quoteSource}
                </cite>
              </blockquote>

              {/* 3 Graceful Conversational Starters */}
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                {personaContent.starters.map((starter, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (isGeneratingEcho) return;
                      addMessage(starter.prompt);
                    }}
                    className="p-4 rounded-[12px] bg-evoke-card/60 border border-evoke-border/80 hover:border-[#C5A880]/60 hover:bg-evoke-card text-left transition-all group flex flex-col justify-between shadow-xs hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-syne font-bold text-xs text-evoke-text-primary group-hover:text-[#C5A880] transition-colors">
                        {starter.title}
                      </span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-evoke-text-muted group-hover:text-[#C5A880] transition-colors" />
                    </div>
                    <p className="text-[11px] text-evoke-text-secondary font-light leading-relaxed italic">
                      "{starter.prompt}"
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <React.Fragment key={msg.id}>
                <MessageBubble
                  message={msg}
                  echoName={activeVault.name.includes('Kalam') ? 'Dr. Kalam' : activeVault.name.includes('Obama') ? 'Barack Obama' : activeVault.name}
                />
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
              <span>Reflecting through {activeVault.name}'s verified archives...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* FIXED BOTTOM INPUT AREA */}
        <div className="p-4 md:px-16 bg-evoke-bg/95 backdrop-blur-md border-t border-evoke-border">
          <form onSubmit={handleSend} className="max-w-3xl mx-auto flex flex-col gap-2">
            {/* Live Listening Waveform Banner */}
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: 5 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between px-3.5 py-2 rounded-[10px] bg-[#C5A880]/15 border border-[#C5A880]/40 text-xs text-[#C5A880] mb-1 backdrop-blur-md shadow-[0_0_15px_rgba(197,168,128,0.15)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 h-4">
                      <span className="w-1 bg-[#C5A880] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-2" />
                      <span className="w-1 bg-[#C5A880] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.15s] h-4" />
                      <span className="w-1 bg-[#C5A880] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.3s] h-2.5" />
                      <span className="w-1 bg-[#C5A880] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.45s] h-3.5" />
                      <span className="w-1 bg-[#C5A880] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.2s] h-2" />
                    </div>
                    <span className="font-medium tracking-wide">
                      {isSpeaking ? "Capturing your speech..." : `Listening... Speak naturally to ${activeVault.name.includes('Kalam') ? 'Dr. Kalam' : activeVault.name.includes('Obama') ? 'Barack Obama' : activeVault.name}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      className="text-[11px] font-medium text-[#C5A880] hover:text-white bg-[#C5A880]/20 hover:bg-[#C5A880]/30 px-2.5 py-1 rounded-[6px] transition-all"
                    >
                      Done Speaking
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Notification Banner */}
            <AnimatePresence>
              {speechError && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="flex items-center justify-between px-3 py-2 rounded-[8px] bg-red-500/10 border border-red-500/30 text-xs text-red-400 mb-1 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{speechError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearSpeechError}
                    className="text-xs text-red-400 hover:text-white ml-3 font-bold"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`relative flex items-center bg-evoke-surface border rounded-[12px] transition-all p-2.5 shadow-sm ${
              isListening 
                ? "border-[#C5A880] ring-1 ring-[#C5A880]/40 shadow-[0_0_15px_rgba(197,168,128,0.15)]" 
                : "border-evoke-border focus-within:border-[#C5A880] focus-within:ring-1 focus-within:ring-[#C5A880]/30"
            }`}>
              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  baseInputBeforeVoiceRef.current = e.target.value;
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? "Listening to your voice in real time... (Speak now)"
                    : `Ask ${activeVault.name.includes('Kalam') ? 'Dr. Kalam' : activeVault.name.includes('Obama') ? 'Barack Obama' : activeVault.name} about philosophy, leadership, or decisions...`
                }
                rows={2}
                className="w-full bg-transparent text-sm text-evoke-text-primary placeholder-evoke-text-muted focus:outline-none resize-none px-3 py-1.5"
              />

              <div className="flex items-center gap-2 pr-2 shrink-0">
                {/* STT Chrome Microphone Button */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  disabled={isGeneratingEcho}
                  aria-label={isListening ? "Stop listening" : "Speak your message using microphone"}
                  title={
                    !isSpeechSupported
                      ? "Speech recognition requires Google Chrome"
                      : isListening
                      ? "Stop listening"
                      : `Speak to ${activeVault.name.includes('Kalam') ? 'Dr. Kalam' : activeVault.name.includes('Obama') ? 'Barack Obama' : activeVault.name}`
                  }
                  className={`relative p-2.5 rounded-[10px] transition-all duration-200 flex items-center justify-center select-none ${
                    isListening
                      ? "bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880] shadow-[0_0_12px_rgba(197,168,128,0.4)] active:scale-95"
                      : "bg-transparent text-evoke-text-muted hover:text-[#C5A880] hover:bg-evoke-border/40 border border-transparent active:scale-95"
                  } ${isGeneratingEcho ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {isListening && (
                    <span className="absolute inset-0 rounded-[10px] bg-[#C5A880]/25 animate-ping pointer-events-none" />
                  )}
                  {isListening ? (
                    <Mic className="w-4 h-4 text-[#C5A880] animate-pulse" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>

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
              <span>Persona Profile: {activeVault.name}</span>
              <div className="flex items-center gap-3">
                {isSpeechSupported && (
                  <span className="text-[#4ECCA3]/90 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ECCA3]" />
                    Chrome STT Active
                  </span>
                )}
                <span>Epistemic Humility Gate τ = 0.70</span>
              </div>
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
