"use client";

import { motion } from "framer-motion";

interface HeaderProps {
  watchlistCount: number;
  onToggleWatchlist: () => void;
  showWatchlist: boolean;
}

export default function Header({ watchlistCount, onToggleWatchlist, showWatchlist }: HeaderProps) {
  return (
    <header className="relative z-50 flex items-center justify-between px-4 py-2.5 bg-[var(--bg-primary)] border-b border-[var(--border)]">
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 text-[var(--poly-blue)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[15px] font-bold text-[var(--text-primary)]">
          PolySwipe
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggleWatchlist}
        className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
          showWatchlist
            ? "bg-[var(--poly-blue)]/15 text-[var(--poly-blue)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
        }`}
      >
        <svg className="w-4 h-4" fill={showWatchlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        Watchlist
        {watchlistCount > 0 && (
          <motion.span
            key={watchlistCount}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="badge-pop min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--poly-blue)] text-white text-[10px] font-bold"
          >
            {watchlistCount}
          </motion.span>
        )}
      </motion.button>
    </header>
  );
}
