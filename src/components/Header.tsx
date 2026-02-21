"use client";

import { motion } from "framer-motion";

interface HeaderProps {
  watchlistCount: number;
  onToggleWatchlist: () => void;
  showWatchlist: boolean;
}

export default function Header({ watchlistCount, onToggleWatchlist, showWatchlist }: HeaderProps) {
  return (
    <header className="relative z-50 flex items-center justify-between px-5 py-3 bg-[var(--bg-primary)]/80 backdrop-blur-md border-b border-[var(--border)]">
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ rotate: -10 }}
          animate={{ rotate: 0 }}
          className="text-2xl font-black tracking-tight bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-blue)] bg-clip-text text-transparent"
        >
          PolySwipe
        </motion.div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] font-bold uppercase tracking-wider">
          Beta
        </span>
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onToggleWatchlist}
        className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          showWatchlist
            ? "bg-[var(--accent-blue)] text-white"
            : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white"
        }`}
      >
        <svg className="w-4 h-4" fill={showWatchlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        {watchlistCount > 0 && (
          <motion.span
            key={watchlistCount}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-[var(--accent-purple)] text-white text-[10px] font-bold"
          >
            {watchlistCount}
          </motion.span>
        )}
      </motion.button>
    </header>
  );
}
