"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvoke } from '@/lib/store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MessageBubble } from '@/components/converse/MessageBubble';
import { 
  Sparkles, 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  FileText, 
  CheckCircle2, 
  Shield, 
  Cpu, 
  MessageSquare, 
  Layers, 
  Zap, 
  BrainCircuit,
  Lock,
  Compass
} from 'lucide-react';

export default function DemoPage() {
  const { vaults, setActiveVaultId, messages, addMessage, isGeneratingEcho } = useEvoke();
  const [activeTab, setActiveTab] = useState<'flow' | 'schema' | 'humility' | 'chat'>('flow');
  
  // Set to demo vault (Rajesh Banerjee)
  const demoVault = vaults.find(v => v.id === 'vault-1') || vaults[0];

  const [testInput, setTestInput] = useState('');

  const SAMPLE_QUESTIONS = [
    {
      label: "Career Mastery (In-Domain)",
      text: "Dad, I got the offer for the lead engineering role today. I wish I could tell you in person.",
      tag: "In-Domain Signature Match"
    },
    {
      label: "Test Humility Gate (Out-of-Domain)",
      text: "What do you think about cryptocurrency, Web3, and NFT trading?",
      tag: "Triggers τ=0.70 Humility Gate"
    },
    {
      label: "Dealing with Failure (Advice Tone)",
      text: "I made a huge mistake on a project and let the whole team down. What do I do?",
      tag: "Pragmatic Tough Love"
    },
    {
      label: "Nostalgia & Chai (Relational)",
      text: "I really miss sitting with you on Sunday mornings having hot chai.",
      tag: "Warm Relational Tone"
    }
  ];

  const handleSendPrompt = (promptText: string) => {
    setActiveVaultId(demoVault.id);
    addMessage(promptText);
  };

  return (
    <main className="min-h-screen bg-evoke-bg text-evoke-text-primary transition-colors duration-300">
      {/* Top Header */}
      <header className="border-b border-evoke-border bg-evoke-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-evoke-text-secondary hover:text-evoke-text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="font-syne font-extrabold text-lg text-evoke-text-primary">
              Evoke Showcase
            </span>
            <Badge variant="gold" className="text-[10px] uppercase font-mono">
              Live Interactive Persona
            </Badge>
          </div>

          <Link href="/converse">
            <Button variant="gold" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Full Converse View
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Showcase Banner */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="p-8 rounded-[16px] bg-gradient-to-r from-[#C5A880]/15 via-evoke-surface to-[#7C6AFF]/10 border border-[#C5A880]/30 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ECCA3] shadow-[0_0_8px_#4ECCA3]" />
                <span className="text-xs font-mono text-[#4ECCA3] uppercase tracking-wider font-semibold">
                  Verified Persona Ingestion Schema (PIS) Active
                </span>
              </div>
              <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-evoke-text-primary">
                Demo Profile: {demoVault.name}
              </h1>
              <p className="text-sm text-evoke-text-secondary font-light leading-relaxed">
                {demoVault.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Badge variant="gold">{demoVault.relationship}</Badge>
                <Badge variant="ai">94% Completeness Score</Badge>
                <Badge variant="aws">DynamoDB Indexed (9.4ms p95)</Badge>
                <Badge variant="status">Groq Llama-3 70B Active</Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link href="/converse">
                <Button variant="gold" size="lg" className="shadow-glow-gold" icon={<MessageSquare className="w-4 h-4" />}>
                  Start Live Voice Echo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Phase Navigation Tabs */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 border-b border-evoke-border pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'flow'
                ? 'bg-evoke-card border border-evoke-border text-evoke-text-primary shadow-sm'
                : 'text-evoke-text-secondary hover:text-evoke-text-primary'
            }`}
          >
            <Layers className="w-4 h-4 text-[#C5A880]" />
            1. End-to-End Concept & Pipeline
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'schema'
                ? 'bg-evoke-card border border-evoke-border text-evoke-text-primary shadow-sm'
                : 'text-evoke-text-secondary hover:text-evoke-text-primary'
            }`}
          >
            <BrainCircuit className="w-4 h-4 text-[#7C6AFF]" />
            2. Structured PIS Schema S(p)
          </button>

          <button
            onClick={() => setActiveTab('humility')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'humility'
                ? 'bg-evoke-card border border-evoke-border text-evoke-text-primary shadow-sm'
                : 'text-evoke-text-secondary hover:text-evoke-text-primary'
            }`}
          >
            <Shield className="w-4 h-4 text-[#4ECCA3]" />
            3. Humility Gate (τ=0.70) & Invariants
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-evoke-card border border-evoke-border text-[#C5A880] shadow-sm'
                : 'text-evoke-text-secondary hover:text-evoke-text-primary'
            }`}
          >
            <Zap className="w-4 h-4 text-[#FF9A3C]" />
            4. Interactive Sandbox & Prompt Tests
          </button>
        </div>
      </section>

      {/* TAB CONTENT AREA */}
      <section className="max-w-7xl mx-auto px-6 py-6 pb-20">
        <AnimatePresence mode="wait">
          {/* TAB 1: END TO END PIPELINE */}
          {activeTab === 'flow' && (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Step 1 */}
                <Card className="p-6 border-evoke-border bg-evoke-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#C5A880] font-bold uppercase">Phase 1: Ingestion</span>
                    <h3 className="font-syne font-bold text-base text-evoke-text-primary mt-1 mb-2">
                      Multi-Modal Ingestion
                    </h3>
                    <p className="text-xs text-evoke-text-secondary font-light leading-relaxed">
                      Captures 60s voice note, WhatsApp chat export, and 6 structured relational prompts under S3 AES-256 encryption.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-evoke-border text-[11px] font-mono text-evoke-text-muted flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-[#C5A880]" /> S3 Event Trigger
                  </div>
                </Card>

                {/* Step 2 */}
                <Card className="p-6 border-evoke-border bg-evoke-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#7C6AFF] font-bold uppercase">Phase 2: Extraction</span>
                    <h3 className="font-syne font-bold text-base text-evoke-text-primary mt-1 mb-2">
                      PIS NLP Pipeline
                    </h3>
                    <p className="text-xs text-evoke-text-secondary font-light leading-relaxed">
                      Transcribe diarizes speaker; Comprehend extracts sentiment and recurring syntactic signatures into DynamoDB.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-evoke-border text-[11px] font-mono text-evoke-text-muted flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-[#7C6AFF]" /> AWS Lambda + NLP
                  </div>
                </Card>

                {/* Step 3 */}
                <Card className="p-6 border-evoke-border bg-evoke-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#4ECCA3] font-bold uppercase">Phase 3: Conditioning</span>
                    <h3 className="font-syne font-bold text-base text-evoke-text-primary mt-1 mb-2">
                      Humility Gated LLM
                    </h3>
                    <p className="text-xs text-evoke-text-secondary font-light leading-relaxed">
                      Queries retrieve behavioral traits in &lt;10ms. Groq Llama-3 70B infers response with τ=0.70 value-drift suppression.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-evoke-border text-[11px] font-mono text-evoke-text-muted flex items-center gap-1">
                    <BrainCircuit className="w-3.5 h-3.5 text-[#4ECCA3]" /> Groq &lt;800ms TTFT
                  </div>
                </Card>

                {/* Step 4 */}
                <Card className="p-6 border-evoke-border bg-evoke-card flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#FF9A3C] font-bold uppercase">Phase 4: Synthesis</span>
                    <h3 className="font-syne font-bold text-base text-evoke-text-primary mt-1 mb-2">
                      Acoustic Echo
                    </h3>
                    <p className="text-xs text-evoke-text-secondary font-light leading-relaxed">
                      ElevenLabs renders the response in the cloned voice; Web Audio API visualizes audio frequencies dynamically.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-evoke-border text-[11px] font-mono text-evoke-text-muted flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#FF9A3C]" /> Cloned Voice + Waveform
                  </div>
                </Card>
              </div>

              {/* Ingested Source Evidence Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 border-evoke-border bg-evoke-card">
                  <h3 className="font-syne font-bold text-base text-evoke-text-primary mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C5A880]" />
                    Raw Ingestion Assets: Rajesh's Archive
                  </h3>
                  <div className="space-y-3 text-xs text-evoke-text-secondary">
                    <div className="p-3 rounded-[8px] bg-evoke-surface border border-evoke-border font-mono">
                      <p className="text-[#C5A880] text-[11px] mb-1">WhatsApp Export Excerpt (2021-08-14):</p>
                      <p className="italic">"Did you measure twice before you cut once? Call me after dinner, let's grab a hot chai and fix the engineering drawing."</p>
                    </div>
                    <div className="p-3 rounded-[8px] bg-evoke-surface border border-evoke-border font-mono">
                      <p className="text-[#7C6AFF] text-[11px] mb-1">Relational Prompt #2 (Bad Decisions):</p>
                      <p className="italic">"He never shouted. He'd pull up a chair, chuckle quietly, and say life doesn't hand out refunds so let's calculate the next step."</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-evoke-border bg-evoke-card">
                  <h3 className="font-syne font-bold text-base text-evoke-text-primary mb-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#4ECCA3]" />
                    Cloned Voice Sample & Acoustic Provenance
                  </h3>
                  <div className="p-4 rounded-[10px] bg-evoke-surface border border-evoke-border space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-evoke-text-secondary">
                      <span>Source: Sunday_Chai_Recording.mp3</span>
                      <span className="text-[#4ECCA3]">60.4s Diarized</span>
                    </div>
                    <audio controls className="w-full h-8 accent-[#C5A880]">
                      <source src="https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg" type="audio/ogg" />
                      Your browser does not support audio playback.
                    </audio>
                    <p className="text-[11px] text-evoke-text-muted font-light">
                      ElevenLabs Model: Neural Voice Clone (Pitch: Warm Baritone, Pace: 104 WPM, Emotional Inflection: Reassuring).
                    </p>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* TAB 2: STRUCTURED PIS SCHEMA */}
          {activeTab === 'schema' && (
            <motion.div
              key="schema"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Behavioral Stance Matrix */}
                <Card className="p-6 border-evoke-border bg-evoke-card">
                  <h3 className="font-syne font-bold text-base text-evoke-text-primary mb-4 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#7C6AFF]" />
                    Topic Stance Matrix & Intensity Ratings
                  </h3>
                  <div className="space-y-4">
                    {demoVault.topicOpinions.map((op) => (
                      <div key={op.topic} className="p-3 rounded-[8px] bg-evoke-surface border border-evoke-border space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-evoke-text-primary">{op.topic}</span>
                          <span className="text-[10px] font-mono text-[#C5A880]">Intensity: {op.intensity}/100</span>
                        </div>
                        <p className="text-xs text-evoke-text-secondary italic">"{op.stance}"</p>
                        <p className="text-[11px] text-evoke-text-muted font-light">{op.detail}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Signature Phrases */}
                <Card className="p-6 border-evoke-border bg-evoke-card">
                  <h3 className="font-syne font-bold text-base text-evoke-text-primary mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C5A880]" />
                    Extracted Signature Phrases & Provenance
                  </h3>
                  <div className="space-y-3">
                    {demoVault.signaturePhrases.map((phrase) => (
                      <div key={phrase.id} className="p-3 rounded-[8px] bg-evoke-surface border border-evoke-border space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#C5A880] font-mono">"{phrase.phrase}"</span>
                          <Badge variant="ai" className="text-[9px] px-2 py-0.5">{phrase.confidence}% Conf</Badge>
                        </div>
                        <p className="text-[11px] text-evoke-text-muted font-light">{phrase.context}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {/* TAB 3: HUMILITY GATE & INVARIANTS */}
          {activeTab === 'humility' && (
            <motion.div
              key="humility"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-[14px] bg-evoke-surface border border-[#4ECCA3]/40">
                <h3 className="font-syne font-bold text-lg text-evoke-text-primary mb-2 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#4ECCA3]" />
                  Epistemic Humility Gate Threshold ($\tau = 0.70$)
                </h3>
                <p className="text-xs text-evoke-text-secondary font-light leading-relaxed mb-4">
                  Standard griefbots hallucinate opinions on topics the deceased never encountered (called <em>Value Drift</em>). Evoke introduces an architectural uncertainty gate: if confidence conf(q, S) &lt; 0.70 (&tau; threshold), the model is forced to acknowledge uncertainty.
                </p>
                <div className="p-4 rounded-[10px] bg-evoke-card border border-evoke-border font-mono text-xs text-[#4ECCA3] space-y-1">
                  <p>Input Query: "What is your stance on crypto trading in 2026?"</p>
                  <p className="text-[#FF9A3C]">Trigger: Field confidence below τ=0.70 (No documented financial crypto data)</p>
                  <p className="text-evoke-text-primary">Enforced Preface: <span className="underline">"I'm not sure what I'd think about this, but knowing me, probably..."</span></p>
                </div>
              </div>

              {/* 4 Invariants Table */}
              <Card className="p-6 border-evoke-border bg-evoke-card">
                <h4 className="font-syne font-bold text-base text-evoke-text-primary mb-3">
                  4 Consent Invariants Enforced by Architecture
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-[10px] bg-evoke-surface border border-evoke-border space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-evoke-text-primary">
                      <Lock className="w-4 h-4 text-[#7C6AFF]" /> I1: Role Separation
                    </div>
                    <p className="text-[11px] text-evoke-text-secondary font-light">Enforced via Amazon Cognito role pools. Zero bypass path in service graph.</p>
                  </div>

                  <div className="p-3.5 rounded-[10px] bg-evoke-surface border border-evoke-border space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-evoke-text-primary">
                      <CheckCircle2 className="w-4 h-4 text-[#4ECCA3]" /> I2: Subject-Defined Expiry (λ)
                    </div>
                    <p className="text-[11px] text-evoke-text-secondary font-light">DynamoDB native TTL automatically deletes persona records on expiration.</p>
                  </div>

                  <div className="p-3.5 rounded-[10px] bg-evoke-surface border border-evoke-border space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-evoke-text-primary">
                      <BrainCircuit className="w-4 h-4 text-[#C5A880]" /> I3: Primary Authorship & Humility
                    </div>
                    <p className="text-[11px] text-evoke-text-secondary font-light">Living person approves core stances; low-confidence queries route to humility.</p>
                  </div>

                  <div className="p-3.5 rounded-[10px] bg-evoke-surface border border-evoke-border space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-evoke-text-primary">
                      <FileText className="w-4 h-4 text-[#FF9A3C]" /> I4: Tamper-Evident Auditability
                    </div>
                    <p className="text-[11px] text-evoke-text-secondary font-light">CloudWatch immutable audit trails log all access and retrieval queries.</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* TAB 4: INTERACTIVE SANDBOX */}
          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Quick Click Prompt Buttons */}
              <div className="p-6 rounded-[14px] bg-evoke-surface border border-evoke-border space-y-3">
                <h3 className="font-syne font-bold text-sm text-evoke-text-primary flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#FF9A3C]" />
                  Click to Test Rajesh's Echo Live:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {SAMPLE_QUESTIONS.map((q) => (
                    <button
                      key={q.label}
                      onClick={() => handleSendPrompt(q.text)}
                      className="p-3 rounded-[10px] bg-evoke-card border border-evoke-border hover:border-[#C5A880] text-left transition-colors group flex flex-col gap-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-evoke-text-primary group-hover:text-[#C5A880]">
                          {q.label}
                        </span>
                        <Badge variant="gold" className="text-[9px] px-1.5 py-0.5">{q.tag}</Badge>
                      </div>
                      <p className="text-[11px] text-evoke-text-secondary font-light italic">
                        "{q.text}"
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Embedded Live Conversation Stream */}
              <Card className="p-6 border-evoke-border bg-evoke-card space-y-4">
                <div className="flex items-center justify-between border-b border-evoke-border pb-3">
                  <span className="text-xs font-mono text-evoke-text-muted">Live Conversation Stream with {demoVault.name}'s Echo</span>
                  <Link href="/converse" className="text-xs text-[#C5A880] hover:underline flex items-center gap-1 font-semibold">
                    Open Full-Screen <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                  {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} echoName={demoVault.name.split(' ')[0]} />
                  ))}

                  {isGeneratingEcho && (
                    <div className="py-2 text-xs text-[#C5A880] font-mono animate-pulse flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                      Synthesizing response via Groq Llama-3 70B & ElevenLabs...
                    </div>
                  )}
                </div>

                {/* Quick Chat Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!testInput.trim() || isGeneratingEcho) return;
                    handleSendPrompt(testInput);
                    setTestInput('');
                  }}
                  className="flex gap-2 pt-2"
                >
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder={`Ask ${demoVault.name.split(' ')[0]} something...`}
                    className="flex-grow bg-evoke-surface border border-evoke-border rounded-[8px] px-3 py-2 text-sm text-evoke-text-primary focus:outline-none focus:border-[#C5A880]"
                  />
                  <Button type="submit" variant="gold" size="md" disabled={!testInput.trim() || isGeneratingEcho}>
                    Send
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
