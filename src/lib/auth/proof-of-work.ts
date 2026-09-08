import { solveInline } from './pow-core';
import type { LoginChallengeSolution } from '@/auth/types';

/**
 * spec 015 R7 / dashboard-integration §5 — solve a `CHALLENGE_REQUIRED`
 * challenge: find a `nonce` such that SHA-256(seed + nonce) has
 * `difficultyBits` leading zero bits. Runs in a Web Worker so the sign-in
 * screen does not freeze; falls back to an inline search where `Worker` is
 * unavailable (old embedded browsers, some test environments).
 *
 * `NEVER gates a first request` — only a resubmission after the server has
 * already returned `CHALLENGE_REQUIRED`. At the default 18 bits this is a
 * fraction of a second on a laptop and materially expensive to run thousands
 * of times, which is the whole point.
 */
export async function solveChallenge(challenge: {
  seed: string;
  difficultyBits: number;
}): Promise<LoginChallengeSolution> {
  const { seed, difficultyBits } = challenge;
  if (difficultyBits <= 0) {
    return { seed, nonce: '0' };
  }

  if (typeof Worker === 'undefined') {
    return { seed, nonce: await solveInline(seed, difficultyBits) };
  }

  const worker = new Worker(new URL('./pow.worker.ts', import.meta.url), { type: 'module' });
  try {
    const nonce = await new Promise<string>((resolve, reject) => {
      worker.onmessage = (e: MessageEvent<{ nonce: string }>) => resolve(e.data.nonce);
      worker.onerror = (e) => reject(new Error(e.message || 'proof-of-work worker failed'));
      worker.postMessage({ seed, difficultyBits });
    });
    return { seed, nonce };
  } finally {
    worker.terminate();
  }
}
