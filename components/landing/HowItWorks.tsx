"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Mic, Brain, MessageSquareQuote } from 'lucide-react';

const STEPS = [
  {
    number: "01",
    title: "Capture",
    icon: <Mic className="w-6 h-6 text-[#7C6AFF]" />,
    description: "Upload voice recordings, share cherished memories, and answer guided prompts about their unique personality and perspective.",
  },
  {
    number: "02",
    title: "Preserve",
    icon: <Brain className="w-6 h-6 text-[#4ECCA3]" />,
    description: "Our AI extracts personality — humor, tone, signature phrases, and core wisdom — structuring it into a living, private profile.",
  },
  {
    number: "03",
    title: "Converse",
    icon: <MessageSquareQuote className="w-6 h-6 text-[#7C6AFF]" />,
    description: "Authorized family members can have real voice conversations. In their authentic voice. In their exact words.",
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 relative z-10 border-t border-[#1E1E30]/60 bg-[#080810]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs uppercase tracking-widest text-[#7C6AFF] font-medium mb-3">
            Three Steps To Forever
          </h2>
          <h3 className="font-syne text-3xl sm:text-4xl font-bold text-[#F0F0F8]">
            How Evoke Preserves a Soul
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((step, idx) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
            >
              <Card className="h-full flex flex-col justify-between p-8 relative overflow-hidden group">
                {/* Faded Large Step Number in Background */}
                <span className="absolute -right-4 -bottom-6 font-syne text-9xl font-extrabold text-[#7C6AFF]/[0.05] group-hover:text-[#7C6AFF]/[0.1] transition-colors pointer-events-none select-none">
                  {step.number}
                </span>

                <div>
                  <div className="w-12 h-12 rounded-[10px] bg-[#0F0F1A] border border-[#1E1E30] flex items-center justify-center mb-6 group-hover:border-[#7C6AFF]/40 transition-colors">
                    {step.icon}
                  </div>

                  <h4 className="font-syne text-xl font-bold text-[#F0F0F8] mb-3">
                    {step.title}
                  </h4>

                  <p className="text-sm text-[#9090A8] font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-[#1E1E30]/50 flex items-center gap-2">
                  <span className="text-xs font-mono text-[#7C6AFF]">Step {step.number}</span>
                  <span className="h-px bg-[#1E1E30] flex-grow" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
