// spec 015 R7 — shared pure helpers for the proof-of-work, importable from both the
// Web Worker and a unit test (a worker module cannot be imported directly by Vitest).

/** Leading zero BITS of a SHA-256 digest, byte by byte. */
export function leadingZeroBitsOfDigest(digest: Uint8Array): number {
  let bits = 0;
  for (const byte of digest) {
    if (byte === 0) {
      bits += 8;
      continue;
    }
    // Math.clz32 of a value in 1..255 is 24..31 → 0..7 zero bits inside the byte.
    bits += Math.clz32(byte) - 24;
    break;
  }
  return bits;
}

/** Same search as the worker, inline — the fallback when `Worker` is unavailable. */
export async function solveInline(seed: string, difficultyBits: number): Promise<string> {
  const enc = new TextEncoder();
  for (let n = 0; ; n++) {
    const digest = new Uint8Array(
      await crypto.subtle.digest('SHA-256', enc.encode(`${seed}${n}`)),
    );
    if (leadingZeroBitsOfDigest(digest) >= difficultyBits) {
      return String(n);
    }
  }
}
