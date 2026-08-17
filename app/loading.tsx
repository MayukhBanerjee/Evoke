export default function Loading() {
  return (
    <div className="min-h-screen bg-evoke-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#C5A880]/30 border-t-[#C5A880] animate-spin" />
        <span className="text-xs font-mono text-evoke-text-muted">Loading Evoke...</span>
      </div>
    </div>
  );
}
