import { describe, expect, it } from 'vitest';
import { NAV_BY_ROLE } from '@/components/layout/Sidebar';
import { Role } from '@/constants/roles';

// The defect this guards: the sidebar branched on `role === 'CLIENT'` for the fuel company
// menu — a role that feature 013 removed from `/petrolCompany/*`'s guard entirely — so a
// FUEL_COMPANY_ADMIN fell through to the unnamed `else` and was served the TRANSPORT menu.
// Every link they were offered pointed at /transport/*, which their own route guard
// refuses. Nothing failed: the routes were right, the navigation into them was not.
const SURFACE_PREFIX: Record<string, string> = {
  [Role.SUPER_ADMIN]: '/admin/',
  [Role.FUEL_COMPANY_ADMIN]: '/petrolCompany/',
  [Role.TRANSPORT_COMPANY_ADMIN]: '/transport/',
};

describe('Sidebar navigation is confined to the role that holds it', () => {
  it.each(Object.keys(SURFACE_PREFIX))('%s is only offered its own surface', (role) => {
    const items = NAV_BY_ROLE[role as Role] ?? [];
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.to.startsWith(SURFACE_PREFIX[role])).toBe(true);
    }
  });

  it('offers no navigation to a role that cannot reach the shell', () => {
    // CLIENT and DRIVER are genuine platform roles whose tokens are valid but which every
    // dashboard route refuses. A catch-all `else` is what handed one of them (and, in the
    // defect, a fuel company admin) somebody else's menu.
    expect(NAV_BY_ROLE[Role.CLIENT]).toBeUndefined();
    expect(NAV_BY_ROLE[Role.DRIVER]).toBeUndefined();
  });

  it('gives every entry a distinct destination', () => {
    for (const items of Object.values(NAV_BY_ROLE)) {
      const targets = (items ?? []).map((i) => i.to);
      expect(new Set(targets).size).toBe(targets.length);
    }
  });
});
