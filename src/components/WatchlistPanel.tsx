"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Market } from "@/types/market";
import { getYesPrice, formatVolume, getEventSlug } from "@/lib/polymarket";

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
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-[var(--bg-secondary)] rounded-t-[28px] overflow-hidden border-t border-[var(--border-light)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-[var(--text-muted)]/40" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-2 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-purple)]/20 border border-[var(--accent-blue)]/20 flex items-center justify-center">
              <svg className="w-4.5 h-4.5 text-[var(--accent-blue)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Watchlist</h2>
              <p className="text-xs text-[var(--text-muted)]">{markets.length} saved market{markets.length !== 1 ? "s" : ""}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[var(--bg-card-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Market List */}
        <div className="overflow-y-auto max-h-[68vh] no-scrollbar px-4 pb-10">
          {markets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-muted)]">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card-elevated)] border border-[var(--border)] flex items-center justify-center mb-4">
                <svg className="w-7 h-7 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p className="text-sm font-medium mb-1">No saved markets yet</p>
              <p className="text-xs text-[var(--text-muted)]/60">Bookmark markets to save them here</p>
            </div>
          ) : (
            <AnimatePresence>
              {markets.map((market) => {
                const yesPct = Math.round(getYesPrice(market) * 100);
                return (
                  <motion.div
                    key={market.id || market.conditionId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -200 }}
                    className="flex items-center gap-3 p-3.5 mb-2 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-light)] transition-all"
                  >
                    {market.icon && (
                      <img
                        src={market.icon}
                        alt=""
                        className="w-10 h-10 rounded-xl object-cover border border-[var(--border)] flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-white leading-tight line-clamp-2">
                        {market.question}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[11px] text-[var(--accent-green)] font-bold">
                          {yesPct}% Yes
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                          {formatVolume(market.volumeNum || 0)} vol
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href={`https://polymarket.com/event/${getEventSlug(market)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[var(--accent-green)]/10 text-[var(--accent-green)] text-[11px] font-bold hover:bg-[var(--accent-green)]/20 border border-[var(--accent-green)]/15 transition-colors"
                      >
                        Trade
                      </a>
                      <button
                        onClick={() => onRemove(market.id || market.conditionId)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[var(--accent-red)]/10 text-[var(--text-muted)] hover:text-[var(--accent-red)] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
