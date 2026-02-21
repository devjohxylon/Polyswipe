"use client";

import { Market } from "@/types/market";
import { getYesPrice, formatVolume, formatEndDate, getEventSlug } from "@/lib/polymarket";

interface MarketCardProps {
  market: Market;
  onSave: (market: Market) => void;
  isSaved: boolean;
}

export default function MarketCard({ market, onSave, isSaved }: MarketCardProps) {
  const yesPct = Math.round(getYesPrice(market) * 100);
  const noPct = 100 - yesPct;

  return (
    <div className="px-4 py-1.5">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--border-light)] transition-colors">
        {/* Top section: icon + question + save */}
        <div className="p-4 pb-3">
          <div className="flex gap-3">
            {market.icon && (
              <img
                src={market.icon}
                alt=""
                className="w-9 h-9 rounded-lg object-cover border border-[var(--border)] flex-shrink-0 mt-0.5"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-white leading-snug pr-8">
                {market.question}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                {market.events?.[0]?.title && (
                  <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[160px]">
                    {market.events[0].title}
                  </span>
                )}
                {market.events?.[0]?.title && market.endDateIso && (
                  <span className="text-[var(--text-muted)]/30 text-[11px]">&middot;</span>
                )}
                {market.endDateIso && (
                  <span className="text-[11px] text-[var(--text-muted)] flex-shrink-0">
                    {formatEndDate(market.endDateIso)}
                  </span>
                )}
              </div>
            </div>
            {/* Save button - top right */}
            <button
              onClick={() => onSave(market)}
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                isSaved
                  ? "text-[var(--accent-amber)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <svg className="w-4 h-4" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Probability section */}
        <div className="px-4 pb-3">
          {/* Bar */}
          <div className="w-full h-1.5 rounded-full prob-bar-track">
            <div
              className="h-full rounded-full prob-bar-fill transition-all duration-500"
              style={{ width: `${yesPct}%` }}
            />
          </div>
          {/* Numbers row */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-3">
              <span className="text-[var(--accent-green)] text-sm font-bold">{yesPct}% Yes</span>
              <span className="text-[var(--accent-red)] text-sm font-bold">{noPct}% No</span>
            </div>
            <div className="flex items-center gap-1 text-[var(--text-muted)]">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-[11px] font-semibold">{formatVolume(market.volumeNum || 0)}</span>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="flex items-center border-t border-[var(--border)] divide-x divide-[var(--border)]">
          <a
            href={`https://polymarket.com/event/${getEventSlug(market)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold text-[var(--accent-green)] hover:bg-[var(--accent-green)]/5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Trade
          </a>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: market.question,
                  url: `https://polymarket.com/event/${getEventSlug(market)}`,
                });
              } else {
                navigator.clipboard.writeText(`https://polymarket.com/event/${getEventSlug(market)}`);
              }
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-semibold text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-card-elevated)]/50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
