// In-memory only — never written to localStorage/sessionStorage (FR-011a, FR-078). This is
// what keeps both tokens unreachable by any script-injection flaw that isn't a live JS context;
// they die with the tab and the access token is restored via bootstrapSession()'s silent
// refresh on reload — never by reading a stored value back out.
//
// Feature 009 T010b: this file previously read/wrote `localStorage.getItem/setItem('accessToken')`
// on every call, directly contradicting this same comment (research.md R2). The refresh token
// added here for the request-body refresh contract (T010) is held the same way — memory only,
// never storage — so the correction does not import a second instance of the original defect.
let accessToken: string | null = null;
let refreshToken: string | null = null;

export const tokenStore = {
  get(): string | null {
    return accessToken;
  },
  set(token: string | null): void {
    accessToken = token;
  },
  getRefreshToken(): string | null {
    return refreshToken;
  },
  setRefreshToken(token: string | null): void {
    refreshToken = token;
  },
  clear(): void {
    accessToken = null;
    refreshToken = null;
  },
};
