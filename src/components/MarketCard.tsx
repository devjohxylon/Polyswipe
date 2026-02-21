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
    <a
      href={eventUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block border-b border-[var(--border)] hover:bg-[var(--bg-card)] transition-colors"
    >
      <div className="flex gap-3 px-4 py-3">
        {/* Thumbnail */}
        {market.icon && (
          <img
            src={market.icon}
            alt=""
            className="w-12 h-12 rounded-lg object-cover flex-shrink-0 mt-0.5"
          />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Question */}
          <p className="text-[13px] font-medium text-[var(--text-primary)] leading-[1.4] line-clamp-2">
            {market.question}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] text-[var(--text-muted)] font-medium">
              {formatVolume(market.volumeNum || 0)} Vol.
            </span>
            {market.endDateIso && (
              <>
                <span className="text-[var(--text-muted)] text-[9px]">&bull;</span>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {formatEndDate(market.endDateIso)}
                </span>
              </>
            )}
          </div>

          {/* Yes / No buttons */}
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(eventUrl, "_blank");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold text-[var(--poly-green)] bg-[var(--poly-green-bg)] hover:bg-[var(--poly-green-hover)] transition-colors"
            >
              Yes {yesCents}¢
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(eventUrl, "_blank");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold text-[var(--poly-red)] bg-[var(--poly-red-bg)] hover:bg-[var(--poly-red-hover)] transition-colors"
            >
              No {noCents}¢
            </button>

            {/* Spacer + bookmark */}
            <div className="ml-auto">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSave(market);
                }}
                className={`p-1.5 rounded-md transition-colors ${
                  isSaved
                    ? "text-[var(--poly-blue)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
