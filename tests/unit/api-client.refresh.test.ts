import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { apiClient, refreshAccessToken, setOnSessionExpired } from '@/lib/api/api.client';
import { tokenStore } from '@/lib/auth/token-store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let refreshCallCount = 0;

const server = setupServer(
  http.get(`${BASE_URL}/protected`, ({ request }) => {
    const auth = request.headers.get('authorization');
    if (auth === 'Bearer valid-token') {
      return HttpResponse.json({ ok: true });
    }
    return HttpResponse.json({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 });
  }),
  http.get(`${BASE_URL}/forbidden-resource`, () =>
    HttpResponse.json({ statusCode: 403, message: 'Forbidden', error: 'Forbidden' }, { status: 403 }),
  ),
  http.get(`${BASE_URL}/missing-resource`, () =>
    HttpResponse.json({ statusCode: 404, message: 'Not Found', error: 'NotFound' }, { status: 404 }),
  ),
  http.post(`${BASE_URL}/auth/refresh`, async () => {
    refreshCallCount += 1;
    // Simulate network latency so concurrent callers overlap.
    await new Promise((resolve) => setTimeout(resolve, 20));
    return HttpResponse.json({ accessToken: 'valid-token' });
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  refreshCallCount = 0;
  tokenStore.set(null);
});
afterAll(() => server.close());

describe('single-flight refresh (FR-007/FR-008)', () => {
  it('refreshes exactly once when N concurrent requests all hit an expired token', async () => {
    tokenStore.set('expired-token');

    const results = await Promise.all([
      apiClient.get('/protected'),
      apiClient.get('/protected'),
      apiClient.get('/protected'),
    ]);

    expect(results.every((r) => r.data.ok)).toBe(true);
    expect(refreshCallCount).toBe(1);
  });

  it('does not attempt refresh on 403 (access boundary, FR-010)', async () => {
    tokenStore.set('valid-token');
    await expect(apiClient.get('/forbidden-resource')).rejects.toMatchObject({ statusCode: 403 });
    expect(refreshCallCount).toBe(0);
  });

  it('does not attempt refresh on 404 (cross-tenant/not-found, FR-010)', async () => {
    tokenStore.set('valid-token');
    await expect(apiClient.get('/missing-resource')).rejects.toMatchObject({ statusCode: 404 });
    expect(refreshCallCount).toBe(0);
  });

  it('clears the session when refresh itself fails (FR-009)', async () => {
    server.use(
      http.post(`${BASE_URL}/auth/refresh`, () =>
        HttpResponse.json({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 }),
      ),
    );
    const onSessionExpired = vi.fn();
    setOnSessionExpired(onSessionExpired);
    tokenStore.set('expired-token');

    await expect(apiClient.get('/protected')).rejects.toBeTruthy();
    expect(onSessionExpired).toHaveBeenCalledTimes(1);
  });

  it('coalesces refreshAccessToken() calls into a single in-flight promise', async () => {
    const [a, b] = await Promise.all([refreshAccessToken(), refreshAccessToken()]);
    expect(a).toBe(b);
    expect(refreshCallCount).toBe(1);
  });
});
