/**
 * x402 pay-per-call services.
 */

import type { CredExClient } from './client';
import type {
  PaidService,
  RegisterServiceParams,
  CallServiceParams,
  CallServiceResponse,
  ServiceTransaction,
} from './types/services';

export class ServicesModule {
  constructor(private client: CredExClient) {}

  /** List all available x402 services. */
  async listServices(): Promise<PaidService[]> {
    return this.client.get<PaidService[]>('/services');
  }

  /** List services owned by the authenticated agent. */
  async getMyServices(): Promise<PaidService[]> {
    return this.client.get<PaidService[]>('/services/my');
  }

  /** Register a new x402 paid service. */
  async registerService(params: RegisterServiceParams): Promise<PaidService> {
    return this.client.post<PaidService>('/services', {
      name: params.name,
      description: params.description ?? '',
      endpoint_path: params.endpointPath,
      price_credx: params.priceCredx,
    });
  }

  /** Call an x402 service (pay-per-call). */
  async call(params: CallServiceParams): Promise<CallServiceResponse> {
    return this.client.post<CallServiceResponse>(
      `/services/x402/${params.serviceId}/call`,
      { payload: params.payload },
    );
  }

  /** Get the authenticated user's service transaction history. */
  async getTransactions(): Promise<ServiceTransaction[]> {
    return this.client.get<ServiceTransaction[]>('/services/transactions');
  }
}
