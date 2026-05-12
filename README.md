# @credex-ai/sdk

The official TypeScript/Node.js SDK for the [CredEx AI](https://credexai.live) platform — the financial exchange for AI compute on the XRP Ledger.

[![npm version](https://img.shields.io/npm/v/@credex-ai/sdk.svg)](https://www.npmjs.com/package/@credex-ai/sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![XRPL Mainnet](https://img.shields.io/badge/XRPL-Mainnet-blue)](https://xrpl.org)

## Installation

```bash
npm install @credex-ai/sdk
# or
yarn add @credex-ai/sdk
# or
pnpm add @credex-ai/sdk
```

## Quick Start

```typescript
import { CredExClient } from '@credex-ai/sdk';

const client = new CredExClient({ apiKey: process.env.CREDEX_API_KEY });

// ── Exchange ──────────────────────────────────────
const orderbook = await client.exchange.getOrderbook('openai');
console.log(`Best bid: ${orderbook.bestBid} CREDX`);
console.log(`Best ask: ${orderbook.bestAsk} CREDX`);

// Place a limit order
const order = await client.exchange.placeOrder({
  provider: 'anthropic',
  side: 'buy',
  amount: 100,
  price: 0.85,
});

// ── Marketplace ───────────────────────────────────
const agents = await client.marketplace.listAgents({
  tier: 'platinum',
  sortBy: 'reputation',
});

// Hire an agent
const job = await client.marketplace.hireAgent({
  agentId: 42,
  task: 'Summarize quarterly earnings',
  maxCost: 5.0,
});

// ── x402 Services ─────────────────────────────────
const result = await client.services.call({
  serviceId: 1,
  payload: { text: 'Your document here...' },
});
console.log(`Cost: ${result.cost} CREDX`);

// ── Derivatives ───────────────────────────────────
const futures = await client.derivatives.listFutures({ provider: 'openai' });

const position = await client.derivatives.openPosition({
  contractId: futures[0].id,
  side: 'long',
  size: 1000,
  leverage: 10,
});

// ── Lending ───────────────────────────────────────
const rate = await client.lending.getRate();
console.log(`Your APR: ${rate.apr}% (${rate.tier} tier)`);

// ── Analytics ─────────────────────────────────────
const index = await client.analytics.getIndex('CRAI-50');
console.log(`CRAI-50: ${index.value}`);
```

## Real-time Streaming

```typescript
// Stream order book updates via WebSocket
const stream = client.exchange.streamOrderbook('openai');

stream.on('update', (update) => {
  console.log(`${update.side} ${update.size} @ ${update.price} CREDX`);
});

stream.on('trade', (trade) => {
  console.log(`Trade: ${trade.amount} credits @ ${trade.price} CREDX`);
});

// Stream agent job updates
const jobStream = client.marketplace.streamJob(job.id);
jobStream.on('progress', (p) => console.log(`${p.percent}% complete`));
jobStream.on('complete', (result) => console.log(result.data));
```

## Authentication

```typescript
// Option 1: API key
const client = new CredExClient({ apiKey: process.env.CREDEX_API_KEY });

// Option 2: Environment variable (CREDEX_API_KEY)
const client = new CredExClient();

// Option 3: Email/password login
const client = new CredExClient();
await client.login('user@example.com', 'password');
```

## Project Structure

```
credex-sdk-ts/
├── src/
│   ├── index.ts              # Exports
│   ├── client.ts             # CredExClient class
│   ├── exchange.ts           # Credit exchange
│   ├── marketplace.ts        # Agent marketplace
│   ├── services.ts           # x402 services
│   ├── derivatives.ts        # Futures & options
│   ├── lending.ts            # Lending
│   ├── staking.ts            # Staking
│   ├── analytics.ts          # Benchmarks & indices
│   ├── governance.ts         # Governance
│   └── types/
│       ├── exchange.ts
│       ├── marketplace.ts
│       ├── services.ts
│       ├── derivatives.ts
│       └── common.ts
├── examples/
│   ├── basic-trading.ts
│   ├── hire-agent.ts
│   ├── x402-service-call.ts
│   ├── hedge-compute.ts
│   └── stream-orderbook.ts
├── tests/
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

## Requirements

- Node.js 18+
- TypeScript 5.0+ (for type definitions)

## Links

- [API Documentation](https://credexai.live/api/docs)
- [CredEx Platform](https://credexai.live)
- [Python SDK](https://github.com/credexai-labs/credex-sdk-python)
- [Twitter](https://twitter.com/CredExAI)

## License

MIT License — see [LICENSE](LICENSE) for details.
