import { Market } from "@/types/market";

export function getYesPrice(market: Market): number {
  try {
    const prices: string[] = JSON.parse(market.outcomePrices);
    return parseFloat(prices[0]) || 0.5;
  } catch {
    return 0.5;
  }
}

export function getNoPrice(market: Market): number {
  try {
    const prices: string[] = JSON.parse(market.outcomePrices);
    return parseFloat(prices[1]) || 0.5;
  } catch {
    return 0.5;
  }
}

export function formatVolume(volume: number): string {
  if (volume >= 1_000_000) return `$${(volume / 1_000_000).toFixed(1)}M`;
  if (volume >= 1_000) return `$${(volume / 1_000).toFixed(1)}K`;
  return `$${volume.toFixed(0)}`;
}

export function formatEndDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Ended";
  if (diffDays === 0) return "Ends today";
  if (diffDays === 1) return "Ends tomorrow";
  if (diffDays <= 7) return `${diffDays}d left`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}w left`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getEventSlug(market: Market): string {
  if (market.events?.[0]?.slug) {
    return market.events[0].slug;
  }
  return market.slug;
}
