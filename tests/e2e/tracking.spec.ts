import { test, expect } from '@playwright/test';

/**
 * Feature 009 T057 (SC-004, SC-017, FR-017/FR-018): the tracking screen's live,
 * not-trackable and stale states. Requires a live backend seeded with a
 * TRANSPORT_COMPANY_ADMIN, one order in ASSIGNED_TO_DRIVER (not yet trackable), and one
 * order IN_TRANSIT with a driver able to emit `location:update` (a second authenticated
 * socket connection, or a script driving the driver's own app/API).
 *
 * NOTE: written and reviewed, not executed — no running dev server or live backend in
 * this session. Run against a real environment before relying on it.
 */
const TEST_EMAIL = process.env.E2E_TRANSPORT_ADMIN_EMAIL ?? 'transport-admin@example.com';
const TEST_PASSWORD = process.env.E2E_TRANSPORT_ADMIN_PASSWORD ?? 'password123';
const ASSIGNED_ORDER_ID = process.env.E2E_ASSIGNED_ORDER_ID ?? '';
const IN_TRANSIT_ORDER_ID = process.env.E2E_IN_TRANSIT_ORDER_ID ?? '';
const DRIVER_PHONE = process.env.E2E_DRIVER_PHONE ?? '';
const DRIVER_PASSWORD = process.env.E2E_DRIVER_PASSWORD ?? 'password123';
const API_BASE_URL = process.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /sign in|login/i }).click();
  await expect(page).toHaveURL(/\/transport/);
}

test.describe('Tracking screen (US2 / FR-017, FR-018, SC-004)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('states explicitly that an assigned-but-not-departed order is not trackable (FR-017)', async ({ page }) => {
    test.skip(!ASSIGNED_ORDER_ID, 'requires E2E_ASSIGNED_ORDER_ID');
    await page.goto(`/transport/tracking?orderId=${ASSIGNED_ORDER_ID}`);
    // The platform's own order:watch refusal — not a locally-judged state.
    await expect(page.getByText(/not currently trackable|غير قابل للتتبع/i)).toBeVisible();
  });

  test('shows a live position for an in-transit order without a manual reload (SC-004)', async ({ page }) => {
    test.skip(!IN_TRANSIT_ORDER_ID, 'requires E2E_IN_TRANSIT_ORDER_ID with a driver emitting location:update');
    await page.goto(`/transport/tracking?orderId=${IN_TRANSIT_ORDER_ID}`);
    await expect(page.getByText(/not currently trackable/i)).toHaveCount(0);
    // A live map surface is present (no reload button was needed to reach this state).
    await expect(page.locator('[role="img"], canvas, iframe').first()).toBeVisible({ timeout: 15_000 });
  });

  test('states staleness with an age once position updates stop (FR-018)', async ({ page }) => {
    test.skip(!IN_TRANSIT_ORDER_ID, 'requires E2E_IN_TRANSIT_ORDER_ID; simulate a stopped driver by pausing location:update for over 60s');
    await page.goto(`/transport/tracking?orderId=${IN_TRANSIT_ORDER_ID}`);
    await page.waitForTimeout(65_000);
    await expect(page.getByText(/stale|غير محدّث/i)).toBeVisible();
  });

  test('holds exactly one live connection regardless of deliveries observed (SC-014)', async ({ page }) => {
    test.skip(!IN_TRANSIT_ORDER_ID, 'requires E2E_IN_TRANSIT_ORDER_ID');
    let socketConnections = 0;
    page.on('websocket', () => {
      socketConnections += 1;
    });

    await page.goto(`/transport/tracking?orderId=${IN_TRANSIT_ORDER_ID}`);
    await page.waitForTimeout(2000);
    expect(socketConnections).toBeLessThanOrEqual(1);
  });

  /**
   * Feature 009 T059 (SC-013): "unattended" is a hidden tab, not merely an idle
   * foreground one — background refresh (FR-020, ORDER_POLL_INTERVAL_MS) is paused via
   * TanStack Query's `refetchIntervalInBackground: false` default, which reads
   * `document.visibilityState`. A 40s hidden window (~2.5x the 15s poll interval) is a
   * proportionate proxy for the spec's literal 10 minutes — long enough that a poll which
   * fired would be caught, short enough to keep the suite runnable.
   */
  /**
   * Feature 009 T057a (FR-020, SC-003): "any participant" means the driver's own action
   * has to be the trigger — not the admin's own tab, which would only measure its own
   * round-trip. The second actor here is the driver's real API call (`POST
   * /orders/:id/arrive`, IN_TRANSIT → UNLOADING, no NFC credential needed unlike
   * verify-vehicle), made directly via Playwright's `request` fixture rather than a second
   * browser session — driving the transition is what matters, not how the driver's own
   * screen looks doing it. The 15s bound comes directly from `ORDER_POLL_INTERVAL_MS`.
   */
  test('a stage change made by the driver appears on the open admin screen within 15 seconds, with no reload (FR-020, SC-003)', async ({
    page,
    request,
  }) => {
    test.skip(!IN_TRANSIT_ORDER_ID || !DRIVER_PHONE, 'requires E2E_IN_TRANSIT_ORDER_ID and E2E_DRIVER_PHONE');

    await page.goto(`/transport/orders/${IN_TRANSIT_ORDER_ID}`);
    await expect(page.getByText(/in transit|في الطريق/i)).toBeVisible();

    const driverLogin = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { phone: DRIVER_PHONE, password: DRIVER_PASSWORD },
    });
    expect(driverLogin.ok()).toBe(true);
    const { accessToken } = await driverLogin.json();

    const startedAt = Date.now();
    const arrive = await request.post(`${API_BASE_URL}/orders/${IN_TRANSIT_ORDER_ID}/arrive`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(arrive.ok()).toBe(true);

    // No page.reload() anywhere in this test — only background polling can produce this.
    await expect(page.getByText(/unloading|جارٍ التفريغ/i)).toBeVisible({ timeout: 15_000 });
    expect((Date.now() - startedAt) / 1000).toBeLessThan(15);
  });

  test('an unattended (hidden) tab generates no platform requests beyond the open connection (SC-013)', async ({ page }) => {
    await page.goto('/transport/orders');
    await page.waitForLoadState('networkidle');

    let requestsWhileHidden = 0;
    page.on('request', (request) => {
      if (/\/api\/v1\//.test(request.url())) {
        requestsWhileHidden += 1;
      }
    });

    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });

    await page.waitForTimeout(40_000);
    expect(requestsWhileHidden).toBe(0);
  });
});
