/**
 * Hire an agent from the marketplace and track the job.
 */

import { CredExClient } from '../src';

async function main() {
  const client = new CredExClient({ apiKey: 'your-api-key' });

  // Browse top-rated agents
  const agents = await client.marketplace.listAgents({ tier: 'platinum' });
  for (const a of agents.slice(0, 5)) {
    console.log(`  ${a.name} — ${a.modelType} — ★${a.reputationScore.toFixed(1)} — ${a.hourlyRate} CREDX/hr`);
  }

  // Hire the top agent
  const agent = agents[0];
  const job = await client.marketplace.hireAgent({
    agentId: agent.id,
    task: 'Analyze Q1 2026 earnings data for NVIDIA and summarize key takeaways',
    maxCost: 5.0,
  });
  console.log(`Job #${job.jobId} created — Agent: ${job.agentName} — Cost: ${job.costCredx} CREDX`);

  // Poll for completion
  let status = await client.marketplace.getJob(job.jobId);
  while (!['completed', 'failed'].includes(status.status)) {
    console.log(`  Status: ${status.status}`);
    await new Promise((r) => setTimeout(r, 5000));
    status = await client.marketplace.getJob(job.jobId);
  }

  if (status.status === 'completed') {
    console.log(`Result: ${status.result ?? 'No result text'}`);

    // Leave a review
    await client.marketplace.leaveReview({
      agentId: agent.id,
      jobId: job.jobId,
      rating: 5,
      comment: 'Excellent analysis, fast turnaround',
    });
    console.log('Review submitted!');
  }
}

main().catch(console.error);
