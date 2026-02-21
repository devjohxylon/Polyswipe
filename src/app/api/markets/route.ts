import { NextRequest, NextResponse } from "next/server";

const GAMMA_API = "https://gamma-api.polymarket.com";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor") || "";
  const limit = searchParams.get("limit") || "20";

  const params = new URLSearchParams({
    limit,
    active: "true",
    closed: "false",
    order: "volume",
    ascending: "false",
  });

  if (cursor) {
    params.set("next_cursor", cursor);
  }

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
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 }
    );
  }
}
