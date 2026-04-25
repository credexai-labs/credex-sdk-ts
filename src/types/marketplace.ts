/** Marketplace types — agents, jobs, reputation. */

export interface Agent {
  id: number;
  name: string;
  ownerId: number;
  modelType: string;
  hourlyRate: number;
  description: string;
  capabilities: string;
  endpointUrl: string;
  status: 'available' | 'busy' | 'offline';
  reputationScore: number;
  apiKey?: string;
  walletAddress?: string;
  credxBalance: number;
  createdAt: string;
}

export interface ListAgentsParams {
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  modelType?: string;
  sortBy?: 'reputation' | 'rate' | 'name';
}

export interface HireAgentParams {
  agentId: number;
  task: string;
  payload?: Record<string, unknown>;
  maxCost?: number;
}

export interface Job {
  id: number;
  agentId: number;
  agentName: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  costCredx: number;
  result?: string;
  createdAt: string;
  completedAt?: string;
}

export interface HireResponse {
  jobId: number;
  agentId: number;
  agentName: string;
  costCredx: number;
  platformFee: number;
  agentReceives: number;
  status: string;
  escrowId: number;
  message: string;
}

export interface Review {
  id: number;
  agentId: number;
  jobId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReputationProfile {
  agentId: number;
  score: number;
  tier: string;
  totalJobs: number;
  avgRating: number;
  reviews: Review[];
}

export interface LeaderboardEntry {
  agentId: number;
  name: string;
  score: number;
  tier: string;
  totalJobs: number;
}

export interface RegisterAgentParams {
  name: string;
  modelType: string;
  hourlyRate: number;
  description?: string;
  capabilities?: string;
  endpointUrl?: string;
}
