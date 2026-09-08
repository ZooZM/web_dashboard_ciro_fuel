// spec 015 — the sign-in screens DISPLAY a Saudi local number (`05X XXX XXXX`) behind a
// `+966` chip, but the platform validates E.164 (`E164_PATTERN`) and must receive
// `+9665XXXXXXXX`. Compose it here so no screen sends the local form (dashboard-
// integration §2).

/** `05XXXXXXXX` / `5XXXXXXXX` / `9665XXXXXXXX` → `+9665XXXXXXXX`. */
export function toE164Saudi(input: string): string {
  let digits = input.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('966')) digits = digits.slice(3);
  if (digits.startsWith('0')) digits = digits.slice(1);
  return `+966${digits}`;
}

/** Loose check that the composed value looks like E.164 before a request is sent. */
export function looksLikeE164(value: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(value);
}

/**
 * A Saudi mobile in E.164: `+9665` followed by exactly 8 digits. `looksLikeE164` above is
 * deliberately generic (8–15 digits, any country), which is right for a number an operator
 * types in full — but WRONG for every screen that composes one from a local `05…` behind a
 * fixed `+966` chip. Those screens accepted `+96650000002` (one digit short) and every
 * other malformed length, sent it, and — because `/auth/login/code/request` answers 202 for
 * an unknown number by design (FR-015) — moved the administrator on to a code-entry screen
 * to wait for a code the platform had no reason to send. A mistyped digit presented as a
 * silent failure of the SMS provider.
 */
export function looksLikeSaudiMobile(value: string): boolean {
  return /^\+9665\d{8}$/.test(value);
}

/**
 * The one accept-or-refuse for a Saudi mobile typed in ANY of the forms an operator
 * actually uses. Returns the E.164 value the platform requires, or null if the input is
 * not a Saudi mobile at all.
 *
 * Accepts `+966512345678`, `00966512345678`, `966512345678`, `0512345678` and
 * `512345678` — plus any spacing, dashes or parentheses between the digits.
 *
 * It exists because `toE164Saudi` + `looksLikeE164` was the pattern across five creation
 * forms and that pair has a hole in the middle: a number typed with an explicit `+` was
 * only ever checked as GENERIC E.164, so `+12025550123` passed every one of them and was
 * written to the platform as a station owner's, driver's or company administrator's login
 * identifier. Every one of those screens already showed a `+9665XXXXXXXX` placeholder, so
 * the intent was always Saudi; only the check was not.
 *
 * An explicit non-966 country code is refused OUTRIGHT rather than coerced. `toE164Saudi`
 * would turn `+12025550123` into `+96612025550123` — a plausible-looking string for a
 * number the operator never typed, and exactly the kind of value that is discovered months
 * later when an SMS never arrives.
 */
export function normalizeSaudiMobile(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Validate the SHAPE before extracting digits. Stripping non-digits first and judging
  // only what falls out is too lenient in a way that is easy to miss: "call me on
  // 0500000001" reduces to a perfectly valid subscriber number, and a pasted sentence
  // would have been stored as somebody's login identifier. Digits, one optional leading
  // `+`, and the separators people actually type — nothing else.
  if (!/^\+?[\d\s()\-.]+$/.test(trimmed)) return null;

  let digits = trimmed.replace(/\D/g, '');
  const hasExplicitCountryCode = trimmed.startsWith('+') || digits.startsWith('00');

  if (digits.startsWith('00')) digits = digits.slice(2);

  if (digits.startsWith('966')) {
    digits = digits.slice(3);
  } else if (hasExplicitCountryCode) {
    // The operator named a country, and it was not Saudi Arabia.
    return null;
  } else if (digits.startsWith('0')) {
    // National trunk prefix on a local number.
    digits = digits.slice(1);
  }

  // A Saudi mobile subscriber number is `5` followed by exactly 8 digits. Checking the
  // LENGTH here is what catches the dropped or doubled digit that a pattern anchored only
  // at the start would wave through.
  if (!/^5\d{8}$/.test(digits)) return null;

  return `+966${digits}`;
}

/** Whether `input`, in any accepted form, is a Saudi mobile. */
export function isSaudiMobile(input: string): boolean {
  return normalizeSaudiMobile(input) !== null;
}
