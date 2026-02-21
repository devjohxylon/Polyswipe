export interface MarketEvent {
  id: string;
  slug: string;
  title: string;
}

export interface Market {
  id: string;
  conditionId: string;
  question: string;
  description: string;
  image: string;
  icon: string;
  slug: string;
  endDate: string;
  endDateIso: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  volumeNum: number;
  liquidity: string;
  liquidityNum: number;
  active: boolean;
  closed: boolean;
  groupItemTitle: string;
  events: MarketEvent[];
}

export type SwipeDirection = "left" | "right" | "up";
