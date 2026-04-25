/**
 * Agent marketplace — browse, hire, and manage agents.
 */

import type { CredExClient } from './client';
import type {
  Agent,
  ListAgentsParams,
  HireAgentParams,
  HireResponse,
  Job,
  ReputationProfile,
  LeaderboardEntry,
  RegisterAgentParams,
} from './types/marketplace';
import { OrderbookStream } from './exchange';

export class MarketplaceModule {
  constructor(private client: CredExClient) {}

  /** List available agents on the marketplace. */
  async listAgents(params: ListAgentsParams = {}): Promise<Agent[]> {
    return this.client.get<Agent[]>('/agents', {
      tier: params.tier,
      model_type: params.modelType,
    });
  }

  /** Get details for a specific agent. */
  async getAgent(agentId: number): Promise<Agent> {
    return this.client.get<Agent>(`/agents/${agentId}`);
  }

  /** Hire an agent to perform a task. */
  async hireAgent(params: HireAgentParams): Promise<HireResponse> {
    return this.client.post<HireResponse>('/hire', {
      agent_id: params.agentId,
      description: params.task,
      max_cost: params.maxCost,
    });
  }

  /** Get the status of a job. */
  async getJob(jobId: number): Promise<Job> {
    return this.client.get<Job>(`/jobs/${jobId}`);
  }

  /** List the authenticated user's submitted tasks. */
  async getMyTasks(): Promise<Job[]> {
    return this.client.get<Job[]>('/hire/my-tasks');
  }

  /** Get an agent's reputation profile. */
  async getReputation(agentId: number): Promise<ReputationProfile> {
    return this.client.get<ReputationProfile>(`/reputation/agents/${agentId}/reputation`);
  }

  /** Leave a review for an agent after a completed job. */
  async leaveReview(params: {
    agentId: number;
    jobId: number;
    rating: number;
    comment?: string;
  }): Promise<Record<string, unknown>> {
    return this.client.post(`/reputation/agents/${params.agentId}/reviews`, {
      job_id: params.jobId,
      rating: params.rating,
      comment: params.comment ?? '',
    });
  }

  /** Get the agent reputation leaderboard. */
  async getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
    return this.client.get<LeaderboardEntry[]>('/reputation/leaderboard', { limit });
  }

  /** Register a new agent on the marketplace. */
  async registerAgent(params: RegisterAgentParams): Promise<Agent> {
    return this.client.post<Agent>('/agents', {
      name: params.name,
      model_type: params.modelType,
      hourly_rate: params.hourlyRate,
      description: params.description ?? '',
      capabilities: params.capabilities ?? '',
      endpoint_url: params.endpointUrl ?? '',
    });
  }

  /** Stream job updates via WebSocket. */
  streamJob(jobId: number): OrderbookStream {
    const wsUrl = this.client.getWsUrl(`/jobs/${jobId}`);
    return new OrderbookStream(wsUrl);
  }
}
