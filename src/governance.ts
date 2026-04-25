/**
 * Governance — proposals, voting, and CREDX balance.
 */

import type { CredExClient } from './client';

export interface Balance {
  balance: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: number;
  amount: number;
  txType: string;
  description: string;
  createdAt: string;
}

export interface Supply {
  totalSupply: number;
  circulatingSupply: number;
  stakedSupply: number;
}

export interface Proposal {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  createdAt: string;
}

export class GovernanceModule {
  constructor(private client: CredExClient) {}

  /** Get the authenticated user's CREDX balance and transaction history. */
  async getBalance(): Promise<Balance> {
    return this.client.get<Balance>('/governance/balance');
  }

  /** Get total CREDX supply and distribution stats. */
  async getSupply(): Promise<Supply> {
    return this.client.get<Supply>('/governance/supply');
  }

  /** List governance proposals. */
  async listProposals(): Promise<Proposal[]> {
    return this.client.get<Proposal[]>('/governance/proposals');
  }

  /** Get proposal detail with vote tally. */
  async getProposal(proposalId: number): Promise<Proposal> {
    return this.client.get<Proposal>(`/governance/proposals/${proposalId}`);
  }

  /** Create a governance proposal (requires min 100 CREDX). */
  async createProposal(params: {
    title: string;
    description: string;
    category?: string;
  }): Promise<Proposal> {
    return this.client.post<Proposal>('/governance/proposals', {
      title: params.title,
      description: params.description,
      category: params.category ?? 'general',
    });
  }

  /** Cast a vote on a proposal. */
  async vote(proposalId: number, params: {
    decision: 'for' | 'against' | 'abstain';
    reason?: string;
  }): Promise<Record<string, unknown>> {
    return this.client.post(`/governance/proposals/${proposalId}/vote`, {
      decision: params.decision,
      reason: params.reason ?? '',
    });
  }
}
