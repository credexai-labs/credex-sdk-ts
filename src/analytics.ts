/**
 * Analytics — benchmarks, indices, and platform metrics.
 */

import type { CredExClient } from './client';

export interface ComputeIndex {
  symbol: string;
  name: string;
  value: number;
  change24h: number;
  components: IndexComponent[];
}

export interface IndexComponent {
  provider: string;
  weight: number;
  price: number;
}

export interface IndexSnapshot {
  timestamp: string;
  value: number;
}

export interface PriceFeedEntry {
  creditType: string;
  price: number;
  volume24h: number;
  change24h: number;
}

export class AnalyticsModule {
  constructor(private client: CredExClient) {}

  /** Get a compute cost index (e.g. 'CRAI-50', 'CRAI-LLM', 'CRAI-FAST'). */
  async getIndex(symbol: string): Promise<ComputeIndex> {
    return this.client.get<ComputeIndex>(`/indices/${symbol}`);
  }

  /** List all active credit indices. */
  async listIndices(): Promise<ComputeIndex[]> {
    return this.client.get<ComputeIndex[]>('/indices');
  }

  /** Get historical index snapshots. */
  async getIndexHistory(symbol: string, period = '7d'): Promise<IndexSnapshot[]> {
    return this.client.get<IndexSnapshot[]>(`/indices/${symbol}/history`, { period });
  }

  /** Get platform-wide analytics. */
  async getPlatformStats(): Promise<Record<string, unknown>> {
    return this.client.get('/analytics/platform');
  }

  /** Get current price feed for credit types. */
  async getPriceFeed(creditType?: string): Promise<PriceFeedEntry[]> {
    return this.client.get<PriceFeedEntry[]>('/price-feed/prices', {
      credit_type: creditType,
    });
  }
}
