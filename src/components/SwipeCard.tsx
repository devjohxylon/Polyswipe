"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useState, useCallback } from "react";
import { Market, SwipeDirection } from "@/types/market";
import { getYesPrice, formatVolume, formatEndDate, getEventSlug } from "@/lib/polymarket";

interface SwipeCardProps {
  market: Market;
  onSwipe: (direction: SwipeDirection) => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 120;

export default function SwipeCard({ market, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);
  const yesOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const noOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);
  const starOpacity = useTransform(y, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const [exitDirection, setExitDirection] = useState<SwipeDirection | null>(null);

  const yesPrice = getYesPrice(market);
  const yesPct = Math.round(yesPrice * 100);
  const noPct = 100 - yesPct;

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const xOffset = info.offset.x;
      const yOffset = info.offset.y;
      const xVelocity = info.velocity.x;

      if (Math.abs(xOffset) > SWIPE_THRESHOLD || Math.abs(xVelocity) > 500) {
        const direction: SwipeDirection = xOffset > 0 ? "right" : "left";
        setExitDirection(direction);
        onSwipe(direction);
      } else if (yOffset < -SWIPE_THRESHOLD) {
        setExitDirection("up");
        onSwipe("up");
      }
    },
    [onSwipe]
  );

  return (
    <motion.div
      className="absolute inset-3 sm:inset-4 cursor-grab active:cursor-grabbing"
      style={{
        x,
        y,
        rotate,
        zIndex: isTop ? 10 : 1,
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.93, opacity: isTop ? 1 : 0.4 }}
      animate={{
        scale: isTop ? 1 : 0.93,
        opacity: isTop ? 1 : 0.6,
        y: isTop ? 0 : 12,
      }}
      exit={{
        x: exitDirection === "right" ? 500 : exitDirection === "left" ? -500 : 0,
        y: exitDirection === "up" ? -600 : 0,
        opacity: 0,
        rotate: exitDirection === "right" ? 20 : exitDirection === "left" ? -20 : 0,
        transition: { duration: 0.35, ease: "easeIn" },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileDrag={{ scale: 1.02 }}
    >
      <div className="relative h-full w-full rounded-[28px] overflow-hidden card-glass">
        {/* Card inner glow overlay */}
        <div className="absolute inset-0 card-glass-inner rounded-[28px] pointer-events-none" />

        {/* Hero image area */}
        {market.image && (
          <div className="absolute inset-0">
            <img
              src={market.image}
              alt=""
              className="w-full h-2/5 object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-card)]/90 to-[var(--bg-card)]" style={{ top: "15%" }} />
          </div>
        )}

        {/* Swipe overlay: YES */}
        <motion.div
          className="absolute inset-0 swipe-overlay-yes rounded-[28px] z-10 pointer-events-none flex items-center justify-center"
          style={{ opacity: yesOpacity }}
        >
          <div className="glow-green rounded-2xl px-8 py-4 border-2 border-[var(--accent-green)] bg-[var(--accent-green)]/10 -rotate-12">
            <span className="text-[var(--accent-green)] font-black text-5xl tracking-widest">
              YES
            </span>
          </div>
        </motion.div>

        {/* Swipe overlay: PASS */}
        <motion.div
          className="absolute inset-0 swipe-overlay-no rounded-[28px] z-10 pointer-events-none flex items-center justify-center"
          style={{ opacity: noOpacity }}
        >
          <div className="glow-red rounded-2xl px-8 py-4 border-2 border-[var(--accent-red)] bg-[var(--accent-red)]/10 rotate-12">
            <span className="text-[var(--accent-red)] font-black text-5xl tracking-widest">
              NOPE
            </span>
          </div>
        </motion.div>

        {/* Swipe overlay: STAR */}
        <motion.div
          className="absolute inset-0 rounded-[28px] z-10 pointer-events-none flex items-center justify-center"
          style={{ opacity: starOpacity }}
        >
          <div className="glow-star rounded-2xl px-8 py-4 border-2 border-[var(--accent-blue)] bg-[var(--accent-blue)]/10">
            <span className="text-[var(--accent-blue)] font-black text-4xl tracking-widest flex items-center gap-3">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              SAVED
            </span>
          </div>
        </motion.div>

        {/* Card Content */}
        <div className="relative z-[5] h-full flex flex-col justify-between p-5 sm:p-6">
          {/* Top row: icon + badges */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              {market.icon && (
                <img
                  src={market.icon}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover border border-[var(--border-light)]"
                />
              )}
              <div className="flex flex-col">
                {market.events?.[0]?.title && (
                  <span className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight max-w-[180px] truncate">
                    {market.events[0].title}
                  </span>
                )}
                <span className="text-[10px] text-[var(--text-muted)] font-medium">
                  {market.endDateIso ? formatEndDate(market.endDateIso) : "Open-ended"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse-live" />
              <span className="text-[var(--accent-green)] text-[10px] font-bold tracking-wide">LIVE</span>
            </div>
          </div>

          {/* Middle: Question */}
          <div className="flex-1 flex items-center justify-center py-6 sm:py-8">
            <h2 className="text-[22px] sm:text-[28px] font-bold text-center leading-[1.25] text-white tracking-tight">
              {market.question}
            </h2>
          </div>

          {/* Bottom: Stats panel */}
          <div className="space-y-3">
            {/* YES / NO big numbers */}
            <div className="flex items-stretch gap-2.5">
              <div className="flex-1 rounded-2xl bg-[var(--accent-green)]/8 border border-[var(--accent-green)]/15 p-3 text-center">
                <div className="text-[var(--accent-green)] text-2xl sm:text-3xl font-black tracking-tight">
                  {yesPct}%
                </div>
                <div className="text-[var(--accent-green)]/70 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  Yes
                </div>
              </div>
              <div className="flex-1 rounded-2xl bg-[var(--accent-red)]/8 border border-[var(--accent-red)]/15 p-3 text-center">
                <div className="text-[var(--accent-red)] text-2xl sm:text-3xl font-black tracking-tight">
                  {noPct}%
                </div>
                <div className="text-[var(--accent-red)]/70 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                  No
                </div>
              </div>
            </div>

            {/* Probability bar */}
            <div className="w-full h-1.5 rounded-full prob-bar-track">
              <div
                className="h-full rounded-full prob-bar-fill animate-fill-bar"
                style={{ width: `${yesPct}%` }}
              />
            </div>

            {/* Bottom meta row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold">
                    {formatVolume(market.volumeNum || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                  <svg className="w-3.5 h-3.5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-semibold">
                    {formatVolume(market.liquidityNum || 0)}
                  </span>
                </div>
              </div>
              <a
                href={`https://polymarket.com/event/${getEventSlug(market)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[var(--accent-purple)] text-[11px] font-bold hover:text-[var(--accent-purple)]/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View on Polymarket
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
