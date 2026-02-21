"use client";

import { motion } from "framer-motion";

interface ActionButtonsProps {
  onPass: () => void;
  onInterested: () => void;
  onSuperLike: () => void;
}

export default function ActionButtons({ onPass, onInterested, onSuperLike }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      {/* Pass Button */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
        onClick={onPass}
        className="w-16 h-16 rounded-full border-2 border-[var(--accent-red)]/50 bg-[var(--accent-red)]/10 flex items-center justify-center backdrop-blur-sm transition-colors hover:bg-[var(--accent-red)]/20"
      >
        <svg className="w-7 h-7 text-[var(--accent-red)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>

      {/* Super Like / Watchlist Button */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
        onClick={onSuperLike}
        className="w-12 h-12 rounded-full border-2 border-[var(--accent-blue)]/50 bg-[var(--accent-blue)]/10 flex items-center justify-center backdrop-blur-sm transition-colors hover:bg-[var(--accent-blue)]/20"
      >
        <svg className="w-5 h-5 text-[var(--accent-blue)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </motion.button>

      {/* Interested Button */}
      <motion.button
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.1 }}
        onClick={onInterested}
        className="w-16 h-16 rounded-full border-2 border-[var(--accent-green)]/50 bg-[var(--accent-green)]/10 flex items-center justify-center backdrop-blur-sm transition-colors hover:bg-[var(--accent-green)]/20"
      >
        <svg className="w-7 h-7 text-[var(--accent-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </motion.button>
    </div>
  );
}
