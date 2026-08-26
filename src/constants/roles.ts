// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// `Role.SUPER_ADMIN` call-site syntax while remaining fully erasable.
//
// Feature 009 R1: this vocabulary predated the platform's spec 004 role split and still named a
// single `COMPANY_ADMIN`. That gap discarded a genuine TRANSPORT_COMPANY_ADMIN token at boot
// (bootstrap-session.ts) and let a DRIVER reach both admin surfaces via a stale route guard — see
// specs/009-transport-dashboard-order-lifecycle/research.md R1.
export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  FUEL_COMPANY_ADMIN: 'FUEL_COMPANY_ADMIN',
  TRANSPORT_COMPANY_ADMIN: 'TRANSPORT_COMPANY_ADMIN',
  CLIENT: 'CLIENT',
  DRIVER: 'DRIVER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

// CLIENT and DRIVER are mobile-only personas and must never hold a dashboard session (FR-068).
export const DASHBOARD_LOGIN_ROLES = [
  Role.SUPER_ADMIN,
  Role.FUEL_COMPANY_ADMIN,
  Role.TRANSPORT_COMPANY_ADMIN,
] as const;

export type DashboardRole = (typeof DASHBOARD_LOGIN_ROLES)[number];

export function isDashboardRole(role: Role): role is DashboardRole {
  return (DASHBOARD_LOGIN_ROLES as readonly Role[]).includes(role);
}
