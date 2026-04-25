/**
 * Lending — reputation-tiered credit lending.
 */

import type { CredExClient } from './client';

export interface LendingRate {
  apr: number;
  tier: string;
}

export interface LendingPool {
  id: number;
  creditType: string;
  totalLiquidity: number;
  utilizationRate: number;
  apr: number;
}

export interface Loan {
  id: number;
  poolId: number;
  amount: number;
  apr: number;
  status: string;
  createdAt: string;
}

export class LendingModule {
  constructor(private client: CredExClient) {}

  /** Get the current lending rate for the authenticated user's tier. */
  async getRate(): Promise<LendingRate> {
    return this.client.get<LendingRate>('/lending/rate');
  }

  /** List available lending pools. */
  async getPools(): Promise<LendingPool[]> {
    return this.client.get<LendingPool[]>('/lending/pools');
  }

  /** Borrow credits from a lending pool. */
  async borrow(params: { poolId: number; amount: number }): Promise<Loan> {
    return this.client.post<Loan>('/lending/borrow', {
      pool_id: params.poolId,
      amount: params.amount,
    });
  }

  /** Repay a loan. */
  async repay(params: { loanId: number; amount: number }): Promise<Loan> {
    return this.client.post<Loan>(`/lending/loans/${params.loanId}/repay`, {
      amount: params.amount,
    });
  }

  /** List the authenticated user's active loans. */
  async getLoans(): Promise<Loan[]> {
    return this.client.get<Loan[]>('/lending/loans');
  }
}
