import { test, expect } from '@playwright/test';

// Requires the feature-001 backend running at VITE_API_BASE_URL with the R1 httpOnly
// refresh-cookie adjustment applied (research.md), plus a seeded COMPANY_ADMIN account.
const TEST_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'admin@example.com';
const TEST_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? 'password123';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(TEST_EMAIL);
  await page.getByLabel(/password/i).fill(TEST_PASSWORD);
  await page.getByRole('button', { name: /sign in|login/i }).click();
}

test.describe('Secure, persistent, auto-refreshing session (US3 / SC-003, SC-004, SC-005)', () => {
  test('session persists across reload with no tokens in web storage', async ({ page }) => {
    await login(page);
    await expect(page).not.toHaveURL(/\/login$/);

    const storedAccessToken = await page.evaluate(() =>
      Object.keys(localStorage).some((k) => /token/i.test(k)) ||
      Object.keys(sessionStorage).some((k) => /token/i.test(k)),
    );
    expect(storedAccessToken).toBe(false);

    await page.reload();
    await expect(page).not.toHaveURL(/\/login$/);
  });

  test('sign-out clears the session and returns to /login', async ({ page }) => {
    await login(page);
    await page.getByRole('button', { name: /sign out/i }).click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('a revoked/failed refresh redirects to /login with no protected data left visible', async ({
    page,
    context,
  }) => {
    await login(page);
    // Simulate revocation by dropping all cookies (including the httpOnly refresh cookie)
    // then forcing a protected request via reload.
    await context.clearCookies();
    await page.reload();
    await expect(page).toHaveURL(/\/login$/);
  });
});
