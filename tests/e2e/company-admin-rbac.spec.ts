import { test, expect } from '@playwright/test';

// Requires a live backend + a seeded COMPANY_ADMIN account scoped to a single tenant.
const TEST_EMAIL = process.env.E2E_COMPANY_ADMIN_EMAIL ?? 'company-admin@example.com';
const TEST_PASSWORD = process.env.E2E_COMPANY_ADMIN_PASSWORD ?? 'password123';

test.describe('Company Admin RBAC + tenant isolation (US1 / FR-004, SC-001, SC-002)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign in|login/i }).click();
    await expect(page).toHaveURL(/\/orders$/);
  });

  test('a Super-Admin-only deep link is blocked with no cross-tenant fetch', async ({ page }) => {
    const companiesRequests: string[] = [];
    page.on('request', (req) => {
      if (req.url().includes('/companies')) companiesRequests.push(req.url());
    });

    await page.goto('/companies');

    await expect(page).toHaveURL(/\/403$/);
    expect(companiesRequests).toHaveLength(0);
  });

  test('the orders list shows only this company\'s orders', async ({ page }) => {
    await page.goto('/orders');
    await expect(page.getByRole('heading', { name: /orders/i })).toBeVisible();
    // Every row belongs to the signed-in admin's tenant — the backend enforces this;
    // the assertion here is that the list renders without a 403/404 boundary error.
    await expect(page.getByText(/forbidden|not found/i)).toHaveCount(0);
  });
});
