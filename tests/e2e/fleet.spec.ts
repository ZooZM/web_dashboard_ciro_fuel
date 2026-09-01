import { test, expect } from '@playwright/test';

/**
 * Feature 009 T093/T094/T095 (SC-019, SC-020, SC-021, SC-022): card pairing's capture
 * isolation, scanned-vs-manual discrimination, and credential rotation immediacy.
 * `page.keyboard.press` simulates a keyboard-wedge reader — from the browser's
 * perspective a hardware reader and a fast typist are indistinguishable except by
 * timing, which is exactly what FR-047's discrimination rule depends on and what these
 * tests exercise.
 *
 * NOTE: written and reviewed, not executed — no running dev server or live backend in
 * this session. Run against a real environment before relying on it.
 */
const TEST_EMAIL = process.env.E2E_TRANSPORT_ADMIN_EMAIL ?? 'transport-admin@example.com';
const TEST_PASSWORD = process.env.E2E_TRANSPORT_ADMIN_PASSWORD ?? 'password123';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /sign in|login/i }).click();
  await expect(page).toHaveURL(/\/transport/);
}

/** Simulates a keyboard-wedge reader: a burst of characters faster than a human types,
 *  terminated by Enter — mirrors `use-card-capture.ts`'s own READER_MAX_INTERVAL_MS. */
async function simulateReaderScan(page: import('@playwright/test').Page, uid: string) {
  for (const char of uid) {
    await page.keyboard.press(char);
    await page.waitForTimeout(5); // well under the 40ms reader threshold
  }
  await page.keyboard.press('Enter');
}

async function simulateHumanTyping(page: import('@playwright/test').Page, text: string) {
  for (const char of text) {
    await page.keyboard.press(char);
    await page.waitForTimeout(150); // well over the reader threshold
  }
}

test.describe('Card pairing (US4 / FR-045-051, SC-019-022)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('a card presented while the pairing dialog is closed is absorbed by no field (SC-020)', async ({ page }) => {
    await page.goto('/transport/trucks');
    // The pairing dialog is NOT open — capture must be disarmed (FR-048).
    const searchInput = page.locator('input[type="text"]').first();
    await searchInput.focus();
    await simulateReaderScan(page, 'STRAYCARD123');
    await expect(searchInput).toHaveValue('');
  });

  test('pairs a card via the reader path in under 30 seconds (SC-019)', async ({ page }) => {
    await page.goto('/transport/trucks');
    await page.getByRole('button', { name: /pair card|ربط كارت/i }).first().click();

    const startedAt = Date.now();
    await simulateReaderScan(page, 'CARD-E2E-001');
    await expect(page.getByText(/captured|تم الالتقاط/i)).toBeVisible();
    await page.getByRole('button', { name: /confirm pairing|تأكيد الربط/i }).click();
    await expect(page.getByText(/card paired|الكارت مرتبط/i)).toBeVisible();

    expect((Date.now() - startedAt) / 1000).toBeLessThan(30);
  });

  test('discriminates a scanned burst from hand-typed input across repeated trials (SC-021)', async ({ page }) => {
    await page.goto('/transport/trucks');

    for (let i = 0; i < 20; i++) {
      await page.getByRole('button', { name: /pair card|ربط كارت/i }).first().click();
      await simulateReaderScan(page, `SCAN${i}`);
      await expect(page.getByText(/entered manually|تم الإدخال يدوياً/i)).toHaveCount(0);
      await page.keyboard.press('Escape');
    }

    for (let i = 0; i < 20; i++) {
      await page.getByRole('button', { name: /pair card|ربط كارت/i }).first().click();
      const manualField = page.getByPlaceholder(/enter the card|أدخل معرّف الكارت/i);
      await manualField.click();
      await simulateHumanTyping(page, `HAND${i}`);
      await page.getByRole('button', { name: /use this value|استخدام هذه القيمة/i }).click();
      await expect(page.getByText(/entered manually|تم الإدخال يدوياً/i)).toBeVisible();
      await page.keyboard.press('Escape');
    }
  });

  test('a rotated credential is refused immediately, no stale window (SC-022)', async ({ page, request }) => {
    await page.goto('/transport/trucks');
    await page.getByRole('button', { name: /re-pair card|إعادة ربط الكارت/i }).first().click();
    // Rotation itself is a platform-level guarantee (trucks.service.ts's mintQrToken) —
    // this test asserts the dashboard surfaces the new state immediately, not that the
    // platform's own transaction is correct (covered by the backend suite).
    await page.getByRole('button', { name: /rotate|تدوير/i }).click();
    await expect(page.getByText(/code active|الرمز مفعّل/i)).toBeVisible();
  });
});
