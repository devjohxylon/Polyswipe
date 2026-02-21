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
      className="fixed inset-0 z-50 bg-black/60"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-[var(--bg-secondary)] rounded-t-2xl overflow-hidden border-t border-[var(--border)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-8 h-1 rounded-full bg-[var(--text-muted)]/40" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-1 pb-3">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--poly-blue)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <h2 className="text-[15px] font-bold text-[var(--text-primary)]">Watchlist</h2>
            <span className="text-[12px] text-[var(--text-muted)]">({markets.length})</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[65vh] no-scrollbar">
          {markets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
              <svg className="w-8 h-8 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-[13px]">No saved markets yet</p>
            </div>
          ) : (
            <AnimatePresence>
              {markets.map((market) => {
                const yesCents = Math.round(getYesPrice(market) * 100);
                return (
                  <motion.a
                    key={market.id || market.conditionId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    href={`https://polymarket.com/event/${getEventSlug(market)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border)] hover:bg-[var(--bg-card)] transition-colors"
                  >
                    {market.icon && (
                      <img
                        src={market.icon}
                        alt=""
                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-[var(--text-primary)] leading-tight line-clamp-2">
                        {market.question}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-[var(--poly-green)] font-semibold">
                          Yes {yesCents}¢
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)]">
                          {formatVolume(market.volumeNum || 0)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(market.id || market.conditionId);
                      }}
                      className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--poly-red)] hover:bg-[var(--poly-red-bg)] transition-colors flex-shrink-0"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.a>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
