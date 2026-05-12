/**
 * Stream real-time order book updates via WebSocket.
 */

import { CredExClient } from '../src';

const client = new CredExClient({ apiKey: process.env.CREDEX_API_KEY });

// Stream order book updates for OpenAI credits
const stream = client.exchange.streamOrderbook('openai');

stream.on('update', (update) => {
  console.log(`${update.side} ${update.size} @ ${update.price} CREDX`);
});

stream.on('trade', (trade) => {
  console.log(`Trade: ${trade.amount} credits @ ${trade.price} CREDX`);
});

stream.on('error', (err) => {
  console.error('WebSocket error:', err);
});

stream.on('close', () => {
  console.log('Connection closed');
});

// Close after 60 seconds
setTimeout(() => {
  stream.close();
  console.log('Stream closed');
}, 60_000);
