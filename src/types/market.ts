export interface MarketToken {
  token_id: string;
  outcome: string;
  price: number;
  winner: boolean;
}

export interface Market {
  id: string;
  condition_id: string;
  question: string;
  description: string;
  image: string;
  icon: string;
  end_date_iso: string;
  tokens: MarketToken[];
  volume: number;
  volume_num: number;
  liquidity: number;
  active: boolean;
  closed: boolean;
  category: string;
  slug: string;
}

export interface PolymarketResponse {
  data: Market[];
  next_cursor: string;
}

export type SwipeDirection = "left" | "right" | "up";
