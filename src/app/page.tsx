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
    <main style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Header
        watchlistCount={watchlist.length}
        onToggleWatchlist={() => setShowWatchlist(!showWatchlist)}
        showWatchlist={showWatchlist}
      />

      {/* Feed */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", paddingBottom: 32 }}>
          {loading ? (
            <div style={{ paddingTop: 8 }}>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} style={{ padding: "8px 12px" }}>
                  <div
                    style={{
                      borderRadius: 20,
                      border: "1px solid var(--bd)",
                      overflow: "hidden",
                      background: "var(--bg-card)",
                    }}
                  >
                    <div className="shimmer" style={{ width: "100%", height: 220 }} />
                    <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                      <div className="shimmer" style={{ height: 10, width: "60%", borderRadius: 6 }} />
                      <div className="shimmer" style={{ height: 5, width: "100%", borderRadius: 999 }} />
                      <div style={{ display: "flex", gap: 10 }}>
                        <div className="shimmer" style={{ flex: 1, height: 56, borderRadius: 14 }} />
                        <div className="shimmer" style={{ flex: 1, height: 56, borderRadius: 14 }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : markets.length > 0 ? (
            <div style={{ paddingTop: 8 }}>
              {markets.map((market) => (
                <MarketCard
                  key={market.id || market.conditionId}
                  market={market}
                  onSave={toggleSave}
                  isSaved={savedIds.has(market.id || market.conditionId)}
                />
              ))}

              <div ref={sentinelRef} style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0" }}>
                {hasMore && <div className="spinner" />}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 120,
                color: "var(--t3)",
              }}
            >
              <p style={{ fontSize: 14, marginBottom: 16 }}>No markets found.</p>
              <button
                onClick={() => {
                  setMarkets([]);
                  setOffset(0);
                  setHasMore(true);
                  setLoading(true);
                  seenIdsRef.current.clear();
                  fetchMarkets(0);
                }}
                style={{
                  padding: "8px 20px",
                  borderRadius: 10,
                  background: "var(--blue)",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 14,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

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
