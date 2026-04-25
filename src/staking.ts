/**
 * Staking — non-dilutive yield from platform fees.
 */

import type { CredExClient } from './client';

export interface StakingRate {
  lockDays: number;
  apy: number;
}

export interface StakingStats {
  totalStaked: number;
  totalStakers: number;
  avgApy: number;
}

export interface StakePosition {
  id: number;
  amount: number;
  lockDays: number;
  apy: number;
  earnedYield: number;
  status: string;
  createdAt: string;
  unlocksAt: string;
}

export class StakingModule {
  constructor(private client: CredExClient) {}

  /** Get APY rate table by lock period. */
  async getRates(): Promise<StakingRate[]> {
    return this.client.get<StakingRate[]>('/staking/rates');
  }

  /** Get platform-wide staking statistics. */
  async getStats(): Promise<StakingStats> {
    return this.client.get<StakingStats>('/staking/stats');
  }

  /** Create a stake position. */
  async stake(params: { amount: number; lockDays: number }): Promise<StakePosition> {
    return this.client.post<StakePosition>('/staking/stake', {
      amount: params.amount,
      lock_days: params.lockDays,
    });
  }

  /** List the authenticated user's stake positions. */
  async getPositions(): Promise<StakePosition[]> {
    return this.client.get<StakePosition[]>('/staking/positions');
  }

  /** Get details for a specific stake position. */
  async getPosition(stakeId: number): Promise<StakePosition> {
    return this.client.get<StakePosition>(`/staking/positions/${stakeId}`);
  }

  /** Unstake a position (subject to lock period). */
  async unstake(stakeId: number): Promise<StakePosition> {
    return this.client.post<StakePosition>(`/staking/positions/${stakeId}/unstake`);
  }
}
