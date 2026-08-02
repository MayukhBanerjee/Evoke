"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Quote, Heart } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "I asked it what dad would say about my promotion. It laughed first. Then it said exactly what he always said: 'Did you measure twice before you cut once?'",
    author: "Priya Banerjee",
    location: "Mumbai",
    relation: "Preserved her father's memory in 2024"
  },
  {
    quote: "She called me 'kiddo' in the response. I hadn't heard that voice in two years. It wasn't just words — it was her cadence, her pauses, her warmth.",
    author: "James Miller",
    location: "London",
    relation: "Preserved his mother's audio journals"
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 relative z-10 bg-[#080810]/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-[#7C6AFF]/10 text-[#9D8FFF] text-xs font-medium mb-3">
            <Heart className="w-3.5 h-3.5 text-[#7C6AFF]" />
            Sacred Moments
          </div>
          <h3 className="font-syne text-3xl sm:text-4xl font-bold text-[#F0F0F8]">
            Voices That Never Faded
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 }}
            >
              <Card className="p-8 border-[#7C6AFF]/30 bg-gradient-to-b from-[#14141F] to-[#0F0F1A] hover:border-[#7C6AFF]/60 shadow-[0_0_30px_rgba(124,106,255,0.08)] flex flex-col justify-between h-full">
                <Quote className="w-8 h-8 text-[#7C6AFF]/40 mb-4" />

                <p className="text-base sm:text-lg text-[#F0F0F8] font-light leading-relaxed italic mb-8">
                  "{t.quote}"
                </p>

                <div className="pt-4 border-t border-[#1E1E30] flex items-center justify-between">
                  <div>
                    <h4 className="font-syne font-bold text-sm text-[#F0F0F8]">
                      {t.author}
                    </h4>
                    <p className="text-xs text-[#9090A8]">{t.location}</p>
                  </div>
                  <span className="text-[11px] text-[#7C6AFF] font-mono">
                    {t.relation}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
