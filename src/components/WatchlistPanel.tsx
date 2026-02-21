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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: "82vh",
          background: "var(--bg-card)",
          borderRadius: "24px 24px 0 0",
          overflow: "hidden",
          border: "1px solid var(--bd2)",
          borderBottom: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 12, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "var(--bd2)" }} />
        </div>

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 16px 12px",
            borderBottom: "1px solid var(--bd)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" fill="var(--blue)" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--t1)" }}>Watchlist</span>
            <span style={{ fontSize: 12, color: "var(--t3)" }}>({markets.length})</span>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              color: "var(--t3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", maxHeight: "68vh" }} className="no-scrollbar">
          {markets.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "64px 32px",
                color: "var(--t3)",
              }}
            >
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ opacity: 0.3, marginBottom: 12 }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p style={{ fontSize: 13, color: "var(--t3)" }}>No saved markets yet</p>
            </div>
          ) : (
            <AnimatePresence>
              {markets.map((market) => {
                const yesCents = Math.round(getYesPrice(market) * 100);
                const noCents = 100 - yesCents;
                return (
                  <motion.a
                    key={market.id || market.conditionId}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -80 }}
                    href={`https://polymarket.com/event/${getEventSlug(market)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 16px",
                      borderBottom: "1px solid var(--bd)",
                      textDecoration: "none",
                      transition: "background 0.12s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-card-2)")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {market.icon && (
                      <img
                        src={market.icon}
                        alt=""
                        style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                      />
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--t1)",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          marginBottom: 4,
                        }}
                      >
                        {market.question}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--yes)" }}>YES {yesCents}¢</span>
                        <span style={{ fontSize: 10, color: "var(--t3)" }}>·</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--no)" }}>NO {noCents}¢</span>
                        <span style={{ fontSize: 10, color: "var(--t3)" }}>·</span>
                        <span style={{ fontSize: 11, color: "var(--t3)" }}>{formatVolume(market.volumeNum || 0)}</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onRemove(market.id || market.conditionId);
                      }}
                      style={{
                        padding: 6,
                        borderRadius: 8,
                        border: "none",
                        background: "transparent",
                        color: "var(--t3)",
                        cursor: "pointer",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "color 0.12s, background 0.12s",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = "var(--no)";
                        e.currentTarget.style.background = "var(--no-dim)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = "var(--t3)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
