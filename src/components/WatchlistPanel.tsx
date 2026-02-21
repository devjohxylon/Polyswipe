"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Market } from "@/types/market";
import { getYesPrice, formatVolume } from "@/lib/polymarket";

interface WatchlistPanelProps {
  markets: Market[];
  onClose: () => void;
  onRemove: (id: string) => void;
}

export default function WatchlistPanel({ markets, onClose, onRemove }: WatchlistPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-[var(--bg-card)] rounded-t-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-[var(--text-muted)]/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4">
          <h2 className="text-xl font-bold text-white">Watchlist</h2>
          <span className="text-sm text-[var(--text-muted)]">{markets.length} markets</span>
        </div>

        {/* Market List */}
        <div className="overflow-y-auto max-h-[65vh] no-scrollbar px-4 pb-8">
          {markets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
              <svg className="w-12 h-12 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p className="text-sm">Star markets to add them here</p>
            </div>
          ) : (
            <AnimatePresence>
              {markets.map((market) => {
                const yesPct = Math.round(getYesPrice(market) * 100);
                return (
                  <motion.div
                    key={market.id || market.condition_id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    className="flex items-center gap-3 p-3 mb-2 rounded-xl bg-[var(--bg-primary)]/50 hover:bg-[var(--bg-primary)] transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {market.question}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-[var(--accent-green)] font-medium">
                          {yesPct}% Yes
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {formatVolume(market.volume_num || 0)} vol
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://polymarket.com/event/${market.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-xs font-bold hover:bg-[var(--accent-green)]/20 transition-colors"
                      >
                        Trade
                      </a>
                      <button
                        onClick={() => onRemove(market.id || market.condition_id)}
                        className="p-1.5 rounded-lg hover:bg-[var(--accent-red)]/10 text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
