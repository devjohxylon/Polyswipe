"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Market } from "@/types/market";
import MarketCard from "@/components/MarketCard";
import Header from "@/components/Header";
import WatchlistPanel from "@/components/WatchlistPanel";
import Toast from "@/components/Toast";

interface ToastState {
  message: string;
  type: "yes" | "no" | "star";
  visible: boolean;
}

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [watchlist, setWatchlist] = useState<Market[]>([]);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState<ToastState>({ message: "", type: "yes", visible: false });
  const toastTimeout = useRef<NodeJS.Timeout | null>(null);
  const fetchingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const seenIdsRef = useRef(new Set<string>());

  const showToast = useCallback((message: string, type: "yes" | "no" | "star") => {
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    setToast({ message, type, visible: true });
    toastTimeout.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 1500);
  }, []);

  const fetchMarkets = useCallback(async (nextOffset: number) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    try {
      const params = new URLSearchParams({
        limit: "20",
        offset: nextOffset.toString(),
      });

      const res = await fetch(`/api/markets?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      const incoming: Market[] = data.markets ?? [];

      // Deduplicate across all batches
      const unique = incoming.filter((m) => {
        const id = m.id || m.conditionId;
        if (seenIdsRef.current.has(id)) return false;
        seenIdsRef.current.add(id);
        return true;
      });

      if (incoming.length === 0) {
        setHasMore(false);
      } else {
        if (unique.length > 0) {
          setMarkets((prev) => [...prev, ...unique]);
        }
        setOffset(nextOffset + incoming.length);
      }
    } catch (err) {
      console.error("Failed to fetch markets:", err);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    fetchMarkets(0);
  }, [fetchMarkets]);

  // Infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
          fetchMarkets(offset);
        }
      },
      { rootMargin: "300px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [offset, hasMore, fetchMarkets]);

  const savedIds = new Set(watchlist.map((m) => m.id || m.conditionId));

  const toggleSave = useCallback(
    (market: Market) => {
      const id = market.id || market.conditionId;
      if (savedIds.has(id)) {
        setWatchlist((prev) => prev.filter((m) => (m.id || m.conditionId) !== id));
        showToast("Removed", "no");
      } else {
        setWatchlist((prev) => [market, ...prev]);
        showToast("Saved to watchlist", "star");
      }
    },
    [savedIds, showToast]
  );

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((m) => (m.id || m.conditionId) !== id));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showWatchlist) setShowWatchlist(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showWatchlist]);

  return (
    <main className="h-[100dvh] flex flex-col bg-[var(--bg-primary)]">
      <Header
        watchlistCount={watchlist.length}
        onToggleWatchlist={() => setShowWatchlist(!showWatchlist)}
        showWatchlist={showWatchlist}
      />

      {/* Feed */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-lg mx-auto">
          {loading ? (
            <div className="py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="px-4 py-2">
                  <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden">
                    <div className="w-full h-40 animate-shimmer" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 w-full rounded animate-shimmer" />
                      <div className="h-5 w-3/4 rounded animate-shimmer" />
                      <div className="h-3.5 w-1/3 rounded animate-shimmer" />
                      <div className="flex gap-3 mt-2">
                        <div className="flex-1 h-12 rounded-lg animate-shimmer" />
                        <div className="flex-1 h-12 rounded-lg animate-shimmer" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : markets.length > 0 ? (
            <div className="py-2">
              {markets.map((market) => (
                <MarketCard
                  key={market.id || market.conditionId}
                  market={market}
                  onSave={toggleSave}
                  isSaved={savedIds.has(market.id || market.conditionId)}
                />
              ))}

              <div ref={sentinelRef} className="flex items-center justify-center py-8">
                {hasMore && <div className="feed-spinner" />}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[var(--text-muted)] px-8 pt-32">
              <p className="text-sm mb-4">No markets found.</p>
              <button
                onClick={() => {
                  setMarkets([]);
                  setOffset(0);
                  setHasMore(true);
                  setLoading(true);
                  seenIdsRef.current.clear();
                  fetchMarkets(0);
                }}
                className="px-4 py-2 rounded-lg bg-[var(--poly-blue)] text-white font-medium text-sm"
              >
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

      {/* Watchlist */}
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
