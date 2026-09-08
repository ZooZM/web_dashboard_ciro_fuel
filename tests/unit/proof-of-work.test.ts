import { describe, expect, it, beforeAll } from 'vitest';
import { webcrypto } from 'node:crypto';
import { leadingZeroBitsOfDigest, solveInline } from '@/lib/auth/pow-core';
import { solveChallenge } from '@/lib/auth/proof-of-work';

// jsdom does not ship WebCrypto subtle — use Node's.
beforeAll(() => {
  if (!globalThis.crypto?.subtle) {
    // @ts-expect-error test shim
    globalThis.crypto = webcrypto;
  }
});

/**
 * spec 015 US3 T085 — the proof-of-work solves a known seed at a known
 * difficulty and returns a nonce the same algorithm verifies.
 */
describe('proof-of-work (spec 015 R7)', () => {
  it('leadingZeroBitsOfDigest counts leading zero bits of a digest', () => {
    expect(leadingZeroBitsOfDigest(new Uint8Array([0xff]))).toBe(0);
    expect(leadingZeroBitsOfDigest(new Uint8Array([0x7f]))).toBe(1);
    expect(leadingZeroBitsOfDigest(new Uint8Array([0x00, 0xff]))).toBe(8);
    expect(leadingZeroBitsOfDigest(new Uint8Array([0x00, 0x1f]))).toBe(11);
  });

  it('solveInline finds a nonce that actually satisfies the difficulty', async () => {
    const seed = 'a1b2c3d4e5f6';
    const bits = 10;
    const nonce = await solveInline(seed, bits);

    const digest = new Uint8Array(
      await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${seed}${nonce}`)),
    );
    expect(leadingZeroBitsOfDigest(digest)).toBeGreaterThanOrEqual(bits);
  });

  it('solveChallenge short-circuits difficulty 0 to nonce "0"', async () => {
    const { seed, nonce } = await solveChallenge({ seed: 'deadbeef', difficultyBits: 0 });
    expect(seed).toBe('deadbeef');
    expect(nonce).toBe('0');
  });
});
