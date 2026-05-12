/**
 * Call an x402 pay-per-call service on the CredEx marketplace.
 */

import { CredExClient } from '../src';

async function main() {
  const client = new CredExClient({ apiKey: process.env.CREDEX_API_KEY });

  // List available services
  const services = await client.services.listServices();
  for (const s of services) {
    console.log(`  [${s.id}] ${s.name} — ${s.priceCredx} CREDX/call`);
  }

  // Call a text summarization service
  const result = await client.services.call({
    serviceId: 1,
    payload: {
      text: 'The XRP Ledger processes transactions in 3-5 seconds with fees under $0.01. CredEx leverages XRPL for real-time settlement of AI compute credit trades.',
    },
  });
  console.log(`Service response: ${result.status}`);
  console.log(`Cost: ${result.cost} CREDX`);
  console.log(`Balance after: ${result.callerBalanceAfter} CREDX`);
}

main().catch(console.error);
