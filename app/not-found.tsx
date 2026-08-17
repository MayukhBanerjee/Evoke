import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-evoke-bg text-evoke-text-primary flex flex-col items-center justify-center p-6 text-center">
      <div className="p-8 rounded-[16px] bg-evoke-card border border-evoke-border max-w-md w-full space-y-4">
        <span className="text-4xl">🕊️</span>
        <h2 className="font-syne text-2xl font-bold text-evoke-text-primary">
          Page Not Found
        </h2>
        <p className="text-xs text-evoke-text-secondary font-light">
          The memory vault or page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-[8px] bg-[#C5A880] text-[#080810] font-semibold text-xs hover:bg-[#D4B890] transition-colors"
        >
          Return to Evoke Home
        </Link>
      </div>
    </main>
  );
}
