'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App runtime error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-evoke-bg text-evoke-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 rounded-[16px] bg-evoke-card border border-evoke-border max-w-md w-full space-y-4 shadow-lg">
        <span className="text-4xl">⚠️</span>
        <h2 className="font-syne text-2xl font-bold text-evoke-text-primary">
          Something went wrong
        </h2>
        <p className="text-xs text-evoke-text-secondary font-light">
          {error.message || 'An unexpected error occurred while rendering the page.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-[8px] bg-evoke-surface border border-evoke-border text-xs font-semibold text-evoke-text-primary hover:border-[#7C6AFF] transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-[8px] bg-[#C5A880] text-[#080810] text-xs font-semibold hover:bg-[#D4B890] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
