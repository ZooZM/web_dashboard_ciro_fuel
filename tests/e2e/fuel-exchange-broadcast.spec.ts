import { test, expect, type Page } from '@playwright/test';

/**
 * spec 016 (broadcast fuel exchange offers) T103 — raise → two companies propose →
 * award → the non-winner sees a closed offer naming no winner. Against a MOCKED
 * platform (no live backend), mirroring `signin-code.spec.ts`'s own style: written and
 * reviewed here, execution deferred to a session with a running dev server (the same
 * disclosed gap feature 015 left for its own Playwright journeys).
 *
 * One page, three simulated actors: each "switch" re-runs the mocked sign-in flow with
 * a different company id, which is how `bootstrap-session.ts` actually keys tenant
 * identity — there is no separate multi-context orchestration needed for what this
 * journey asserts.
 */
const API = process.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

function jwt(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString('base64url');
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}.sig`;
}

interface Proposal {
  _id: string;
  proposingCompanyId: string;
  proposingCompanyName: string;
  outcome: 'PROPOSED' | 'DECLINED' | 'AWARDED' | 'NOT_SELECTED';
  unitPrice?: number;
  currency?: string;
}

interface Offer {
  _id: string;
  raisedByCompanyId: string;
  raisedByCompanyName: string;
  fuelType: string;
  quantityLitres: number;
  deliveryAt: string;
  city: string;
  state: 'OPEN' | 'AWARDED' | 'WITHDRAWN' | 'CLOSED_NO_AWARD';
  agreedUnitPrice?: number;
  agreedCompanyId?: string;
  proposals: Proposal[];
}

async function signInAs(page: Page, companyId: string, companyName: string) {
  await page.route(`${API}/auth/login/code/request`, (r) =>
    r.fulfill({ status: 202, json: { expiresInMinutes: 5, attemptsAllowed: 5 } }),
  );
  await page.route(`${API}/auth/login/code/verify`, (r) =>
    r.fulfill({
      status: 200,
      json: {
        accessToken: jwt({ sub: `user-${companyId}`, role: 'FUEL_COMPANY_ADMIN', companyId, sid: 'a'.repeat(64), sgen: 0 }),
        refreshToken: jwt({ sub: `user-${companyId}`, role: 'FUEL_COMPANY_ADMIN', companyId, sid: 'a'.repeat(64), sgen: 0 }),
        user: { id: `user-${companyId}`, role: 'FUEL_COMPANY_ADMIN', companyId, fullName: companyName, email: `${companyId}@x.test` },
      },
    }),
  );
  await page.route(`${API}/auth/me`, (r) =>
    r.fulfill({
      status: 200,
      json: { id: `user-${companyId}`, role: 'FUEL_COMPANY_ADMIN', companyId, fullName: companyName, email: `${companyId}@x.test` },
    }),
  );
  await page.goto('/');
  await page.getByPlaceholder('5X XXX XXXX').fill('0512345678');
  await page.getByRole('button', { name: /إرسال رمز التحقق/ }).click();
  await expect(page).toHaveURL(/\/verify/);
  const boxes = page.getByRole('textbox');
  for (let i = 0; i < 6; i++) await boxes.nth(i).fill(String(i));
  await page.getByRole('button', { name: /تسجيل الدخول/ }).click();
  await expect(page).toHaveURL(/\/petrolCompany/);
}

test('raise → two companies propose → award → the non-winner sees a closed offer naming no winner', async ({ page }) => {
  const offer: Offer = {
    _id: 'offer-1',
    raisedByCompanyId: 'company-a',
    raisedByCompanyName: 'Company A',
    fuelType: 'PETROL_95',
    quantityLitres: 10000,
    deliveryAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
    city: 'JEDDAH',
    state: 'OPEN',
    proposals: [],
  };

  function shapeForViewer(companyId: string) {
    const isRaiser = companyId === offer.raisedByCompanyId;
    const mine = offer.proposals.find((p) => p.proposingCompanyId === companyId);
    return {
      _id: offer._id,
      openToMarket: true,
      raisedByCompanyId: offer.raisedByCompanyId,
      raisedByCompanyName: offer.raisedByCompanyName,
      fuelType: offer.fuelType,
      quantityLitres: offer.quantityLitres,
      deliveryAt: offer.deliveryAt,
      city: offer.city,
      state: offer.state,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(isRaiser
        ? {
            proposals: offer.proposals.map((p) => ({
              _id: p._id,
              proposingCompanyId: p.outcome === 'DECLINED' ? undefined : p.proposingCompanyId,
              outcome: p.outcome,
              unitPrice: p.unitPrice,
              currency: p.currency,
              total: p.unitPrice ? p.unitPrice * offer.quantityLitres : undefined,
              respondedAt: new Date().toISOString(),
              company:
                p.outcome === 'DECLINED'
                  ? undefined
                  : { name: p.proposingCompanyName, contactEmail: 'x@x.test', contactPhone: '+9665' },
            })),
            proposalCount: offer.proposals.filter((p) => p.outcome !== 'DECLINED').length,
            declineCount: offer.proposals.filter((p) => p.outcome === 'DECLINED').length,
          }
        : { myProposal: mine ? { _id: mine._id, outcome: mine.outcome, unitPrice: mine.unitPrice, currency: mine.currency, respondedAt: new Date().toISOString() } : undefined }),
      // The offer's own agreed figures are visible only once THIS viewer is entitled
      // (raiser, awarded company, or SA) — a non-winner never sees them (FR-015).
      ...((isRaiser || offer.agreedCompanyId === companyId) && offer.state === 'AWARDED'
        ? { awardedCompanyId: offer.agreedCompanyId, agreedUnitPrice: offer.agreedUnitPrice, currency: 'SAR' }
        : {}),
    };
  }

  await page.route(`${API}/fuel-exchange/offers/summary`, (r) =>
    r.fulfill({ status: 200, json: { incomingAwaitingAnswer: 0, outgoingOpen: 0, awardedThisMonth: 0 } }),
  );
  await page.route(`${API}/fuel-exchange/offers?*`, async (r) => {
    const url = new URL(r.request().url());
    const companyId = JSON.parse(Buffer.from((await r.request().headerValue('authorization'))!.split(' ')[1]!.split('.')[1]!, 'base64url').toString()).companyId as string;
    const direction = url.searchParams.get('direction');
    const isRaiser = companyId === offer.raisedByCompanyId;
    const visible = direction === 'outgoing' ? isRaiser : direction === 'incoming' ? !isRaiser : true;
    await r.fulfill({ status: 200, json: { items: visible ? [shapeForViewer(companyId)] : [], nextCursor: null } });
  });
  await page.route(`${API}/fuel-exchange/offers/${offer._id}`, async (r) => {
    const companyId = JSON.parse(Buffer.from((await r.request().headerValue('authorization'))!.split(' ')[1]!.split('.')[1]!, 'base64url').toString()).companyId as string;
    if (r.request().method() === 'GET') {
      await r.fulfill({ status: 200, json: shapeForViewer(companyId) });
    }
  });
  await page.route(`${API}/fuel-exchange/offers/${offer._id}/proposals`, async (r) => {
    const companyId = JSON.parse(Buffer.from((await r.request().headerValue('authorization'))!.split(' ')[1]!.split('.')[1]!, 'base64url').toString()).companyId as string;
    const body = r.request().postDataJSON() as { unitPrice?: number };
    offer.proposals.push({
      _id: `p-${companyId}`,
      proposingCompanyId: companyId,
      proposingCompanyName: companyId === 'company-b' ? 'Company B' : 'Company C',
      outcome: 'PROPOSED',
      unitPrice: body.unitPrice,
      currency: 'SAR',
    });
    await r.fulfill({ status: 201, json: {} });
  });
  await page.route(`${API}/fuel-exchange/offers/${offer._id}/award`, async (r) => {
    const body = r.request().postDataJSON() as { proposalId: string };
    const winner = offer.proposals.find((p) => p._id === body.proposalId)!;
    offer.state = 'AWARDED';
    offer.agreedCompanyId = winner.proposingCompanyId;
    offer.agreedUnitPrice = winner.unitPrice;
    for (const p of offer.proposals) {
      p.outcome = p._id === body.proposalId ? 'AWARDED' : p.outcome === 'DECLINED' ? 'DECLINED' : 'NOT_SELECTED';
    }
    await r.fulfill({ status: 200, json: shapeForViewer(offer.raisedByCompanyId) });
  });
  await page.route(`${API}/fuel-exchange/offers`, async (r) => {
    if (r.request().method() === 'POST') {
      await r.fulfill({ status: 201, json: shapeForViewer(offer.raisedByCompanyId) });
    }
  });

  // A raises.
  await signInAs(page, 'company-a', 'Company A');
  await page.goto('/petrolCompany/fuel-exchange');
  await expect(page.getByText(offer.raisedByCompanyName).first()).toBeVisible();

  // B proposes.
  await signInAs(page, 'company-b', 'Company B');
  await page.goto(`/petrolCompany/fuel-exchange/${offer._id}`);
  await page.getByRole('button', { name: /submit your offer|propose/i }).click();
  await page.getByPlaceholder('0.00').fill('2.20');
  await page.getByRole('button', { name: /submit offer/i }).click();

  // C proposes, at a higher price.
  await signInAs(page, 'company-c', 'Company C');
  await page.goto(`/petrolCompany/fuel-exchange/${offer._id}`);
  await page.getByRole('button', { name: /submit your offer|propose/i }).click();
  await page.getByPlaceholder('0.00').fill('9.99');
  await page.getByRole('button', { name: /submit offer/i }).click();

  // A reviews both and awards B.
  await signInAs(page, 'company-a', 'Company A');
  await page.goto(`/petrolCompany/fuel-exchange/${offer._id}`);
  await expect(page.getByText('Company B')).toBeVisible();
  await expect(page.getByText('Company C')).toBeVisible();
  page.once('dialog', (d) => void d.accept());
  await page.getByRole('button', { name: /award/i }).first().click();

  // C, the non-winner, sees the offer closed with no winner named.
  await signInAs(page, 'company-c', 'Company C');
  await page.goto(`/petrolCompany/fuel-exchange/${offer._id}`);
  await expect(page.getByText('Awarded')).toBeVisible();
  await expect(page.getByText('Company B')).not.toBeVisible();
  await expect(page.getByText('2.20')).not.toBeVisible();
});
