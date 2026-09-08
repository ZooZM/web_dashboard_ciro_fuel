// spec 015 (dashboard auth) research R9 — the two storage decisions are INVERTED from
// what shipped before:
//
//   Access token  → MEMORY ONLY. Never written to localStorage. Used on every request;
//                   keeping the short-lived credential out of storage is the honest
//                   trade-off in a SPA that holds tokens in JS at all (both are reachable
//                   by XSS; the httpOnly-cookie design that would change that is out of
//                   scope because it would alter both Flutter clients' refresh path).
//   Refresh token → PERSISTED. `localStorage` when "remember me" was checked, otherwise
//                   `sessionStorage`. This is the long-lived, more powerful credential —
//                   and persisting it is what makes a browser reload after the access
//                   token has expired restore the session silently instead of throwing
//                   the administrator back to sign-in, now at the cost of an SMS
//                   (the FR-060 fix).
//
// Every read is wrapped: a browser with site data blocked (or a private window that
// throws on access) degrades to memory-only rather than throwing at module load.

const REFRESH_KEY = 'ciro.refreshToken';

function safeGet(store: Storage | undefined, key: string): string | null {
  try {
    return store?.getItem(key) ?? null;
  } catch {
    return null;
  }
}
function safeSet(store: Storage | undefined, key: string, value: string): void {
  try {
    store?.setItem(key, value);
  } catch {
    /* site data blocked — the in-memory copy still serves this tab */
  }
}
function safeRemove(store: Storage | undefined, key: string): void {
  try {
    store?.removeItem(key);
  } catch {
    /* ignore */
  }
}

const ls = typeof window !== 'undefined' ? window.localStorage : undefined;
const ss = typeof window !== 'undefined' ? window.sessionStorage : undefined;

// The pre-R9 world persisted an access token here — clear it once.
safeRemove(ls, 'accessToken');

let accessToken: string | null = null;

// On load, prefer localStorage (remember-me) then sessionStorage.
let refreshToken: string | null = safeGet(ls, REFRESH_KEY);
let rememberMe = refreshToken !== null;
if (refreshToken === null) {
  refreshToken = safeGet(ss, REFRESH_KEY);
}

export const tokenStore = {
  get(): string | null {
    return accessToken;
  },
  set(token: string | null): void {
    accessToken = token; // memory only — no persistence
  },
  getRefreshToken(): string | null {
    return refreshToken;
  },
  /**
   * `remember` chooses the persistence scope and is remembered for later
   * writes: the response interceptor rotates the refresh token on every call
   * with no `remember` argument and must keep the same scope.
   */
  setRefreshToken(token: string | null, remember?: boolean): void {
    if (remember !== undefined) {
      rememberMe = remember;
    }
    refreshToken = token;
    if (token === null) {
      safeRemove(ls, REFRESH_KEY);
      safeRemove(ss, REFRESH_KEY);
      return;
    }
    if (rememberMe) {
      safeSet(ls, REFRESH_KEY, token);
      safeRemove(ss, REFRESH_KEY);
    } else {
      safeSet(ss, REFRESH_KEY, token);
      safeRemove(ls, REFRESH_KEY);
    }
  },
  /** Resets both tokens in every store — used on sign-out and by tests between cases. */
  clear(): void {
    accessToken = null;
    refreshToken = null;
    safeRemove(ls, REFRESH_KEY);
    safeRemove(ss, REFRESH_KEY);
    safeRemove(ls, 'accessToken');
  },
};
