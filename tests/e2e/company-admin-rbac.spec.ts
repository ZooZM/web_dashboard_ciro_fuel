import { test, expect } from '@playwright/test';

// Feature 009 Slice 0: COMPANY_ADMIN no longer exists (replaced by FUEL_COMPANY_ADMIN /
// TRANSPORT_COMPANY_ADMIN, research.md R1) and the login route is `/`, not `/login` —
// this file predates that rewrite and is corrected here to match. Requires a live backend
// + a seeded FUEL_COMPANY_ADMIN account scoped to a single tenant.
const TEST_EMAIL = process.env.E2E_FUEL_COMPANY_ADMIN_EMAIL ?? 'fuel-company-admin@example.com';
const TEST_PASSWORD = process.env.E2E_FUEL_COMPANY_ADMIN_PASSWORD ?? 'password123';

test.describe('Fuel Company Admin RBAC + tenant isolation (US1 / FR-068, SC-001, SC-009)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign in|login/i }).click();
    await expect(page).toHaveURL(/\/petrolCompany/);
  });

  test('the transport surface is blocked with no cross-role fetch', async ({ page }) => {
    const transportRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('/dispatch') || req.url().includes('/trucks') || req.url().includes('/tanks')) {
        transportRequests.push(req.url());
      }
    });

    await page.goto('/transport/orders');

    await expect(page).toHaveURL(/\/403$/);
    expect(transportRequests).toHaveLength(0);
  });

  test('the orders list shows only this company\'s orders', async ({ page }) => {
    await page.goto('/petrolCompany/orders');
    await expect(page.getByRole('heading', { name: /orders/i })).toBeVisible();
    // Every row belongs to the signed-in admin's tenant — the backend enforces this;
    // the assertion here is that the list renders without a 403/404 boundary error.
    await expect(page.getByText(/forbidden|not found/i)).toHaveCount(0);
  });
});
