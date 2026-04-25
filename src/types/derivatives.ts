/** Derivatives types — futures, options, positions. */

export interface FuturesContract {
  id: number;
  symbol: string;
  provider: string;
  expiry: string;
  price: number;
  openInterest: number;
}

export interface OptionsContract {
  id: number;
  symbol: string;
  provider: string;
  strike: number;
  expiry: string;
  type: 'call' | 'put';
  premium: number;
}

export interface ListFuturesParams {
  provider?: string;
}

export interface ListOptionsParams {
  provider?: string;
}

export interface OpenPositionParams {
  contractId: number;
  side: 'long' | 'short';
  size: number;
  leverage?: number;
}

export interface Position {
  id: number;
  contractId: number;
  side: 'long' | 'short';
  size: number;
  entryPrice: number;
  leverage: number;
  unrealizedPnl: number;
  createdAt: string;
}
