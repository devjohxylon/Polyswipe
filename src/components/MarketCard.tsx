"use client";

import { Market } from "@/types/market";
import { getYesPrice, formatVolume, formatEndDate, getEventSlug } from "@/lib/polymarket";

interface MarketCardProps {
  market: Market;
  onSave: (market: Market) => void;
  isSaved: boolean;
}

export default function MarketCard({ market, onSave, isSaved }: MarketCardProps) {
  const yesPrice = getYesPrice(market);
  const noPrice = 1 - yesPrice;
  const yesCents = Math.round(yesPrice * 100);
  const noCents = Math.round(noPrice * 100);
  const yesPct = Math.round(yesPrice * 100);
  const eventUrl = `https://polymarket.com/event/${getEventSlug(market)}`;

  const openMarket = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(eventUrl, "_blank");
  };

  return (
    <div className="px-3 py-2 fade-up">
      <div
        style={{
          background: "var(--bg-card)",
          borderRadius: "20px",
          border: "1px solid var(--bd)",
          overflow: "hidden",
        }}
      >
        {/* Hero image */}
        <div style={{ position: "relative", width: "100%", height: "220px", background: "var(--bg-card-2)" }}>
          {market.image ? (
            <img
              src={market.image}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--bg-card-2), var(--bg))" }} />
          )}

          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.75) 70%, rgba(0,0,0,0.92) 100%)",
            }}
          />

          {/* Top row: live badge + bookmark */}
          <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "3px 10px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--yes)", flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em" }}>LIVE</span>
            </div>

            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSave(market); }}
              style={{
                padding: 8,
                borderRadius: 12,
                backdropFilter: "blur(8px)",
                border: `1px solid ${isSaved ? "var(--blue)" : "rgba(255,255,255,0.15)"}`,
                background: isSaved ? "var(--blue)" : "rgba(0,0,0,0.45)",
                color: "white",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
            >
              <svg width="16" height="16" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>

          {/* Question overlaid at image bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 16px 16px" }}>
            <p
              style={{
                fontSize: 17,
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.35,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textShadow: "0 1px 8px rgba(0,0,0,0.6)",
              }}
            >
              {market.question}
            </p>
          </div>
        </div>

        {/* Data section */}
        <div style={{ padding: "14px 16px 16px" }}>

          {/* Probability row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: "var(--yes)", lineHeight: 1, minWidth: 44 }}>
              {yesPct}%
            </span>

            {/* Bar */}
            <div style={{ flex: 1, height: 5, borderRadius: 999, background: "var(--no-dim)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${yesPct}%`,
                  borderRadius: 999,
                  background: "linear-gradient(90deg, var(--yes-dark), var(--yes))",
                  transition: "width 0.4s ease",
                }}
              />
            </div>

            <span style={{ fontSize: 26, fontWeight: 900, color: "var(--no)", lineHeight: 1, minWidth: 44, textAlign: "right" }}>
              {100 - yesPct}%
            </span>
          </div>

          {/* YES / NO labels under bar */}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--yes)", letterSpacing: "0.06em" }}>YES</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "var(--t3)" }}>{formatVolume(market.volumeNum || 0)} vol</span>
              {market.endDateIso && (
                <>
                  <span style={{ fontSize: 8, color: "var(--t3)" }}>·</span>
                  <span style={{ fontSize: 11, color: "var(--t3)" }}>{formatEndDate(market.endDateIso)}</span>
                </>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: 600, color: "var(--no)", letterSpacing: "0.06em" }}>NO</span>
          </div>

          {/* Buy buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={openMarket}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 8px",
                borderRadius: 14,
                background: "var(--yes)",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.15s ease, transform 0.1s ease",
                gap: 2,
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}>BUY YES</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{yesCents}¢</span>
            </button>

            <button
              onClick={openMarket}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "12px 8px",
                borderRadius: 14,
                background: "var(--no)",
                border: "none",
                cursor: "pointer",
                transition: "opacity 0.15s ease, transform 0.1s ease",
                gap: 2,
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.88")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.8)", letterSpacing: "0.05em" }}>BUY NO</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#fff", lineHeight: 1 }}>{noCents}¢</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
