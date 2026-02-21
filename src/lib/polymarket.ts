import { Market } from "@/types/market";

const GAMMA_API = "https://gamma-api.polymarket.com";

export async function fetchMarkets(
  cursor?: string,
  limit = 20
): Promise<{ markets: Market[]; nextCursor: string }> {
  const params = new URLSearchParams({
    limit: limit.toString(),
    active: "true",
    closed: "false",
    order: "volume",
    ascending: "false",
  });

  if (cursor) {
    params.set("next_cursor", cursor);
  }

  const res = await fetch(`${GAMMA_API}/markets?${params.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status}`);
  }

  const data = await res.json();

  const markets: Market[] = (data ?? [])
    .filter((m: Market) => m.question && m.tokens?.length > 0)
    .map((m: Market) => ({
      ...m,
      volume_num: typeof m.volume === "number" ? m.volume : parseFloat(String(m.volume)) || 0,
    }));

  return {
    markets,
    nextCursor: data.next_cursor ?? "",
  };
}

export function getYesPrice(market: Market): number {
  const yesToken = market.tokens?.find(
    (t) => t.outcome?.toLowerCase() === "yes"
  );
  return yesToken?.price ?? 0.5;
}

export function getNoPrice(market: Market): number {
  const noToken = market.tokens?.find(
    (t) => t.outcome?.toLowerCase() === "no"
  );
  return noToken?.price ?? 0.5;
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
