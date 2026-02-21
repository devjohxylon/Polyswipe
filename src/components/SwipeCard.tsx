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
const ROTATION_FACTOR = 0.1;

export default function SwipeCard({ market, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const yesOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const noOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

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
      className="absolute inset-4 cursor-grab active:cursor-grabbing"
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
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.5 }}
      animate={{
        scale: isTop ? 1 : 0.95,
        opacity: isTop ? 1 : 0.7,
      }}
      exit={{
        x: exitDirection === "right" ? 500 : exitDirection === "left" ? -500 : 0,
        y: exitDirection === "up" ? -500 : 0,
        opacity: 0,
        rotate: exitDirection === "right" ? 20 : exitDirection === "left" ? -20 : 0,
        transition: { duration: 0.3 },
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileDrag={{ scale: 1.02 }}
    >
      <div className="relative h-full w-full rounded-3xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]">
        {/* Background image */}
        {market.image && (
          <div className="absolute inset-0">
            <img
              src={market.image}
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-[var(--bg-card)]/80 to-transparent" />
          </div>
        )}

        {/* Swipe overlay indicators */}
        <motion.div
          className="absolute inset-0 swipe-overlay-yes rounded-3xl z-10 pointer-events-none flex items-center justify-start pl-8"
          style={{ opacity: yesOpacity }}
        >
          <div className="glow-green rounded-2xl px-6 py-3 border-2 border-[var(--accent-green)] bg-[var(--accent-green)]/10 -rotate-12">
            <span className="text-[var(--accent-green)] font-black text-4xl tracking-wider">
              YES
            </span>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 swipe-overlay-no rounded-3xl z-10 pointer-events-none flex items-center justify-end pr-8"
          style={{ opacity: noOpacity }}
        >
          <div className="glow-red rounded-2xl px-6 py-3 border-2 border-[var(--accent-red)] bg-[var(--accent-red)]/10 rotate-12">
            <span className="text-[var(--accent-red)] font-black text-4xl tracking-wider">
              PASS
            </span>
          </div>
        </motion.div>

        {/* Card Content */}
        <div className="relative z-5 h-full flex flex-col justify-between p-6">
          {/* Top: Event Title + Live Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {market.groupItemTitle && (
                <span className="px-3 py-1 rounded-full bg-[var(--accent-purple)]/20 text-[var(--accent-purple)] text-xs font-semibold uppercase tracking-wide max-w-[200px] truncate">
                  {market.groupItemTitle}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-green)]/10">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] animate-pulse-live" />
                <span className="text-[var(--accent-green)] text-xs font-semibold">LIVE</span>
              </div>
            </div>
          </div>

          {/* Middle: Question */}
          <div className="flex-1 flex items-center justify-center py-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center leading-tight text-white drop-shadow-lg">
              {market.question}
            </h2>
          </div>

          {/* Bottom: Stats */}
          <div className="space-y-4">
            {/* Probability Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[var(--accent-green)] font-bold text-lg">
                  YES {yesPct}%
                </span>
                <span className="text-[var(--accent-red)] font-bold text-lg">
                  NO {noPct}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-[var(--accent-red)]/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-green)]/80 animate-fill-bar"
                  style={{ width: `${yesPct}%` }}
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[var(--text-secondary)] font-medium">
                    {formatVolume(market.volumeNum || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[var(--text-secondary)] font-medium">
                    {market.endDateIso ? formatEndDate(market.endDateIso) : "Open"}
                  </span>
                </div>
              </div>
              <a
                href={`https://polymarket.com/event/${getEventSlug(market)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--accent-blue)] text-xs font-semibold hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Trade on Polymarket &rarr;
              </a>
            </div>

            {/* Swipe Hints */}
            <div className="flex justify-between items-center pt-2 pb-1">
              <div className="flex items-center gap-2 text-[var(--accent-red)]/60">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="text-xs font-medium">Pass</span>
              </div>
              <div className="text-[var(--text-muted)]/40 text-xs">swipe to decide</div>
              <div className="flex items-center gap-2 text-[var(--accent-green)]/60">
                <span className="text-xs font-medium">Interested</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
