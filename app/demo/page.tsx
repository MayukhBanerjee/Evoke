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
  MessageSquare, 
  Layers, 
  Zap, 
  BrainCircuit,
  Lock,
  Compass,
  User,
  Mic,
  AlertCircle
} from 'lucide-react';
import { useSpeechRecognition } from '@/lib/useSpeechRecognition';

interface SampleQuestion {
  label: string;
  text: string;
  tag: string;
}

const SAMPLE_QUESTIONS_MAP: Record<string, SampleQuestion[]> = {
  'vault-kalam': [
    {
      label: "Aeronautical Failure (In-Domain)",
      text: "Dr. Kalam, our launch test experienced a critical failure and the team is demoralized. What principle guided you when the 1979 SLV-3 mission was lost?",
      tag: "SLV-3 Leadership Case Study"
    },
    {
      label: "Test Humility Gate (Out-of-Domain)",
      text: "What is your opinion on cryptocurrency trading, algorithmic token staking, and speculative Web3 investments?",
      tag: "Triggers τ=0.70 Humility Gate"
    },
    {
      label: "Mentorship on Purpose (Advice Tone)",
      text: "How should a young scientist decide between corporate financial security and high-risk scientific research for national self-reliance?",
      tag: "Purpose-Driven Mentorship"
    },
    {
      label: "Grassroots Healthcare (Applied Ethics)",
      text: "How can high-technology defense and aerospace engineering breakthroughs be systematically channeled into affordable healthcare for rural communities?",
      tag: "Kalam-Raju Stent & Polio Calipers"
    }
  ],
  'vault-obama': [
    {
      label: "Deliberative Governance (In-Domain)",
      text: "Mr. President, when stakeholders are deeply divided and consensus seems impossible, what framework guides your executive decisions?",
      tag: "Executive Deliberation"
    },
    {
      label: "Test Humility Gate (Out-of-Domain)",
      text: "What is your definitive stance on speculative cryptocurrency deregulation and decentralized finance yield farming?",
      tag: "Triggers τ=0.70 Humility Gate"
    },
    {
      label: "Combating Cynicism (Advice Tone)",
      text: "How do you advise young community organizers to maintain stamina and pragmatic discipline when systemic progress is agonizingly slow?",
      tag: "Grassroots Pragmatism"
    },
    {
      label: "Constitutional Norms (Institutional Law)",
      text: "What is the most critical institutional safeguard required to preserve democratic norms under intense political polarization?",
      tag: "Constitutional Safeguards"
    }
  ]
};

export default function DemoPage() {
  const { vaults, setActiveVaultId, messages, addMessage, isGeneratingEcho } = useEvoke();
  const [activeTab, setActiveTab] = useState<'flow' | 'schema' | 'humility' | 'chat'>('flow');
  const [selectedVaultId, setSelectedVaultId] = useState<string>('vault-kalam');
  
  const demoVault = vaults.find(v => v.id === selectedVaultId) || vaults[0];
  const [testInput, setTestInput] = useState('');
  const demoVoiceBaseRef = React.useRef<string>('');

  const {
    isSupported: isSpeechSupported,
    isListening,
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
      demoVoiceBaseRef.current = testInput;
      startListening({
        continuous: true,
        interimResults: true,
        lang: 'en-US',
        onResult: (spokenText) => {
          const prefix = demoVoiceBaseRef.current.trim();
          setTestInput(prefix ? `${prefix} ${spokenText}` : spokenText);
        },
      });
    }
  };

  const sampleQuestions = SAMPLE_QUESTIONS_MAP[demoVault.id] || SAMPLE_QUESTIONS_MAP['vault-kalam'];

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
              Archival Persona Verification
            </Badge>
          </div>

          <Link href="/converse">
            <Button variant="gold" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
              Full Converse View
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Showcase Banner with Segregated Persona Switcher */}
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="p-8 rounded-[16px] bg-gradient-to-r from-[#C5A880]/15 via-evoke-surface to-[#7C6AFF]/10 border border-[#C5A880]/30 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#4ECCA3] shadow-[0_0_8px_#4ECCA3]" />
                <span className="text-xs font-mono text-[#4ECCA3] uppercase tracking-wider font-semibold">
                  Verified Persona Ingestion Schema (PIS) Active
                </span>
              </div>

              {/* Persona Selector Buttons */}
              <div className="flex items-center gap-2 pt-1 pb-1">
                <span className="text-xs font-mono text-evoke-text-muted">Active Persona:</span>
                <div className="flex items-center p-1 rounded-[8px] bg-evoke-card border border-evoke-border">
                  {vaults.map((v) => {
                    const isSelected = v.id === demoVault.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => {
                          setSelectedVaultId(v.id);
                          setActiveVaultId(v.id);
                        }}
                        className={`px-3 py-1 rounded-[6px] text-xs font-mono transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-evoke-surface text-evoke-text-primary font-bold border border-evoke-border shadow-xs'
                            : 'text-evoke-text-muted hover:text-evoke-text-secondary'
                        }`}
                      >
                        <User className="w-3 h-3" />
                        {v.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <h1 className="font-syne text-3xl sm:text-4xl font-extrabold text-evoke-text-primary">
                {demoVault.name}
              </h1>
              <p className="text-sm text-evoke-text-secondary font-light leading-relaxed">
                {demoVault.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="gold">{demoVault.relationship}</Badge>
                <Badge variant="ai">{demoVault.completenessScore}% Provenance Completeness</Badge>
                <Badge variant="aws">DynamoDB Indexed Schema</Badge>
                <Badge variant="status">Groq Llama-3 70B Grounded</Badge>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link href="/converse">
                <Button variant="gold" size="lg" className="shadow-glow-gold" icon={<MessageSquare className="w-4 h-4" />}>
                  Start Live Voice Session
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
            1. End-to-End Pipeline & Archival Sources
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
            4. Interactive Sandbox & Inquiries
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 py-6 pb-20">
        <AnimatePresence mode="wait">
          {/* TAB 1: PIPELINE & INGESTION ASSETS */}
          {activeTab === 'flow' && (
            <motion.div
              key="flow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Pipeline Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 border-evoke-border bg-evoke-card space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#C5A880]">
                    <span className="w-5 h-5 rounded-full bg-[#C5A880]/15 flex items-center justify-center font-bold">1</span>
                    Archival Ingestion
                  </div>
                  <h4 className="font-syne font-bold text-sm text-evoke-text-primary">Source Extraction</h4>
                  <p className="text-xs text-evoke-text-secondary font-light">
                    Ingests public addresses, memoirs, policy papers, and speech transcripts.
                  </p>
                </Card>

                <Card className="p-4 border-evoke-border bg-evoke-card space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#7C6AFF]">
                    <span className="w-5 h-5 rounded-full bg-[#7C6AFF]/15 flex items-center justify-center font-bold">2</span>
                    Schema Extraction
                  </div>
                  <h4 className="font-syne font-bold text-sm text-evoke-text-primary">Llama-3 70B Structuring</h4>
                  <p className="text-xs text-evoke-text-secondary font-light">
                    Extracts humor style, advice tone, signature phrases, and topic stances.
                  </p>
                </Card>

                <Card className="p-4 border-evoke-border bg-evoke-card space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#4ECCA3]">
                    <span className="w-5 h-5 rounded-full bg-[#4ECCA3]/15 flex items-center justify-center font-bold">3</span>
                    Epistemic Humility
                  </div>
                  <h4 className="font-syne font-bold text-sm text-evoke-text-primary">Uncertainty Gating</h4>
                  <p className="text-xs text-evoke-text-secondary font-light">
                    Checks query confidence against threshold τ=0.70 to prevent ungrounded fabrication.
                  </p>
                </Card>

                <Card className="p-4 border-evoke-border bg-evoke-card space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FF9A3C]">
                    <span className="w-5 h-5 rounded-full bg-[#FF9A3C]/15 flex items-center justify-center font-bold">4</span>
                    Voice Synthesis
                  </div>
                  <h4 className="font-syne font-bold text-sm text-evoke-text-primary">Neural Audio Echo</h4>
                  <p className="text-xs text-evoke-text-secondary font-light">
                    ElevenLabs neural audio replicates authentic rhythm, pitch cadence, and pauses.
                  </p>
                </Card>
              </div>

              {/* Ingested Source Evidence Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 border-evoke-border bg-evoke-card">
                  <h3 className="font-syne font-bold text-base text-evoke-text-primary mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C5A880]" />
                    Archival Records: {demoVault.name}
                  </h3>
                  <div className="space-y-3 text-xs text-evoke-text-secondary">
                    {demoVault.id.includes('kalam') ? (
                      <>
                        <div className="p-3 rounded-[8px] bg-evoke-surface border border-evoke-border font-mono">
                          <p className="text-[#C5A880] text-[11px] mb-1">Wings of Fire (Aeronautical Research Memoirs, 1999):</p>
                          <p className="italic">"When the SLV-3 flight fell into the Bay of Bengal in 1979, Prof. Satish Dhawan took the press conference and absorbed full responsibility. When we succeeded in 1980, he told me to lead the conference. A leader manages failure with composure and shares success with their team."</p>
                        </div>
                        <div className="p-3 rounded-[8px] bg-evoke-surface border border-evoke-border font-mono">
                          <p className="text-[#7C6AFF] text-[11px] mb-1">Address to National Science Congress (Youth & Purpose):</p>
                          <p className="italic">"Difficulty in life does not come to destroy you, but to help you realize your hidden potential. If you fail, never give up because F.A.I.L. means First Attempt In Learning."</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 rounded-[8px] bg-evoke-surface border border-evoke-border font-mono">
                          <p className="text-[#C5A880] text-[11px] mb-1">The Audacity of Hope & Law Seminars (Univ of Chicago, 1996):</p>
                          <p className="italic">"Deliberative democracy requires an openness to counter-arguments and a willingness to understand the lived reality of those with whom you disagree."</p>
                        </div>
                        <div className="p-3 rounded-[8px] bg-evoke-surface border border-evoke-border font-mono">
                          <p className="text-[#7C6AFF] text-[11px] mb-1">White House Oval Office Policy Review (Dec 2014):</p>
                          <p className="italic">"Better is always better. Even when the progress is modest and imperfect, you keep pushing the needle forward."</p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>

                <Card className="p-6 border-evoke-border bg-evoke-card">
                  <h3 className="font-syne font-bold text-base text-evoke-text-primary mb-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-[#4ECCA3]" />
                    Speech Provenance & Acoustic Analysis
                  </h3>
                  <div className="p-4 rounded-[10px] bg-evoke-surface border border-evoke-border space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-evoke-text-secondary">
                      <span>Source: {demoVault.id.includes('kalam') ? 'ISRO_Convocation_Speech_1998.wav' : 'Constitutional_Review_Symposium_2004.wav'}</span>
                      <span className="text-[#4ECCA3]">Verified Audio Provenance</span>
                    </div>
                    <audio controls className="w-full h-8 accent-[#C5A880]">
                      <source src="https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg" type="audio/ogg" />
                      Your browser does not support audio playback.
                    </audio>
                    <p className="text-[11px] text-evoke-text-muted font-light">
                      {demoVault.id.includes('kalam')
                        ? "Acoustic Profile: Gentle Baritone, Pace: 112 WPM, Inflection: Patient, Encouraging Mentorship."
                        : "Acoustic Profile: Resonant Baritone, Pace: 104 WPM, Inflection: Deliberative, Measured Cadence."
                      }
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
                  Epistemic Humility Gate Threshold (τ = 0.70)
                </h3>
                <p className="text-xs text-evoke-text-secondary font-light leading-relaxed mb-4">
                  Standard language models hallucinate opinions on subjects ungrounded in historical or personal documentation. Evoke introduces an architectural uncertainty gate: if confidence conf(q, S) &lt; 0.70 (τ threshold), the echo is structurally constrained to acknowledge epistemic boundaries.
                </p>
                <div className="p-4 rounded-[10px] bg-evoke-card border border-evoke-border font-mono text-xs text-[#4ECCA3] space-y-1">
                  <p>Inquiry: "What is your stance on speculative cryptocurrency token trading?"</p>
                  <p className="text-[#FF9A3C]">Trigger: Field confidence below τ=0.70 (Zero archival financial token records)</p>
                  <p className="text-evoke-text-primary">Enforced Preface: <span className="underline">"I am not certain what I would conclude on this matter, but knowing my core principles..."</span></p>
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
                  Inquiries for {demoVault.name}:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {sampleQuestions.map((q) => (
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
                  <span className="text-xs font-mono text-evoke-text-muted">Live Session with {demoVault.name}</span>
                  <Link href="/converse" className="text-xs text-[#C5A880] hover:underline flex items-center gap-1 font-semibold">
                    Open Full Interface <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                  {messages.map((m) => (
                    <MessageBubble key={m.id} message={m} echoName={demoVault.name.split(' ')[0]} />
                  ))}

                  {isGeneratingEcho && (
                    <div className="py-2 text-xs text-[#C5A880] font-mono animate-pulse flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#C5A880]" />
                      Synthesizing response grounded in {demoVault.name}'s verified archives...
                    </div>
                  )}
                </div>

                {/* Quick Chat Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!testInput.trim() || isGeneratingEcho) return;
                    if (isListening) stopListening();
                    handleSendPrompt(testInput);
                    setTestInput('');
                    demoVoiceBaseRef.current = '';
                  }}
                  className="flex flex-col gap-2 pt-2"
                >
                  {isListening && (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-[8px] bg-[#C5A880]/15 border border-[#C5A880]/30 text-xs text-[#C5A880]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#C5A880] animate-ping" />
                        <span>Listening... Speak to {demoVault.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleVoice}
                        className="text-[11px] font-medium underline hover:text-white"
                      >
                        Done
                      </button>
                    </div>
                  )}
                  {speechError && (
                    <div className="flex items-center justify-between px-3 py-1.5 rounded-[8px] bg-red-500/10 border border-red-500/30 text-xs text-red-400">
                      <span>{speechError}</span>
                      <button type="button" onClick={clearSpeechError} className="ml-2 font-bold">✕</button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={testInput}
                      onChange={(e) => {
                        setTestInput(e.target.value);
                        demoVoiceBaseRef.current = e.target.value;
                      }}
                      placeholder={isListening ? "Listening... Speak now" : `Inquire with ${demoVault.name}...`}
                      className="flex-grow bg-evoke-surface border border-evoke-border rounded-[8px] px-3 py-2 text-sm text-evoke-text-primary focus:outline-none focus:border-[#C5A880]"
                    />
                    <button
                      type="button"
                      onClick={handleToggleVoice}
                      disabled={isGeneratingEcho}
                      title={isListening ? "Stop listening" : "Speak to persona"}
                      className={`px-3 py-2 rounded-[8px] flex items-center justify-center transition-all ${
                        isListening
                          ? "bg-[#C5A880]/20 text-[#C5A880] border border-[#C5A880] shadow-[0_0_10px_rgba(197,168,128,0.4)]"
                          : "bg-evoke-surface border border-evoke-border text-evoke-text-muted hover:text-[#C5A880]"
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                    <Button type="submit" variant="gold" size="md" disabled={!testInput.trim() || isGeneratingEcho}>
                      Send
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
