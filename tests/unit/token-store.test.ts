import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const REFRESH_KEY = 'ciro.refreshToken';

/**
 * spec 015 US5 T088 — the storage inversion (research R9):
 *   - the refresh token persists to localStorage when "remember me" is set,
 *     sessionStorage otherwise;
 *   - the access token is NEVER written to either;
 *   - every read is wrapped so a browser with site data blocked degrades to
 *     memory-only rather than throwing at module load.
 */
describe('token-store storage inversion (spec 015 R9)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.resetModules();
  });
  afterEach(() => vi.restoreAllMocks());

  it('persists the refresh token to localStorage when remember = true', async () => {
    const { tokenStore } = await import('@/lib/auth/token-store');
    tokenStore.setRefreshToken('r-tok', true);
    expect(localStorage.getItem(REFRESH_KEY)).toBe('r-tok');
    expect(sessionStorage.getItem(REFRESH_KEY)).toBeNull();
  });

  it('persists the refresh token to sessionStorage when remember = false', async () => {
    const { tokenStore } = await import('@/lib/auth/token-store');
    tokenStore.setRefreshToken('r-tok', false);
    expect(sessionStorage.getItem(REFRESH_KEY)).toBe('r-tok');
    expect(localStorage.getItem(REFRESH_KEY)).toBeNull();
  });

  it('never writes the access token to localStorage or sessionStorage', async () => {
    const { tokenStore } = await import('@/lib/auth/token-store');
    tokenStore.set('a-tok');
    expect(tokenStore.get()).toBe('a-tok');
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });

  it('keeps the same persistence scope on a rotation with no remember argument', async () => {
    const { tokenStore } = await import('@/lib/auth/token-store');
    tokenStore.setRefreshToken('first', false); // sessionStorage
    tokenStore.setRefreshToken('rotated'); // interceptor rotation, no arg
    expect(sessionStorage.getItem(REFRESH_KEY)).toBe('rotated');
    expect(localStorage.getItem(REFRESH_KEY)).toBeNull();
  });

  it('restores the refresh token from localStorage on a reload (the FR-060 fix)', async () => {
    localStorage.setItem(REFRESH_KEY, 'persisted');
    vi.resetModules();
    const { tokenStore } = await import('@/lib/auth/token-store');
    expect(tokenStore.getRefreshToken()).toBe('persisted');
  });

  it('clear() removes the refresh token from both stores', async () => {
    const { tokenStore } = await import('@/lib/auth/token-store');
    tokenStore.setRefreshToken('r', true);
    tokenStore.clear();
    expect(localStorage.getItem(REFRESH_KEY)).toBeNull();
    expect(sessionStorage.getItem(REFRESH_KEY)).toBeNull();
    expect(tokenStore.getRefreshToken()).toBeNull();
  });

  it('degrades to memory-only rather than throwing when storage access throws at load', async () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('site data blocked');
    });
    vi.resetModules();
    await expect(import('@/lib/auth/token-store')).resolves.toBeDefined();
    spy.mockRestore();
  });
});
