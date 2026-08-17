"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Sparkles, ArrowRight, PlayCircle, Cpu } from 'lucide-react';

const AWS_BADGES = [
  "S3",
  "Lambda",
  "Transcribe",
  "Comprehend",
  "DynamoDB",
  "Cognito",
  "Amplify"
];

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-32 pb-16 overflow-hidden">
      {/* Background Warm Gold & Violet Drifting Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#C5A880]/10 to-[#7C6AFF]/10 rounded-full blur-[140px] pointer-events-none animate-orb-slow" />
      <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-[#C5A880]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(var(--text-muted) 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 my-auto">
        {/* Top Tagline Pill in Gold Accent */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-[#C5A880]/10 border border-[#C5A880]/30 mb-8"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span className="text-xs font-semibold text-[#C5A880] tracking-wide">
            The Apple of Memory Technology
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-syne font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight text-evoke-text-primary leading-[1.1] mb-6"
        >
          Hear from the people you love. <br />
          <span className="bg-gold-gradient bg-clip-text text-transparent">
            Forever.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto text-base sm:text-lg text-evoke-text-secondary font-light leading-relaxed mb-10"
        >
          Evoke preserves not just someone's voice — but their humor, their wisdom, their way of being with you. Powered by AI. Built on AWS.
        </motion.p>

        {/* Triple CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/demo" className="w-full sm:w-auto">
            <Button variant="gold" size="lg" className="w-full sm:w-auto shadow-glow-gold" icon={<Sparkles className="w-5 h-5" />}>
              Explore Demo Persona
            </Button>
          </Link>
          <Link href="/onboard" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto" icon={<ArrowRight className="w-5 h-5" />}>
              Build a Memory Vault
            </Button>
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto" icon={<PlayCircle className="w-5 h-5 text-[#C5A880]" />}>
              See How It Works
            </Button>
          </a>
        </motion.div>
      </div>

      {/* AWS Service Badges Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl mx-auto px-6 text-center relative z-10 pt-6"
      >
        <p className="text-xs uppercase tracking-widest text-[#FF9A3C] font-semibold mb-4 flex items-center justify-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-[#FF9A3C]" />
          Architected on AWS Free Tier Infrastructure
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {AWS_BADGES.map((service) => (
            <Badge key={service} variant="aws">
              {service}
            </Badge>
          ))}
        </div>
      </motion.div>
    </section>
  );
};
