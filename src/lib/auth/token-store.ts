// In-memory only — never written to localStorage/sessionStorage (FR-011a). This is what
// keeps the access token unreachable by any script-injection flaw that isn't a live JS
// context; it dies with the tab and is restored via bootstrapSession() on reload.
let accessToken: string | null = localStorage.getItem('accessToken') || null;

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
};
