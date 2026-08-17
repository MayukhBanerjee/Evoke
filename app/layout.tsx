import type { Metadata } from 'next';
import './globals.css';
import { EvokeProvider } from '@/lib/store';

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-evoke-bg text-evoke-text-primary antialiased selection:bg-[#7C6AFF]/30 selection:text-white transition-colors duration-300">
        <EvokeProvider>
          {children}
        </EvokeProvider>
      </body>
    </html>
  );
}
