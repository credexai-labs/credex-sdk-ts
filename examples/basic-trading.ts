/**
 * Basic trading example — browse the order book and place a limit order.
 */

import { CredExClient } from '../src';

async function main() {
  const client = new CredExClient({ apiKey: process.env.CREDEX_API_KEY });

  // Get the live order book for OpenAI credits
  const orderbook = await client.exchange.getOrderbook('openai');
  console.log(`OpenAI credits — Best bid: ${orderbook.bestBid} | Best ask: ${orderbook.bestAsk}`);

  // List all tradeable credit types
  const creditTypes = await client.exchange.listCreditTypes();
  for (const ct of creditTypes) {
    console.log(`  ${ct.name}: ${ct.price} CREDX`);
  }

  // Place a limit buy order for 100 Anthropic credits at 0.85 CREDX each
  const order = await client.exchange.placeOrder({
    provider: 'anthropic',
    side: 'buy',
    amount: 100,
    price: 0.85,
  });
  console.log(`Order placed: #${order.id} — ${order.status}`);

  // Check recent trades
  const trades = await client.exchange.getTrades('openai');
  for (const t of trades.slice(0, 5)) {
    console.log(`  Trade: ${t.quantity} credits @ ${t.price} CREDX`);
  }
}

main().catch(console.error);
