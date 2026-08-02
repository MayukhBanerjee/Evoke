"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { Sparkles, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

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
          ? 'bg-[#080810]/80 backdrop-blur-md border-b border-[#1E1E30] py-3.5 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center">
            <span className="font-syne text-2xl font-bold tracking-tight text-[#F0F0F8]">
              Evoke
            </span>
            <span className="w-2 h-2 rounded-full bg-[#7C6AFF] shadow-[0_0_10px_#7C6AFF] ml-1 group-hover:scale-125 transition-transform" />
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#9090A8]">
          <a href="#features" className="hover:text-[#F0F0F8] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="hover:text-[#F0F0F8] transition-colors">
            How It Works
          </a>
          <a href="#tech-stack" className="hover:text-[#F0F0F8] transition-colors">
            Tech Stack
          </a>
          <Link href="/dashboard" className="hover:text-[#F0F0F8] transition-colors">
            Dashboard
          </Link>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-4">
          <Link href="/converse" className="hidden sm:inline-block">
            <span className="text-xs text-[#9090A8] hover:text-[#F0F0F8] transition-colors font-medium px-3 py-2">
              Demo Converse
            </span>
          </Link>
          <Link href="/onboard">
            <Button variant="primary" size="md" icon={<ArrowRight className="w-4 h-4" />}>
              Start Your Legacy
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
