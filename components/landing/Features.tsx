"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

const FEATURES = [
  {
    icon: "🎙️",
    title: "Voice Cloning",
    subtitle: "60 seconds of audio becomes a lifetime of presence",
    description: "Our neural audio engine synthesizes emotional nuance, cadence, and breath patterns from brief recordings."
  },
  {
    icon: "🧠",
    title: "Personality Schema",
    subtitle: "Humor, advice style, signature phrases — structured and preserved",
    description: "Multi-dimensional personality mapping converts unstructured memories into structured knowledge graphs."
  },
  {
    icon: "🔒",
    title: "Consent-First Architecture",
    subtitle: "Only people you authorize can access the echo. Ever.",
    description: "Cryptographic vault keys and AWS Cognito access controls enforce private family-only access."
  },
  {
    icon: "⚡",
    title: "Serverless on AWS",
    subtitle: "10 AWS services. Zero idle cost. Infinitely scalable.",
    description: "Architected on Lambda, S3, DynamoDB, and Transcribe for 99.99% reliability on AWS free tier."
  },
  {
    icon: "💬",
    title: "Epistemic Humility",
    subtitle: "The echo knows what it doesn't know. It never fabricates.",
    description: "Grounded strictly in recorded memory profiles. If an answer wasn't shared, the echo responds with gentle truth."
  },
  {
    icon: "🌿",
    title: "Living Profile",
    subtitle: "The more you add, the richer the echo becomes over time",
    description: "Add new letters, chat exports, or voice clips anytime to expand warmth and advice nuance over generations."
  }
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 relative z-10 bg-evoke-bg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#4ECCA3] font-semibold mb-3">
            Built With Reverence
          </h2>
          <h3 className="font-syne text-3xl sm:text-4xl font-bold text-evoke-text-primary">
            Crafted for Emotional Authenticity
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <Card 
                className="h-full flex flex-col justify-between p-6 bg-evoke-card border-evoke-border"
                borderTheme={idx % 2 === 0 ? 'gold' : 'violet'}
              >
                <div>
                  <div className="text-3xl mb-4 p-3 w-fit rounded-[10px] bg-evoke-surface border border-evoke-border">
                    {feature.icon}
                  </div>

                  <h4 className="font-syne text-lg font-bold text-evoke-text-primary mb-1">
                    {feature.title}
                  </h4>

                  <p className="text-xs font-semibold text-[#C5A880] dark:text-[#7C6AFF] mb-3">
                    {feature.subtitle}
                  </p>

                  <p className="text-xs text-evoke-text-secondary font-light leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
