import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Features } from '@/components/landing/Features';
import { TechStack } from '@/components/landing/TechStack';
import { Testimonials } from '@/components/landing/Testimonials';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#080810] text-[#F0F0F8] overflow-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <TechStack />
      <Testimonials />
      <Footer />
    </main>
  );
}
