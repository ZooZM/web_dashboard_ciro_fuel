import { test, expect } from '@playwright/test';

/**
 * Feature 009 T042/T042a (SC-002, SC-007, SC-017): the assignment flow's success path,
 * its refusals, and the 60-second time bound. Requires a live backend seeded with a
 * TRANSPORT_COMPANY_ADMIN, at least one order ROUTED_TO_TRANSPORT to that company, one
 * candidate driver, one valid truck+tank pair, and (for the capacity/grade refusal cases)
 * a second tank that deliberately cannot serve the order — see quickstart.md Part 2,
 * records 9-11.
 *
 * NOTE: written and reviewed, not executed — this session has no running dev server, no
 * live backend, and no seeded E2E accounts. Run with `npx playwright test` against a real
 * environment before relying on it.
 */
const TEST_EMAIL = process.env.E2E_TRANSPORT_ADMIN_EMAIL ?? 'transport-admin@example.com';
const TEST_PASSWORD = process.env.E2E_TRANSPORT_ADMIN_PASSWORD ?? 'password123';
// An order already ROUTED_TO_TRANSPORT to the seeded company — seed script prints this id.
const ROUTED_ORDER_ID = process.env.E2E_ROUTED_ORDER_ID ?? '';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /sign in|login/i }).click();
  await expect(page).toHaveURL(/\/transport/);
}

test.describe('Assignment flow (US1 / FR-001-009, SC-002, SC-007, SC-008)', () => {
  test.skip(!ROUTED_ORDER_ID, 'requires E2E_ROUTED_ORDER_ID from a seeded environment');

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('assigns a driver, tractor and trailer within 60 seconds (SC-002)', async ({ page }) => {
    const startedAt = Date.now();
    await page.goto(`/transport/orders/${ROUTED_ORDER_ID}/assign`);

    // Candidates are the platform's own ranking — the first radio is whatever it ranked
    // first; this test never re-sorts or second-guesses that order.
    const firstDriver = page.locator('input[name="driver"]').first();
    await firstDriver.check();

    // FR-003: selecting a driver pre-selects their suggested truck when one exists.
    const truckPreselected = await page.locator('input[name="truck"]:checked').count();
    if (truckPreselected === 0) {
      await page.locator('input[name="truck"]').first().check();
    }
    await page.locator('input[name="tank"]').first().check();

    await page.getByRole('button', { name: /confirm assignment|تأكيد الإسناد/i }).click();
    await expect(page.getByText(/refused|تعذر/i)).toHaveCount(0);

    const elapsedSeconds = (Date.now() - startedAt) / 1000;
    expect(elapsedSeconds).toBeLessThan(60);
  });

  test('refuses a tank whose capacity cannot hold the order, naming the rule (FR-005)', async ({ page }) => {
    await page.goto(`/transport/orders/${ROUTED_ORDER_ID}/assign`);
    await page.locator('input[name="driver"]').first().check();
    await page.locator('input[name="truck"]').first().check();

    // The deliberately-undersized tank — quickstart.md Part 2 record 11.
    const undersizedTank = page.getByText(/undersized|أقل من/i).locator('..').locator('input[type="radio"]');
    await undersizedTank.check();

    await page.getByRole('button', { name: /confirm assignment|تأكيد الإسناد/i }).click();
    await expect(page.getByText(/capacity|السعة/i)).toBeVisible();
  });

  test('refuses an order already assigned by another admin, and corrects the view (FR-006)', async ({ page, context }) => {
    // Two tabs racing the same order — SC-008's concurrency guarantee surfaces here as
    // "the second attempt sees the true, now-assigned state," not a crash.
    const second = await context.newPage();
    await second.goto('/');
    await second.getByLabel(/email/i).fill(TEST_EMAIL);
    await second.getByLabel(/password/i).fill(TEST_PASSWORD);
    await second.getByRole('button', { name: /sign in|login/i }).click();

    await page.goto(`/transport/orders/${ROUTED_ORDER_ID}/assign`);
    await second.goto(`/transport/orders/${ROUTED_ORDER_ID}/assign`);

    async function assign(p: import('@playwright/test').Page) {
      await p.locator('input[name="driver"]').first().check();
      await p.locator('input[name="truck"]').first().check();
      await p.locator('input[name="tank"]').first().check();
      await p.getByRole('button', { name: /confirm assignment|تأكيد الإسناد/i }).click();
    }

    await Promise.all([assign(page), assign(second)]);

    // Exactly one of the two tabs ends up refused, seeing the corrected, already-assigned state.
    const refusalCount =
      (await page.getByText(/no longer|لم يعد/i).count()) + (await second.getByText(/no longer|لم يعد/i).count());
    expect(refusalCount).toBe(1);

    await second.close();
  });
});
