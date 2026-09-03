// Access token: the header comment here has long claimed "in-memory only — never written
// to localStorage" (FR-011a) while the code below actually persists it — this file's real
// behaviour, not its own header, is what every consumer has always relied on. Left as-is;
// changing the access token's persistence is a separate, larger decision than this feature.
let accessToken: string | null = localStorage.getItem('accessToken') || null;

// Refresh token: Feature 013 T024/tests/unit/api-client.refresh.test.ts. The platform's
// `POST /auth/refresh` takes the refresh token in the request BODY (`RefreshTokenDto`), not
// an httpOnly cookie — before this task nothing in this codebase captured or sent one at
// all (`grep -r "refreshToken" src/` was empty), so `/auth/refresh` had never worked.
// Deliberately TRUE in-memory only, unlike the access token above: a refresh token is
// longer-lived and more powerful, and the existing pre-written test suite's own comment
// ("the memory-only store starts empty on every reload") is explicit that it must not
// survive a reload. The consequence is accepted: a reload after the access token has
// already expired forces a fresh login rather than a silent refresh — the safer failure
// mode given the httpOnly-cookie design (spec 003) remains out of scope.
let refreshToken: string | null = null;

export const tokenStore = {
  get(): string | null {
    return accessToken;
  },
  set(token: string | null): void {
    accessToken = token;
    if (token) {
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
    }
  },
  getRefreshToken(): string | null {
    return refreshToken;
  },
  setRefreshToken(token: string | null): void {
    refreshToken = token;
  },
  /** Resets both tokens — used on sign-out and by tests between cases. */
  clear(): void {
    accessToken = null;
    refreshToken = null;
    localStorage.removeItem('accessToken');
  },
};
