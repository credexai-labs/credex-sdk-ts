/**
 * Credit exchange — order book, listings, and trades.
 */

import type { CredExClient } from './client';
import type {
  Orderbook,
  CreditType,
  Listing,
  Trade,
  PlaceOrderParams,
} from './types/exchange';

export class ExchangeModule {
  constructor(private client: CredExClient) {}

  /** Get the live order book for a credit type. */
  async getOrderbook(creditType: string): Promise<Orderbook> {
    return this.client.get<Orderbook>(`/exchange/orderbook/${creditType}`);
  }

  /** List all tradeable credit types with current prices. */
  async listCreditTypes(): Promise<CreditType[]> {
    return this.client.get<CreditType[]>('/exchange/credit-types');
  }

  /** Place a limit order on the exchange. */
  async placeOrder(params: PlaceOrderParams): Promise<Listing> {
    return this.client.post<Listing>('/listings', {
      credit_type: params.provider,
      side: params.side,
      quantity: params.amount,
      price_per_unit: params.price,
    });
  }

  /** Cancel an open listing. */
  async cancelOrder(listingId: number): Promise<void> {
    await this.client.delete(`/listings/${listingId}`);
  }

  /** Get recent trades, optionally filtered by credit type. */
  async getTrades(creditType?: string): Promise<Trade[]> {
    return this.client.get<Trade[]>('/trades', { credit_type: creditType });
  }

  /** Get the authenticated user's open listings. */
  async getMyListings(): Promise<Listing[]> {
    return this.client.get<Listing[]>('/listings/my');
  }

  /** Stream order book updates via WebSocket. Returns an EventEmitter-like object. */
  streamOrderbook(creditType: string): OrderbookStream {
    const wsUrl = this.client.getWsUrl(`/orderbook/${creditType}`);
    return new OrderbookStream(wsUrl);
  }
}

type StreamHandler = (data: Record<string, unknown>) => void;

export class OrderbookStream {
  private ws: import('ws') | WebSocket | null = null;
  private handlers: Record<string, StreamHandler[]> = {};

  constructor(private url: string) {
    this.connect();
  }

  private connect(): void {
    // Works in both Node.js (ws) and browser (native WebSocket)
    try {
      const WS = typeof WebSocket !== 'undefined' ? WebSocket : require('ws');
      this.ws = new WS(this.url);
      (this.ws as any).onmessage = (event: { data: string | Buffer }) => {
        try {
          const raw = event.data;
          const msg = JSON.parse(typeof raw === 'string' ? raw : String(raw));
          const type = msg.type ?? 'update';
          this.emit(type, msg);
        } catch { /* ignore parse errors */ }
      };
      (this.ws as any).onerror = (err: unknown) => this.emit('error', { error: err });
      (this.ws as any).onclose = () => this.emit('close', {});
    } catch {
      // WebSocket not available
    }
  }

  on(event: string, handler: StreamHandler): this {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
    return this;
  }

  private emit(event: string, data: Record<string, unknown>): void {
    for (const handler of this.handlers[event] ?? []) {
      handler(data);
    }
  }

  close(): void {
    if (this.ws) (this.ws as any).close();
  }
}
