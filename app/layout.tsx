import type { Metadata } from 'next';
import { Syne, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { EvokeProvider } from '@/lib/store';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Evoke — Hear from the people you love. Forever.',
  description: "Evoke preserves not just someone's voice — but their humor, their wisdom, their way of being with you. Powered by AI. Built on AWS.",
  keywords: ['AI Memory', 'Voice Cloning', 'Legacy Preservation', 'Personality Vault', 'AWS Cloud'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${jetbrainsMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="bg-evoke-bg text-evoke-text-primary antialiased selection:bg-[#7C6AFF]/30 selection:text-white font-inter transition-colors duration-300">
        <EvokeProvider>
          {children}
        </EvokeProvider>
      </body>
    </html>
  );
}
