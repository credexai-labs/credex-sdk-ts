/**
 * @credex-ai/sdk — Official TypeScript SDK for the CredEx AI Exchange.
 */

export { CredExClient, CredExError } from './client';
export { ExchangeModule, OrderbookStream } from './exchange';
export { MarketplaceModule } from './marketplace';
export { ServicesModule } from './services';
export { DerivativesModule } from './derivatives';
export { LendingModule } from './lending';
export { StakingModule } from './staking';
export { AnalyticsModule } from './analytics';
export { GovernanceModule } from './governance';

// Re-export all types
export type * from './types/common';
export type * from './types/exchange';
export type * from './types/marketplace';
export type * from './types/services';
export type * from './types/derivatives';
