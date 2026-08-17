"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useEvoke } from '@/lib/store';
import { Button } from '../ui/Button';
import { Sun, Moon, ArrowRight, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useEvoke();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-evoke-bg/85 backdrop-blur-md border-b border-evoke-border py-3.5 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center">
            <span className="font-syne text-2xl font-bold tracking-tight text-evoke-text-primary">
              Evoke
            </span>
            {/* Soft gold glow dot instead of violet */}
            <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880] shadow-[0_0_10px_rgba(197,168,128,0.8)] ml-1 group-hover:scale-125 transition-transform" />
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-evoke-text-secondary">
          <Link href="/demo" className="text-[#C5A880] hover:text-[#E6C594] transition-colors flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Interactive Demo
          </Link>
          <a href="#features" className="hover:text-evoke-text-primary transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-evoke-text-primary transition-colors">
            How It Works
          </a>
          <a href="#tech-stack" className="hover:text-evoke-text-primary transition-colors">
            Tech Stack
          </a>
          <Link href="/dashboard" className="hover:text-evoke-text-primary transition-colors">
            Dashboard
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-4">
          {/* Elegant Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-[10px] bg-evoke-surface border border-evoke-border flex items-center justify-center text-evoke-text-primary hover:border-[#7C6AFF]/50 transition-colors shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#FF9A3C] fill-[#FF9A3C]/20" />
            ) : (
              <Moon className="w-4 h-4 text-[#7C6AFF] fill-[#7C6AFF]/20" />
            )}
          </button>

          <Link href="/converse" className="hidden sm:inline-block">
            <span className="text-xs text-evoke-text-secondary hover:text-evoke-text-primary transition-colors font-semibold px-3 py-2">
              Demo Converse
            </span>
          </Link>
          
          <Link href="/onboard">
            <Button variant="gold" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Start Your Legacy
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
