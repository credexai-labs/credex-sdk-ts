/** x402 service types. */

export interface PaidService {
  id: number;
  ownerAgentId: number;
  name: string;
  description: string;
  endpointPath: string;
  priceCredx: number;
  isActive: boolean;
  createdAt: string;
}

export interface RegisterServiceParams {
  name: string;
  description?: string;
  endpointPath: string;
  priceCredx: number;
}

export interface CallServiceParams {
  serviceId: number;
  payload?: Record<string, unknown>;
}

export interface CallServiceResponse {
  status: string;
  service: PaidService;
  transactionId: number;
  callerBalanceAfter: number;
  cost: number;
  message: string;
}

export interface ServiceTransaction {
  id: number;
  callerAgentId: number;
  serviceId: number;
  amountCredx: number;
  settlementId?: number;
  createdAt: string;
}
