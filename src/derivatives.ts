/**
 * Derivatives — futures and options on AI compute credits.
 */

import type { CredExClient } from './client';
import type {
  FuturesContract,
  OptionsContract,
  ListFuturesParams,
  ListOptionsParams,
  OpenPositionParams,
  Position,
} from './types/derivatives';

export class DerivativesModule {
  constructor(private client: CredExClient) {}

  /** List available futures contracts. */
  async listFutures(params: ListFuturesParams = {}): Promise<FuturesContract[]> {
    return this.client.get<FuturesContract[]>('/derivatives/futures', {
      provider: params.provider,
    });
  }

  /** List available options contracts. */
  async listOptions(params: ListOptionsParams = {}): Promise<OptionsContract[]> {
    return this.client.get<OptionsContract[]>('/derivatives/options', {
      provider: params.provider,
    });
  }

  /** Get details for a specific derivatives contract. */
  async getContract(contractId: number): Promise<FuturesContract | OptionsContract> {
    return this.client.get(`/derivatives/contracts/${contractId}`);
  }

  /** Open a derivatives position. */
  async openPosition(params: OpenPositionParams): Promise<Position> {
    return this.client.post<Position>('/derivatives/positions', {
      contract_id: params.contractId,
      side: params.side,
      size: params.size,
      leverage: params.leverage ?? 1,
    });
  }

  /** Close an open derivatives position. */
  async closePosition(positionId: number): Promise<Position> {
    return this.client.post<Position>(`/derivatives/positions/${positionId}/close`);
  }

  /** List the authenticated user's open positions. */
  async getPositions(): Promise<Position[]> {
    return this.client.get<Position[]>('/derivatives/positions');
  }
}
