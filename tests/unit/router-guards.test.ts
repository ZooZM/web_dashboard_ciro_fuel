import { describe, expect, it } from 'vitest';
import { router } from '@/app/router';
import { Role } from '@/constants/roles';

// Feature 013 T014/FR-004/FR-005/R1: `<ProtectedRoute>`'s own generic behaviour is already
// covered by tests/unit/protected-route.test.tsx — this file asserts the concrete `allow`
// list each real route group in router.tsx actually carries, which is where R1's specific
// defects lived: `/petrolCompany` admitted `[CLIENT, COMPANY_ADMIN]` (a station owner passed
// the guard for the screen that sets their own credit limit and prices) and `/transport`
// admitted `[COMPANY_ADMIN, DRIVER, SUPER_ADMIN]` (a driver reached the admin surface).
// A behavioural test against `allow` alone cannot catch a wrong array wired into the real
// route tree — only reading the actual route config can.
function allowListFor(pathPrefix: string): readonly Role[] {
  const route = router.routes.find((r) => r.path === pathPrefix);
  if (!route) {
    throw new Error(`No route found for ${pathPrefix}`);
  }
  // ProtectedRoute's `allow` prop lives on the element passed to this route — read via the
  // rendered element's props, matching how createBrowserRouter stores it internally.
  const element = route.element as { props?: { allow?: readonly Role[] } } | undefined;
  const allow = element?.props?.allow;
  if (!allow) {
    throw new Error(`Route ${pathPrefix} has no ProtectedRoute allow list`);
  }
  return allow;
}

describe('router.tsx route guards (FR-004, FR-005, SC-001)', () => {
  it('/petrolCompany admits FUEL_COMPANY_ADMIN only', () => {
    expect([...allowListFor('/petrolCompany')].sort()).toEqual([Role.FUEL_COMPANY_ADMIN]);
  });

  it('/transport admits TRANSPORT_COMPANY_ADMIN only', () => {
    expect([...allowListFor('/transport')].sort()).toEqual([Role.TRANSPORT_COMPANY_ADMIN]);
  });

  it('/admin admits SUPER_ADMIN only', () => {
    expect([...allowListFor('/admin')].sort()).toEqual([Role.SUPER_ADMIN]);
  });

  it('no route group admits CLIENT or DRIVER (neither has a dashboard surface)', () => {
    for (const path of ['/petrolCompany', '/transport', '/admin']) {
      const allow = allowListFor(path);
      expect(allow).not.toContain(Role.CLIENT);
      expect(allow).not.toContain(Role.DRIVER);
    }
  });

  it('the former demo role-selection route no longer exists (FR-003)', () => {
    expect(router.routes.some((r) => r.path === '/select-role')).toBe(false);
  });
});
