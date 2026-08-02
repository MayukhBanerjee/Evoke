"use client";

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#1E1E30] bg-[#080810] py-12 text-sm text-[#9090A8]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
          {/* Brand Left */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-syne text-xl font-bold text-[#F0F0F8]">Evoke</span>
              <span className="w-2 h-2 rounded-full bg-[#7C6AFF] shadow-[0_0_8px_#7C6AFF]" />
            </div>
            <p className="text-xs text-[#9090A8] font-light max-w-sm">
              Hear from the people you love. Forever.
            </p>
          </div>

          {/* Links Right */}
          <div className="flex flex-wrap gap-8 text-xs font-medium">
            <a href="#" className="hover:text-[#F0F0F8] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#F0F0F8] transition-colors">Consent-First Policy</a>
            <a href="#" className="hover:text-[#F0F0F8] transition-colors">Research Paper</a>
            <a href="#" className="hover:text-[#F0F0F8] transition-colors">GitHub Repository</a>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-6 border-t border-[#1E1E30]/50 flex flex-col sm:flex-row items-center justify-between text-xs text-[#55556A] gap-4">
          <p>Built with AWS Free Tier · VIT Cloud Computing Project</p>
          <p className="font-mono text-[#9090A8]">Developed by Mayukh Banerjee & Vedant Patel</p>
        </div>
      </div>
    </footer>
  );
};
