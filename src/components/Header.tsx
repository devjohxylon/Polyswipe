"use client";

import { motion } from "framer-motion";

interface HeaderProps {
  watchlistCount: number;
  onToggleWatchlist: () => void;
  showWatchlist: boolean;
}

export default function Header({ watchlistCount, onToggleWatchlist, showWatchlist }: HeaderProps) {
  return (
    <header
      style={{
        position: "relative",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "var(--bg)",
        borderBottom: "1px solid var(--bd)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "var(--blue)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <span style={{ fontSize: 16, fontWeight: 800, color: "var(--t1)", letterSpacing: "-0.02em" }}>
          PolySwipe
        </span>
      </div>

      {/* Watchlist button */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        onClick={onToggleWatchlist}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 12px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          transition: "all 0.15s ease",
          background: showWatchlist ? "var(--blue-dim)" : "transparent",
          color: showWatchlist ? "var(--blue)" : "var(--t2)",
        }}
      >
        <svg width="14" height="14" fill={showWatchlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        Watchlist
        {watchlistCount > 0 && (
          <motion.span
            key={watchlistCount}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            style={{
              minWidth: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "var(--blue)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "0 4px",
            }}
          >
            {watchlistCount}
          </motion.span>
        )}
      </motion.button>
    </header>
  );
}
