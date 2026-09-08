import { describe, expect, it } from 'vitest';
import {
  toE164Saudi,
  looksLikeE164,
  looksLikeSaudiMobile,
  normalizeSaudiMobile,
  isSaudiMobile,
} from '@/lib/auth/phone';

// The defect: every screen composing a Saudi number from a local `05…` validated it with
// the GENERIC `looksLikeE164` (8–15 digits, any country). `+96650000002` — one digit short
// — passed, was sent to `/auth/login/code/request`, and came back 202 like every other
// outcome (FR-015), so the administrator was moved on to the code screen to wait for an SMS
// the platform never had a reason to send. Redis's `login-otp:rate:+96650000002` counter is
// what proved it: the malformed string reached the server.
describe('Saudi mobile validation (composed numbers)', () => {
  it('accepts a real Saudi mobile in every local form the operator might type', () => {
    for (const input of ['0500000001', '500000001', '966500000001', '00966500000001']) {
      expect(looksLikeSaudiMobile(toE164Saudi(input))).toBe(true);
    }
  });

  it('rejects a dropped or extra digit that the generic E.164 check let through', () => {
    const short = '+96650000002'; // 8 digits after +9665 minus one — the number actually sent
    const long = '+9665000000012';
    expect(looksLikeE164(short)).toBe(true); // the hole
    expect(looksLikeE164(long)).toBe(true);
    expect(looksLikeSaudiMobile(short)).toBe(false);
    expect(looksLikeSaudiMobile(long)).toBe(false);
  });

  it('rejects a Saudi landline and a non-Saudi number', () => {
    expect(looksLikeSaudiMobile('+966112345678')).toBe(false); // 11… landline, not 5…
    expect(looksLikeSaudiMobile('+201001234567')).toBe(false);
  });
});

// The SECOND hole, in the five admin creation forms rather than the sign-in screens: each
// composed with `toE164Saudi` only when the operator had NOT typed a leading `+`, and
// validated a `+` number with the generic `looksLikeE164`. So a foreign number entered in
// full bypassed every Saudi check and was stored as a login identifier.
describe('normalizeSaudiMobile', () => {
  it('accepts every form an operator might type, and returns one canonical E.164 value', () => {
    for (const input of [
      '0500000001',
      '500000001',
      '966500000001',
      '00966500000001',
      '+966500000001',
      '+966 50 000 0001',
      '05 00 00 00 01',
      '(966) 500-000-001',
    ]) {
      expect(normalizeSaudiMobile(input)).toBe('+966500000001');
    }
  });

  it('refuses an explicit non-Saudi country code outright, never coercing it', () => {
    // This is the number the old pair accepted. `toE164Saudi` would have MANGLED it into
    // `+96612025550123` — plausible-looking, and nobody's real number.
    expect(looksLikeE164('+12025550123')).toBe(true); // the hole
    expect(toE164Saudi('+12025550123')).toBe('+96612025550123'); // the coercion
    expect(normalizeSaudiMobile('+12025550123')).toBeNull();
    expect(normalizeSaudiMobile('+201001234567')).toBeNull();
    expect(normalizeSaudiMobile('0020100123456')).toBeNull();
  });

  it('rejects a wrong-length subscriber number in any form', () => {
    expect(normalizeSaudiMobile('+96650000000')).toBeNull(); // one short
    expect(normalizeSaudiMobile('+9665000000012')).toBeNull(); // one long
    expect(normalizeSaudiMobile('050000000')).toBeNull();
  });

  it('rejects a Saudi landline, which is not a mobile', () => {
    expect(normalizeSaudiMobile('+966112345678')).toBeNull();
    expect(normalizeSaudiMobile('0112345678')).toBeNull();
  });

  it('rejects blank, junk, and free text that merely CONTAINS a valid number', () => {
    for (const input of [
      '',
      '   ',
      'not a phone',
      '+',
      '++966500000001', // doubled country-code marker
      'call me on 0500000001', // the reason the shape is checked before the digits are
      '0500000001 (home)',
    ]) {
      expect(normalizeSaudiMobile(input)).toBeNull();
      expect(isSaudiMobile(input)).toBe(false);
    }
  });
});
