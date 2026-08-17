"use client";

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-evoke-border bg-evoke-bg py-12 text-sm text-evoke-text-secondary transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
          {/* Brand Left */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-syne text-xl font-bold text-evoke-text-primary">Evoke</span>
              {/* Premium gold dot logo highlight */}
              <span className="w-2.5 h-2.5 rounded-full bg-[#C5A880] shadow-[0_0_8px_rgba(197,168,128,0.7)]" />
            </div>
            <p className="text-xs text-evoke-text-secondary font-light max-w-sm">
              Hear from the people you love. Forever.
            </p>
          </div>

          {/* Links Right */}
          <div className="flex flex-wrap gap-6 text-xs font-semibold">
            <Link href="/demo" className="text-[#C5A880] hover:text-[#E6C594] transition-colors">
              Interactive Demo
            </Link>
            <Link href="/evaluation" className="hover:text-evoke-text-primary transition-colors">
              Research Findings (Table III)
            </Link>
            <Link href="/dashboard" className="hover:text-evoke-text-primary transition-colors">
              Dashboard
            </Link>
            <Link href="/vault" className="hover:text-evoke-text-primary transition-colors">
              Personality Vault
            </Link>
            <Link href="/onboard" className="hover:text-evoke-text-primary transition-colors">
              Create Vault
            </Link>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-evoke-border/50 flex flex-col sm:flex-row items-center justify-between text-xs text-evoke-text-muted gap-4">
          <p>Built with AWS Free Tier · VIT Cloud Computing Project</p>
          <p className="font-mono text-evoke-text-secondary">Developed by Mayukh Banerjee & Vedant Patel</p>
        </div>
      </div>
    </footer>
  );
};
