// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// `Role.SUPER_ADMIN` call-site syntax while remaining fully erasable.
export const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  COMPANY_ADMIN: 'COMPANY_ADMIN',
  CLIENT: 'CLIENT',
  DRIVER: 'DRIVER',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const DASHBOARD_LOGIN_ROLES = [Role.SUPER_ADMIN, Role.COMPANY_ADMIN] as const;

export type DashboardRole = (typeof DASHBOARD_LOGIN_ROLES)[number];

export function isDashboardRole(role: Role): role is DashboardRole {
  return (DASHBOARD_LOGIN_ROLES as readonly Role[]).includes(role);
}
