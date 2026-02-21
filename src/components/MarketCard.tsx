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
  const eventUrl = `https://polymarket.com/event/${getEventSlug(market)}`;

  return (
    <div className="px-4 py-2">
      <a
        href={eventUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[var(--bg-card)] rounded-xl border border-[var(--border)] hover:border-[var(--border-hover)] transition-colors overflow-hidden"
      >
        {/* Image banner */}
        {market.image && (
          <div className="relative w-full h-40 sm:h-48 bg-[var(--bg-secondary)]">
            <img
              src={market.image}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* Bookmark overlay */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSave(market);
              }}
              className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-sm transition-colors ${
                isSaved
                  ? "bg-[var(--poly-blue)] text-white"
                  : "bg-black/40 text-white/70 hover:text-white"
              }`}
            >
              <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Question */}
          <h3 className="text-[16px] font-semibold text-[var(--text-primary)] leading-snug">
            {market.question}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-2.5 mt-2">
            <span className="text-[12px] text-[var(--text-muted)] font-medium">
              {formatVolume(market.volumeNum || 0)} Vol.
            </span>
            {market.endDateIso && (
              <>
                <span className="text-[var(--text-muted)] text-[8px]">&bull;</span>
                <span className="text-[12px] text-[var(--text-muted)]">
                  {formatEndDate(market.endDateIso)}
                </span>
              </>
            )}
            {market.liquidityNum > 0 && (
              <>
                <span className="text-[var(--text-muted)] text-[8px]">&bull;</span>
                <span className="text-[12px] text-[var(--text-muted)]">
                  {formatVolume(market.liquidityNum)} Liq.
                </span>
              </>
            )}
          </div>

          {/* Yes / No buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(eventUrl, "_blank");
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[14px] font-bold text-[var(--poly-green)] bg-[var(--poly-green-bg)] hover:bg-[var(--poly-green-hover)] border border-[var(--poly-green)]/15 transition-colors"
            >
              Yes {yesCents}¢
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(eventUrl, "_blank");
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[14px] font-bold text-[var(--poly-red)] bg-[var(--poly-red-bg)] hover:bg-[var(--poly-red-hover)] border border-[var(--poly-red)]/15 transition-colors"
            >
              No {noCents}¢
            </button>
          </div>
        </div>
      </a>
    </div>
  );
}
