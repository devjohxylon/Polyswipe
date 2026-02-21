"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Market, SwipeDirection } from "@/types/market";
import SwipeCard from "@/components/SwipeCard";
import ActionButtons from "@/components/ActionButtons";
import Header from "@/components/Header";
import WatchlistPanel from "@/components/WatchlistPanel";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import Toast from "@/components/Toast";

interface ToastState {
  message: string;
  type: "yes" | "no" | "star";
  visible: boolean;
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [watchlist, setWatchlist] = useState<Market[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<string>("");
  const [toast, setToast] = useState<ToastState>({ message: "", type: "yes", visible: false });
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, type: "yes" | "no" | "star") => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ message, type, visible: true });
    toastTimeout.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 1500);
  }, []);

  const fetchMarkets = useCallback(async (nextCursor?: string) => {
    try {
      const params = new URLSearchParams({ limit: "20" });
      if (nextCursor) params.set("cursor", nextCursor);

      const res = await fetch(`/api/markets?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const newMarkets = (data ?? []).filter(
        (m: Market) => m.question && m.tokens?.length > 0
      );

      setMarkets((prev) => [...prev, ...newMarkets]);
      setCursor(data.next_cursor ?? "");
    } catch (err) {
      console.error("Failed to fetch markets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  // Prefetch more when running low
  useEffect(() => {
    if (markets.length > 0 && currentIndex >= markets.length - 5 && cursor) {
      fetchMarkets(cursor);
    }
  }, [currentIndex, markets.length, cursor, fetchMarkets]);

  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      const market = markets[currentIndex];
      if (!market) return;

      if (direction === "right") {
        showToast("Interested!", "yes");
        // Open polymarket in a new tab
        window.open(`https://polymarket.com/event/${market.slug}`, "_blank");
      } else if (direction === "left") {
        showToast("Passed", "no");
      } else if (direction === "up") {
        // Super like = add to watchlist
        if (!watchlist.find((m) => (m.id || m.condition_id) === (market.id || market.condition_id))) {
          setWatchlist((prev) => [market, ...prev]);
          showToast("Added to Watchlist!", "star");
        }
      }

      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 200);
    },
    [currentIndex, markets, watchlist, showToast]
  );

  const handlePass = useCallback(() => handleSwipe("left"), [handleSwipe]);
  const handleInterested = useCallback(() => handleSwipe("right"), [handleSwipe]);
  const handleSuperLike = useCallback(() => handleSwipe("up"), [handleSwipe]);

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((m) => (m.id || m.condition_id) !== id));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showWatchlist) {
        if (e.key === "Escape") setShowWatchlist(false);
        return;
      }
      switch (e.key) {
        case "ArrowLeft":
          handlePass();
          break;
        case "ArrowRight":
          handleInterested();
          break;
        case "ArrowUp":
          handleSuperLike();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePass, handleInterested, handleSuperLike, showWatchlist]);

  const visibleMarkets = markets.slice(currentIndex, currentIndex + 2);

  return (
    <main className="h-[100dvh] flex flex-col bg-[var(--bg-primary)]">
      <Header
        watchlistCount={watchlist.length}
        onToggleWatchlist={() => setShowWatchlist(!showWatchlist)}
        showWatchlist={showWatchlist}
      />

      {/* Card Stack */}
      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <LoadingSkeleton />
        ) : visibleMarkets.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {visibleMarkets.map((market, i) => (
              <SwipeCard
                key={market.id || market.condition_id || currentIndex + i}
                market={market}
                onSwipe={handleSwipe}
                isTop={i === 0}
              />
            ))}
          </AnimatePresence>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] px-8">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-2">
              You&apos;ve seen them all!
            </h3>
            <p className="text-center text-sm mb-6">
              You&apos;ve swiped through all available markets. Check back later for new ones.
            </p>
            <button
              onClick={() => {
                setMarkets([]);
                setCurrentIndex(0);
                setCursor("");
                setLoading(true);
                fetchMarkets();
              }}
              className="px-6 py-2.5 rounded-full bg-[var(--accent-purple)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Refresh Markets
            </button>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {visibleMarkets.length > 0 && (
        <div className="bg-[var(--bg-primary)]/80 backdrop-blur-md border-t border-[var(--border)]">
          <ActionButtons
            onPass={handlePass}
            onInterested={handleInterested}
            onSuperLike={handleSuperLike}
          />
          {/* Keyboard hints */}
          <div className="flex justify-center gap-6 pb-3 text-[10px] text-[var(--text-muted)]/40">
            <span>← Pass</span>
            <span>↑ Watchlist</span>
            <span>→ Interested</span>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      {/* Watchlist Panel */}
      <AnimatePresence>
        {showWatchlist && (
          <WatchlistPanel
            markets={watchlist}
            onClose={() => setShowWatchlist(false)}
            onRemove={removeFromWatchlist}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
