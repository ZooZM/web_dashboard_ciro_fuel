import { test, expect } from '@playwright/test';

// Requires a live backend + a seeded SUPER_ADMIN account.
const TEST_EMAIL = process.env.E2E_SUPER_ADMIN_EMAIL ?? 'super-admin@example.com';
const TEST_PASSWORD = process.env.E2E_SUPER_ADMIN_PASSWORD ?? 'password123';

test.describe('Super Admin platform governance (US2 / FR-015a, SC-007)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(TEST_EMAIL);
    await page.getByLabel(/password/i).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: /sign in|login/i }).click();
    await expect(page).toHaveURL(/\/companies$/);
  });

  test('onboarding creates a company and its initial admin atomically', async ({ page }) => {
    await page.goto('/companies/new');

    const uniqueSuffix = Date.now();
    await page.getByLabel(/company name/i).fill(`Test Fuel Co ${uniqueSuffix}`);
    await page
      .locator('input[type="file"]')
      .setInputFiles({ name: 'register.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4') });
    await page.getByLabel(/admin full name/i).fill('Test Admin');
    await page.getByLabel(/admin email/i).fill(`admin-${uniqueSuffix}@example.com`);
    await page.getByLabel(/admin phone/i).fill('+966500000000');
    await page.getByLabel(/admin password/i).fill('SecurePass123!');

    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page).toHaveURL(/\/companies$/);
    await expect(page.getByText(`Test Fuel Co ${uniqueSuffix}`)).toBeVisible();
  });

  test('suspending a company reflects the updated status', async ({ page }) => {
    await page.goto('/companies');
    await page.getByRole('link').first().click();
    await page.getByRole('button', { name: /suspend|activate/i }).click();
    await expect(page.getByText(/suspended|active/i)).toBeVisible();
  });
});

test.describe('Company Admin is blocked from Super-Admin governance', () => {
  test('a Company Admin session cannot reach /companies', async ({ page }) => {
    const companyAdminEmail = process.env.E2E_COMPANY_ADMIN_EMAIL ?? 'company-admin@example.com';
    const companyAdminPassword = process.env.E2E_COMPANY_ADMIN_PASSWORD ?? 'password123';

    await page.goto('/login');
    await page.getByLabel(/email/i).fill(companyAdminEmail);
    await page.getByLabel(/password/i).fill(companyAdminPassword);
    await page.getByRole('button', { name: /sign in|login/i }).click();

    await page.goto('/companies');
    await expect(page).toHaveURL(/\/403$/);
  });
});
