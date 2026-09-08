import { test, expect, type Page } from '@playwright/test';

/**
 * spec 015 US2/US3/US7 (T109/T110) — phone → code → dashboard per role, the
 * rate-limited and challenge paths, and the recovery journey, all against a
 * MOCKED platform (no live backend). Run with `npm run test:e2e`.
 */
const API = process.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

const ROLES = [
  { role: 'SUPER_ADMIN', home: /\/admin/ },
  { role: 'FUEL_COMPANY_ADMIN', home: /\/petrolCompany/ },
  { role: 'TRANSPORT_COMPANY_ADMIN', home: /\/transport/ },
] as const;

function jwt(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}.sig`;
}

async function mockAuth(page: Page, role: string) {
  await page.route(`${API}/auth/login/code/request`, (r) =>
    r.fulfill({ status: 202, json: { expiresInMinutes: 5, attemptsAllowed: 5 } }),
  );
  await page.route(`${API}/auth/login/code/verify`, (r) =>
    r.fulfill({
      status: 200,
      json: {
        accessToken: jwt({ sub: 'u1', role, sid: 'a'.repeat(64), sgen: 0 }),
        refreshToken: jwt({ sub: 'u1', role, sid: 'a'.repeat(64), sgen: 0 }),
        user: { id: 'u1', role, companyId: role === 'SUPER_ADMIN' ? null : 'c1', fullName: 'A', email: 'a@x.io' },
      },
    }),
  );
  await page.route(`${API}/auth/me`, (r) =>
    r.fulfill({
      status: 200,
      json: { id: 'u1', role, companyId: role === 'SUPER_ADMIN' ? null : 'c1', fullName: 'A', email: 'a@x.io' },
    }),
  );
}

test.describe('passwordless admin sign-in', () => {
  for (const { role, home } of ROLES) {
    test(`phone → 6-digit code → ${role} lands on their home`, async ({ page }) => {
      await mockAuth(page, role);
      await page.goto('/');
      await page.getByPlaceholder('5X XXX XXXX').fill('0512345678');
      await page.getByRole('button', { name: /إرسال رمز التحقق/ }).click();

      await expect(page).toHaveURL(/\/verify/);
      const boxes = page.getByRole('textbox');
      await expect(boxes).toHaveCount(6); // FR-043
      for (let i = 0; i < 6; i++) await boxes.nth(i).fill(String(i));
      await page.getByRole('button', { name: /تسجيل الدخول/ }).click();

      await expect(page).toHaveURL(home);
    });
  }

  test('a rate-limited request shows the platform retryAfterSeconds', async ({ page }) => {
    await page.route(`${API}/auth/login/code/request`, (r) =>
      r.fulfill({
        status: 429,
        json: { error: 'LOGIN_RATE_LIMITED', message: 'slow down', retryAfterSeconds: 99 },
      }),
    );
    await page.goto('/');
    await page.getByPlaceholder('5X XXX XXXX').fill('0512345678');
    await page.getByRole('button', { name: /إرسال رمز التحقق/ }).click();
    await expect(page.getByText(/99/)).toBeVisible();
  });

  test('a CHALLENGE_REQUIRED response is solved transparently then the request proceeds', async ({ page }) => {
    let call = 0;
    await page.route(`${API}/auth/login/code/request`, (r) => {
      call += 1;
      if (call === 1) {
        return r.fulfill({
          status: 400,
          json: {
            error: 'CHALLENGE_REQUIRED',
            challenge: { seed: 'abcdef', difficultyBits: 0 },
            message: 'verify',
          },
        });
      }
      return r.fulfill({ status: 202, json: { expiresInMinutes: 5, attemptsAllowed: 5 } });
    });
    await page.goto('/');
    await page.getByPlaceholder('5X XXX XXXX').fill('0512345678');
    await page.getByRole('button', { name: /إرسال رمز التحقق/ }).click();
    await expect(page).toHaveURL(/\/verify/);
    expect(call).toBe(2); // solved and resubmitted, no user interaction
  });
});

test.describe('password recovery journey', () => {
  test('request → code → new password returns to sign-in', async ({ page }) => {
    await page.route(`${API}/auth/password-reset/request`, (r) => r.fulfill({ status: 202, json: {} }));
    await page.route(`${API}/auth/password-reset/verify`, (r) =>
      r.fulfill({ status: 200, json: { resetToken: 'rt-1' } }),
    );
    await page.route(`${API}/auth/password-reset/complete`, (r) => r.fulfill({ status: 204, body: '' }));

    await page.goto('/recovery');
    await page.getByPlaceholder('5X XXX XXXX').fill('0512345678');
    await page.getByRole('button', { name: /إرسال الرمز/ }).click();

    await expect(page).toHaveURL(/\/recovery\/verify/);
    const boxes = page.getByRole('textbox');
    for (let i = 0; i < 6; i++) await boxes.nth(i).fill(String(i));
    await page.getByRole('button', { name: /متابعة/ }).click();

    await expect(page).toHaveURL(/\/recovery\/new-password/);
    await page.getByPlaceholder('كلمة المرور الجديدة').fill('BrandNewPass1!');
    await page.getByPlaceholder('تأكيد كلمة المرور').fill('BrandNewPass1!');
    await page.getByRole('button', { name: /حفظ كلمة المرور/ }).click();

    await expect(page).toHaveURL(/\/$/);
  });
});
