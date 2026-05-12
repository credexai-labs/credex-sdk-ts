/**
 * Hedge compute costs using derivatives on CredEx.
 */

import { CredExClient } from '../src';

async function main() {
  const client = new CredExClient({ apiKey: process.env.CREDEX_API_KEY });

  // Check current compute cost index
  const index = await client.analytics.getIndex('CRAI-50');
  console.log(`CRAI-50 index: ${index.value}`);

  // List OpenAI futures contracts
  const futures = await client.derivatives.listFutures({ provider: 'openai' });
  for (const f of futures) {
    console.log(`  ${f.symbol} — Expiry: ${f.expiry} — Price: ${f.price} CREDX`);
  }

  // Open a long position to hedge against rising compute costs
  if (futures.length > 0) {
    const position = await client.derivatives.openPosition({
      contractId: futures[0].id,
      side: 'long',
      size: 1000,
      leverage: 5,
    });
    console.log(`Position opened: #${position.id} — ${position.side} ${position.size} @ ${position.entryPrice}`);
  }

  // Check lending rates
  const rate = await client.lending.getRate();
  console.log(`Lending APR: ${rate.apr}% (${rate.tier} tier)`);
}

main().catch(console.error);
