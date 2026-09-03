// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// `Role.SUPER_ADMIN` call-site syntax while remaining fully erasable.
//
// Feature 013 (fuel company admin dashboard) FR-001/R1: the platform's role vocabulary
// split the original combined `COMPANY_ADMIN` into two roles (spec 004) — this constant
// predated that split and had never been updated to match. `COMPANY_ADMIN` is DELETED, not
// aliased: every consumer must name `FUEL_COMPANY_ADMIN` or `TRANSPORT_COMPANY_ADMIN`
// explicitly, since conflating them is exactly the defect this feature exists to close
// (`/petrolCompany/*` admitted `COMPANY_ADMIN`, which meant it silently admitted every
// transport company administrator too).
export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  FUEL_COMPANY_ADMIN: 'FUEL_COMPANY_ADMIN',
  TRANSPORT_COMPANY_ADMIN: 'TRANSPORT_COMPANY_ADMIN',
  CLIENT: 'CLIENT',
  DRIVER: 'DRIVER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

// CLIENT and DRIVER are platform roles the dashboard recognises (a mobile-only user's
// token is valid and must be told apart from an invalid one) but never admits to any
// dashboard route — FR-004/FR-005 refuse them before any out-of-scope fetch is issued.
export const DASHBOARD_LOGIN_ROLES = [
  Role.SUPER_ADMIN,
  Role.FUEL_COMPANY_ADMIN,
  Role.TRANSPORT_COMPANY_ADMIN,
] as const;

export type DashboardRole = (typeof DASHBOARD_LOGIN_ROLES)[number];

export function isDashboardRole(role: Role): role is DashboardRole {
  return (DASHBOARD_LOGIN_ROLES as readonly Role[]).includes(role);
}
