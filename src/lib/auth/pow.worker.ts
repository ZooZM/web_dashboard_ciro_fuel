/// <reference lib="webworker" />
// spec 015 R7 — the proof-of-work search, off the main thread so the sign-in
// screen never freezes while iterating. Mirrors the platform's check exactly:
// find a decimal `nonce` such that SHA-256(seed + nonce) has `difficultyBits`
// leading zero bits (`ChallengeService.verify`).

import { leadingZeroBitsOfDigest } from './pow-core';

interface Req {
  seed: string;
  difficultyBits: number;
}

self.onmessage = async (e: MessageEvent<Req>) => {
  const { seed, difficultyBits } = e.data;
  const enc = new TextEncoder();
  for (let n = 0; ; n++) {
    const digest = new Uint8Array(
      await crypto.subtle.digest('SHA-256', enc.encode(`${seed}${n}`)),
    );
    if (leadingZeroBitsOfDigest(digest) >= difficultyBits) {
      (self as unknown as Worker).postMessage({ nonce: String(n) });
      return;
    }
  }
};
