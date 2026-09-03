import { describe, expect, it } from 'vitest';
import { Role, DASHBOARD_LOGIN_ROLES, isDashboardRole } from '@/constants/roles';

// Feature 013 T013/FR-001/R1: the dashboard's role vocabulary predated the platform's
// split of the combined administrator role into FUEL_COMPANY_ADMIN and
// TRANSPORT_COMPANY_ADMIN — `Role` carried `COMPANY_ADMIN` and neither successor. These
// assertions are written to fail loudly if that regresses, the same discipline
// `order-status.test.ts` already established for the stage vocabulary.
describe('Role vocabulary (FR-001, FR-097)', () => {
  it('has exactly the platform\'s five current roles', () => {
    expect(Object.values(Role).sort()).toEqual(
      ['CLIENT', 'DRIVER', 'FUEL_COMPANY_ADMIN', 'SUPER_ADMIN', 'TRANSPORT_COMPANY_ADMIN'].sort(),
    );
  });

  it('does not carry the superseded combined COMPANY_ADMIN role', () => {
    expect(Object.values(Role)).not.toContain('COMPANY_ADMIN');
    expect('COMPANY_ADMIN' in Role).toBe(false);
  });

  it('carries both successor roles the split introduced', () => {
    expect(Role.FUEL_COMPANY_ADMIN).toBe('FUEL_COMPANY_ADMIN');
    expect(Role.TRANSPORT_COMPANY_ADMIN).toBe('TRANSPORT_COMPANY_ADMIN');
  });
});

describe('DASHBOARD_LOGIN_ROLES (FR-004/FR-005)', () => {
  it('admits exactly the three administrator roles', () => {
    expect([...DASHBOARD_LOGIN_ROLES].sort()).toEqual(
      [Role.SUPER_ADMIN, Role.FUEL_COMPANY_ADMIN, Role.TRANSPORT_COMPANY_ADMIN].sort(),
    );
  });

  it('never admits CLIENT or DRIVER — recognised, but refused (FR-004)', () => {
    expect(isDashboardRole(Role.CLIENT)).toBe(false);
    expect(isDashboardRole(Role.DRIVER)).toBe(false);
  });

  it('isDashboardRole is true for every DASHBOARD_LOGIN_ROLES member', () => {
    for (const role of DASHBOARD_LOGIN_ROLES) {
      expect(isDashboardRole(role)).toBe(true);
    }
  });
});
