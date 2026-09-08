import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { GovernorateCode, RegionCode } from '@/constants/regions';

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

export interface CreateOwnerStationInput {
  regionCode: RegionCode;
  governorateCode: GovernorateCode;
  latitude: number;
  longitude: number;
  name?: string;
  addressText?: string;
}

export interface CreateOwnerInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  /**
   * REQUIRED by the platform, not optional convenience: `UsersController.create` refuses a
   * CLIENT with no station outright — "station is required for CLIENT accounts" (400) — and
   * this screen omitted it entirely, so onboarding an owner could never once have succeeded.
   * The account and its first station are one transaction server-side; further stations are
   * added afterwards from the owner-detail screen (`POST /users/:id/stations`).
   */
  station: CreateOwnerStationInput;
}

// FR-025/FR-028: onboarding a station owner is `POST /users` with role CLIENT — the
// same endpoint client self-registration never uses (an admin-provisioned account has no
// self-registration path at all, spec 004). `CreateUserDto` requires a password (min 8
// chars) issued by the admin here.
//
// spec 015 R11: an earlier version of this comment said "`POST /auth/login` is the sole
// login route" — that is no longer true. Administrators now also sign in with a mobile
// number and an SMS code (`/auth/login/code/*`). A station owner is a CLIENT, though, and
// still signs in with phone + password on the mobile app, so this flow is unaffected.
export async function createOwner(input: CreateOwnerInput): Promise<UserSummary> {
  const { station, ...account } = input;
  const { data } = await apiClient.post<UserSummary>(apiRoutes.users.create, {
    role: 'CLIENT',
    ...account,
    // `StationDto` takes a nested `location: { latitude, longitude }`, the same
    // `GeoPointDto` `POST /users/:id/stations` uses — never two flat coordinate fields.
    station: {
      regionCode: station.regionCode,
      governorateCode: station.governorateCode,
      location: { latitude: station.latitude, longitude: station.longitude },
      ...(station.name ? { name: station.name } : {}),
      ...(station.addressText ? { addressText: station.addressText } : {}),
    },
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
