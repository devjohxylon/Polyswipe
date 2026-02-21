import { NextRequest, NextResponse } from "next/server";

const GAMMA_API = "https://gamma-api.polymarket.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const offset = searchParams.get("offset") || "0";
  const limit = searchParams.get("limit") || "20";

  const params = new URLSearchParams({
    limit,
    offset,
    active: "true",
    closed: "false",
    order: "volume",
    ascending: "false",
  });

  try {
    const res = await fetch(`${GAMMA_API}/markets?${params.toString()}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream API error: ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();

    const seen = new Set<string>();
    const markets = (Array.isArray(data) ? data : []).filter(
      (m: Record<string, unknown>) => {
        if (!m.question || !m.outcomePrices || !m.active || m.closed) return false;
        const id = String(m.id || m.conditionId);
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      }
    );

    return NextResponse.json({ markets });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 }
    );
  }
}
