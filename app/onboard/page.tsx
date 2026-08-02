"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvoke } from '@/lib/store';
import { OnboardingState } from '@/lib/types';
import { StepIndicator } from '@/components/onboard/StepIndicator';
import { VoiceUploader } from '@/components/onboard/VoiceUploader';
import { PersonalityPrompts } from '@/components/onboard/PersonalityPrompts';
import { FileUploader } from '@/components/onboard/FileUploader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles, Cpu, Lock } from 'lucide-react';

export default function OnboardPage() {
  const router = useRouter();
  const { createNewVault } = useEvoke();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingState>({
    name: '',
    relationship: '',
    description: '',
    promptResponses: {},
    hasChatExport: false,
    hasLetters: false,
  });

  // Processing stage state for completion screen
  const [processingStage, setProcessingStage] = useState(0); // 0: Transcribing, 1: Extracting, 2: Building, 3: Complete

  useEffect(() => {
    if (step === 5) {
      const timer1 = setTimeout(() => setProcessingStage(1), 1200);
      const timer2 = setTimeout(() => setProcessingStage(2), 2600);
      const timer3 = setTimeout(() => setProcessingStage(3), 4000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [step]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    setStep(2);
  };

  const handleFinishOnboarding = (chatUploaded: boolean, lettersUploaded: boolean) => {
    const updated = {
      ...formData,
      hasChatExport: chatUploaded,
      hasLetters: lettersUploaded
    };
    setFormData(updated);
    createNewVault(updated);
    setStep(5);
  };

  const STAGES = [
    "Transcribing Audio Recordings via AWS Transcribe...",
    "Extracting Humor & Advice Schema via Llama-3...",
    "Building Neural Personality Vault in DynamoDB...",
    "Vault Ready & Cloned Voice Synthesized!"
  ];

  return (
    <main className="min-h-screen bg-[#080810] text-[#F0F0F8] flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Gentle background gradient blur */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#7C6AFF]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between z-10 py-4">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs text-[#9090A8] hover:text-[#F0F0F8] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="flex items-center gap-2">
          <span className="font-syne font-bold text-lg text-[#F0F0F8]">Evoke</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C6AFF]" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#9090A8] font-mono">
          <Lock className="w-3.5 h-3.5 text-[#4ECCA3]" />
          Consent-First Vault
        </div>
      </header>

      {/* Main Form Container */}
      <div className="w-full max-w-2xl mx-auto my-auto z-10 py-8">
        {step < 5 && <StepIndicator currentStep={step} />}

        <AnimatePresence mode="wait">
          {/* STEP 1: Identity */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 border-[#7C6AFF]/30 bg-[#0F0F1A]">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-widest text-[#7C6AFF] font-medium">
                    Step 1 of 4
                  </span>
                  <h2 className="font-syne text-2xl font-bold text-[#F0F0F8] mt-1">
                    Who Are You Preserving?
                  </h2>
                  <p className="text-xs text-[#9090A8] font-light mt-1">
                    Tell us about the person whose wisdom, voice, and essence you are honoring.
                  </p>
                </div>

                <form onSubmit={handleStep1Submit} className="space-y-5">
                  <Input
                    label="Full Name of the Person"
                    placeholder="e.g. Rajesh Banerjee"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />

                  <Input
                    label="Your Relationship to Them"
                    placeholder="e.g. Your Father, Grandmother, Mentor, Best Friend"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    required
                  />

                  <Input
                    label="One Sentence About Who They Were"
                    placeholder="e.g. Structural engineer, chai enthusiast, lover of vintage radios and quiet wisdom."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />

                  <div className="pt-4 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Continue to Voice Setup
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: Voice Upload */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 border-[#7C6AFF]/30 bg-[#0F0F1A]">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-widest text-[#7C6AFF] font-medium">
                    Step 2 of 4
                  </span>
                  <h2 className="font-syne text-2xl font-bold text-[#F0F0F8] mt-1">
                    Upload {formData.name || "Their"}'s Voice
                  </h2>
                  <p className="text-xs text-[#9090A8] font-light mt-1">
                    Our AI clones tone, cadence, and breath from 60 seconds of audio.
                  </p>
                </div>

                <VoiceUploader
                  selectedFileName={formData.audioFileName}
                  onFileSelect={(fileName, duration) =>
                    setFormData({
                      ...formData,
                      audioFileName: fileName,
                      audioDurationSeconds: duration,
                    })
                  }
                />

                <div className="pt-6 flex items-center justify-between border-t border-[#1E1E30] mt-6">
                  <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                    Back
                  </Button>

                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setStep(3)}
                    disabled={!formData.audioFileName}
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to Prompts
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Personality Prompts */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <span className="text-xs uppercase tracking-widest text-[#7C6AFF] font-medium">
                  Step 3 of 4
                </span>
                <h2 className="font-syne text-2xl font-bold text-[#F0F0F8] mt-1">
                  Personality & Wisdom Prompts
                </h2>
                <p className="text-xs text-[#9090A8] font-light mt-1">
                  Answer how {formData.name || "they"} expressed humor, gave advice, and reacted to life.
                </p>
              </div>

              <PersonalityPrompts
                responses={formData.promptResponses}
                onResponseChange={(id, text) =>
                  setFormData({
                    ...formData,
                    promptResponses: { ...formData.promptResponses, [id]: text }
                  })
                }
                onFinishPrompts={() => setStep(4)}
              />
            </motion.div>
          )}

          {/* STEP 4: Optional Uploads */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8 border-[#7C6AFF]/30 bg-[#0F0F1A]">
                <div className="mb-6">
                  <span className="text-xs uppercase tracking-widest text-[#7C6AFF] font-medium">
                    Step 4 of 4
                  </span>
                  <h2 className="font-syne text-2xl font-bold text-[#F0F0F8] mt-1">
                    Optional Written Archives
                  </h2>
                  <p className="text-xs text-[#9090A8] font-light mt-1">
                    Upload WhatsApp exports or personal letters to enrich signature phrases.
                  </p>
                </div>

                <FileUploader onCompleteStep={handleFinishOnboarding} />
              </Card>
            </motion.div>
          )}

          {/* STEP 5: Completion Screen */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <Card className="p-10 border-[#4ECCA3]/40 bg-[#0F0F1A] shadow-[0_0_40px_rgba(78,204,163,0.15)] flex flex-col items-center">
                {/* Large Mint Checkmark Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-[#4ECCA3]/15 border border-[#4ECCA3] flex items-center justify-center mb-6 shadow-glow-mint"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#4ECCA3]" />
                </motion.div>

                <h2 className="font-syne text-3xl font-extrabold text-[#F0F0F8] mb-2">
                  {formData.name || "Their"}'s memory vault is being built.
                </h2>
                <p className="text-sm text-[#9090A8] font-light max-w-md mb-8">
                  Synthesizing voice harmonics and structuring personality schema on AWS infrastructure.
                </p>

                {/* Progress Bar & Stage Notes */}
                <div className="w-full max-w-md bg-[#14141F] border border-[#1E1E30] rounded-[10px] p-4 mb-8 text-left">
                  <div className="flex items-center justify-between text-xs text-[#9090A8] font-mono mb-2">
                    <span className="flex items-center gap-1.5 text-[#4ECCA3]">
                      <Cpu className="w-3.5 h-3.5" />
                      Stage {processingStage + 1} of 4
                    </span>
                    <span>{Math.min(100, (processingStage + 1) * 25)}%</span>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-2 bg-[#0F0F1A] rounded-full overflow-hidden mb-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#7C6AFF] to-[#4ECCA3]"
                      animate={{ width: `${(processingStage + 1) * 25}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>

                  <p className="text-xs text-[#F0F0F8] font-mono">
                    {STAGES[processingStage]}
                  </p>
                </div>

                {/* CTA Button */}
                {processingStage === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      variant="mint"
                      size="lg"
                      onClick={() => router.push('/vault')}
                      icon={<ArrowRight className="w-5 h-5" />}
                    >
                      View Their Vault
                    </Button>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer minimal info */}
      <footer className="w-full max-w-4xl mx-auto text-center text-xs text-[#55556A] font-mono z-10 py-2">
        Evoke Preservations · Encrypted with AWS KMS
      </footer>
    </main>
  );
}
