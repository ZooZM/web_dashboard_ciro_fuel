import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

// spec 013: `GET /users/:id` — role-agnostic, tenant-isolated by `User`'s own
// `markTenantScoped` marker (a cross-tenant id 404s automatically). Used here for a
// single station owner lookup (order-detail's customer card); Phase 6's fuller owners
// list/onboarding lives alongside this file.
export interface UserSummary {
  _id: string;
  role: string;
  companyId: string | null;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  creditLimit?: number | null;
  createdAt: string;
}

export async function getUser(id: string): Promise<UserSummary> {
  const { data } = await apiClient.get<UserSummary>(apiRoutes.users.detail(id));
  return data;
}

// FR-025: every CLIENT account the acting fuel company has provisioned — a "station
// owner" in dashboard vocabulary is simply a CLIENT (spec 013's Assumptions). Tenant-
// scoped automatically, matching `findAllForCompany` for stations (T058's precedent).
export async function listOwners(): Promise<UserSummary[]> {
  const { data } = await apiClient.get<UserSummary[]>(apiRoutes.users.list, {
    params: { role: 'CLIENT' },
  });
  return data;
}

export interface CreateOwnerInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

// FR-025/FR-028: onboarding a station owner is `POST /users` with role CLIENT — the
// same endpoint client self-registration never uses (an admin-provisioned account has no
// self-registration path at all, spec 004). `CreateUserDto` requires a password (min 8
// chars) issued by the admin here; there is no OTP-only login on this platform (`POST
// /auth/login` is the sole login route) — Figma's mock described a passwordless OTP flow
// this platform does not have, and the form was corrected to collect one instead.
export async function createOwner(input: CreateOwnerInput): Promise<UserSummary> {
  const { data } = await apiClient.post<UserSummary>(apiRoutes.users.create, {
    role: 'CLIENT',
    ...input,
  });
  return data;
}

export async function activateOwner(id: string): Promise<UserSummary> {
  const { data } = await apiClient.patch<UserSummary>(apiRoutes.users.activate(id));
  return data;
}

export async function deactivateOwner(id: string): Promise<UserSummary> {
  const { data } = await apiClient.patch<UserSummary>(apiRoutes.users.deactivate(id));
  return data;
}

export interface CreditStanding {
  creditLimit: number | null;
  available: number | null;
  consumed: number | null;
}

// spec 013 T077 — `GET /users/:id/credit-limit`, the admin-facing read counterpart added
// alongside this phase's dashboard work (backend `users.controller.ts`).
export async function getCreditStanding(id: string): Promise<CreditStanding> {
  const { data } = await apiClient.get<CreditStanding>(apiRoutes.users.creditLimit(id));
  return data;
}

// FR-032: setting a new limit returns the resulting standing in the same response —
// never a second read to reconcile.
export async function setCreditLimit(id: string, creditLimit: number): Promise<CreditStanding> {
  const { data } = await apiClient.put<CreditStanding>(apiRoutes.users.creditLimit(id), {
    creditLimit,
  });
  return data;
}
