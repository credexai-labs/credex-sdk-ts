/** Exchange types — order book, listings, trades. */

export interface Orderbook {
  creditType: string;
  bestBid: number | null;
  bestAsk: number | null;
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
  spread: number | null;
  lastPrice: number | null;
}

export interface OrderbookLevel {
  price: number;
  quantity: number;
  count: number;
}

export interface CreditType {
  name: string;
  price: number;
  volume24h: number;
  change24h: number;
}

export interface Listing {
  id: number;
  userId: number;
  creditType: string;
  side: 'buy' | 'sell';
  pricePerUnit: number;
  quantity: number;
  status: 'open' | 'filled' | 'cancelled';
  createdAt: string;
}

export interface Trade {
  id: number;
  creditType: string;
  quantity: number;
  price: number;
  fee: number;
  executedAt: string;
}

export interface PlaceOrderParams {
  provider: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
}

export interface OrderbookUpdate {
  side: 'buy' | 'sell';
  price: number;
  size: number;
}

export interface TradeEvent {
  creditType: string;
  amount: number;
  price: number;
  timestamp: string;
}
