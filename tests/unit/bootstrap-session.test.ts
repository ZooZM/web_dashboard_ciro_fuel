import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import toast from 'react-hot-toast';
import { bootstrapSession, wireSessionExpiry } from '@/auth/bootstrap-session';
import { useSessionStore } from '@/stores/session.store';
import { tokenStore } from '@/lib/auth/token-store';
import { Role } from '@/constants/roles';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Feature 013 T015/FR-002/FR-003/FR-006/R1: bootstrapSession() is the silent-refresh-on-
// reload entry point (FR-002 "retained across a reload") and is where the demo picker's
// placeholder-credential bypass lived (`if (accessToken === 'dummy-token' && existingUser)`)
// until this feature removed it. These assertions exercise the real function against a
// mocked backend, the same MSW pattern api-client.refresh.test.ts already establishes.
const server = setupServer(
  http.get(`${BASE_URL}/auth/me`, ({ request }) => {
    const auth = request.headers.get('authorization');
    if (auth === 'Bearer valid-admin-token') {
      return HttpResponse.json({
        id: 'u1',
        role: Role.FUEL_COMPANY_ADMIN,
        companyId: 'c1',
        fullName: 'Test Admin',
        email: 'admin@test.com',
      });
    }
    if (auth === 'Bearer valid-client-token') {
      return HttpResponse.json({
        id: 'u2',
        role: Role.CLIENT,
        companyId: 'c1',
        fullName: 'Test Client',
        email: 'client@test.com',
      });
    }
    // FR-090/Edge Cases: an already-live session whose company was suspended since —
    // `validateActiveSessionWithScoping`'s SESSION_REVOKED+cause shape (users.service.ts).
    if (auth === 'Bearer suspended-company-token') {
      return HttpResponse.json(
        { statusCode: 401, error: 'SESSION_REVOKED', cause: 'COMPANY_SUSPENDED', message: 'Your session has ended' },
        { status: 401 },
      );
    }
    // spec 015 FR-038/FR-041 — an already-live admin session evicted by the device cap.
    if (auth === 'Bearer session-limit-token') {
      return HttpResponse.json(
        { statusCode: 401, error: 'SESSION_REVOKED', cause: 'SESSION_LIMIT_EXCEEDED', message: 'Your session has ended' },
        { status: 401 },
      );
    }
    return HttpResponse.json({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 });
  }),
  http.post(`${BASE_URL}/auth/refresh`, () =>
    HttpResponse.json({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' }, { status: 401 }),
  ),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  tokenStore.clear();
  useSessionStore.getState().clearSession();
  useSessionStore.setState({ status: 'booting' });
});
afterAll(() => server.close());

describe('bootstrapSession (FR-002, FR-003, FR-006)', () => {
  it('rejects a fabricated/placeholder credential — no dummy-token bypass exists (FR-003)', async () => {
    tokenStore.set('dummy-token');
    // No refresh token either — a fabricated session never held a real one.

    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(useSessionStore.getState().user).toBeNull();
  });

  it('accepts a genuine FUEL_COMPANY_ADMIN token and establishes the session (FR-002)', async () => {
    tokenStore.set('valid-admin-token');

    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('authenticated');
    expect(useSessionStore.getState().user?.role).toBe(Role.FUEL_COMPANY_ADMIN);
  });

  // The actual reload path, and the one nothing above exercises: every other case here
  // pre-seeds an access token, but a real reload starts with NO access token in memory
  // (it is never persisted — R9) and only the stored refresh token. This is what
  // "signed in across a reload" means, and it stayed broken because it had no test.
  it('restores the session on reload from the persisted refresh token alone, with no access token in memory (FR-011)', async () => {
    server.use(
      http.post(`${BASE_URL}/auth/refresh`, () =>
        HttpResponse.json({
          accessToken: 'valid-admin-token',
          refreshToken: 'rotated-refresh-token',
        }),
      ),
    );
    tokenStore.setRefreshToken('stored-refresh-token');

    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('authenticated');
    expect(useSessionStore.getState().user?.role).toBe(Role.FUEL_COMPANY_ADMIN);
  });

  it('clears the session for a genuine but non-dashboard role (CLIENT) — FR-004 boundary', async () => {
    tokenStore.set('valid-client-token');

    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(useSessionStore.getState().user).toBeNull();
  });

  it('a failed renewal (no valid token, refresh also fails) returns to sign-in (FR-006)', async () => {
    tokenStore.set('expired-token');
    tokenStore.setRefreshToken('also-expired-refresh-token');

    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('anonymous');
  });

  it('states the specific reason for a suspended company, rather than an empty dashboard (FR-090)', async () => {
    wireSessionExpiry();
    const toastSpy = vi.spyOn(toast, 'error');
    tokenStore.set('suspended-company-token');

    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining('تعليق'));
    toastSpy.mockRestore();
  });

  it('states the device-limit reason (SESSION_LIMIT_EXCEEDED) rather than signing out silently (spec 015 FR-038/FR-041)', async () => {
    wireSessionExpiry();
    const toastSpy = vi.spyOn(toast, 'error');
    tokenStore.set('session-limit-token');

    await bootstrapSession();

    expect(useSessionStore.getState().status).toBe('anonymous');
    expect(toastSpy).toHaveBeenCalledWith(expect.stringContaining('أجهزة'));
    toastSpy.mockRestore();
  });

  it('does not attempt a refresh for a SESSION_REVOKED response — refreshing cannot undo it', async () => {
    wireSessionExpiry();
    let refreshCallCount = 0;
    server.use(
      http.post(`${BASE_URL}/auth/refresh`, () => {
        refreshCallCount += 1;
        return HttpResponse.json({ accessToken: 'x', refreshToken: 'y' });
      }),
    );
    tokenStore.set('suspended-company-token');
    tokenStore.setRefreshToken('some-refresh-token');

    await bootstrapSession();

    expect(refreshCallCount).toBe(0);
  });
});
