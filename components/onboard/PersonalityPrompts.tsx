"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { Card } from '../ui/Card';
import { Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const PROMPTS = [
  {
    id: 1,
    question: "What made them laugh — give a real example",
    placeholder: "e.g., When things went unexpectedly off script, they would chuckle quietly, put everyone at ease, and say..."
  },
  {
    id: 2,
    question: "How did they react when someone made a difficult mistake?",
    placeholder: "e.g., They never raised their voice. They would sit down, listen patiently, and ask what lesson could be drawn from the setback..."
  },
  {
    id: 3,
    question: "What was their go-to phrase when life got hard?",
    placeholder: "e.g., 'Difficulty helps you realize your hidden potential' or 'Take responsibility and keep moving forward...'"
  },
  {
    id: 4,
    question: "How did they give advice — tough love, gentle encouragement, or quiet logic?",
    placeholder: "e.g., Purpose-driven mentorship with deep care. They expected dedication but stood by you unconditionally..."
  },
  {
    id: 5,
    question: "What values or causes did they care about most in the world?",
    placeholder: "e.g., Integrity, education, youth empowerment, public service, and intellectual discipline..."
  },
  {
    id: 6,
    question: "How did they express support and care to those around them?",
    placeholder: "e.g., Through generous mentorship, patient listening, and taking genuine pride in the success of others..."
  }
];

interface PersonalityPromptsProps {
  responses: Record<number, string>;
  onResponseChange: (promptId: number, value: string) => void;
  onFinishPrompts: () => void;
}

export const PersonalityPrompts: React.FC<PersonalityPromptsProps> = ({
  responses,
  onResponseChange,
  onFinishPrompts,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPrompt = PROMPTS[currentIndex];
  const currentText = responses[currentPrompt.id] || '';

  const handleNext = () => {
    if (currentIndex < PROMPTS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onFinishPrompts();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Carousel Counter */}
      <div className="flex items-center justify-between text-xs text-evoke-text-secondary font-mono">
        <span className="flex items-center gap-1.5 text-[#7C6AFF] dark:text-[#9D8FFF]">
          <Sparkles className="w-3.5 h-3.5" />
          Prompt {currentIndex + 1} of {PROMPTS.length}
        </span>
        <div className="flex items-center gap-1">
          {PROMPTS.map((p, idx) => (
            <span
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full cursor-pointer transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-[#7C6AFF]'
                  : responses[p.id]?.trim()
                  ? 'w-2 bg-[#4ECCA3]'
                  : 'w-2 bg-evoke-border'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Carousel Prompt Card */}
      <Card 
        className="p-8 border-[#7C6AFF]/30 bg-evoke-surface min-h-[320px] flex flex-col justify-between"
        hoverEffect={false}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPrompt.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col gap-4"
          >
            <h3 className="font-syne text-xl sm:text-2xl font-bold text-evoke-text-primary leading-snug">
              {currentPrompt.question}
            </h3>

            <div className="relative">
              <Textarea
                value={currentText}
                onChange={(e) => onResponseChange(currentPrompt.id, e.target.value)}
                placeholder={currentPrompt.placeholder}
                rows={4}
                className="min-h-[140px] text-base"
              />
              <div className="text-right text-[11px] font-mono text-evoke-text-muted mt-1">
                {currentText.length} characters
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Navigation Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-evoke-border mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <Button
            variant={currentIndex === PROMPTS.length - 1 ? 'mint' : 'primary'}
            size="md"
            onClick={handleNext}
            icon={currentIndex === PROMPTS.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          >
            {currentIndex === PROMPTS.length - 1 ? 'Save & Continue' : 'Next Prompt'}
          </Button>
        </div>
      </Card>
    </div>
  );
};
