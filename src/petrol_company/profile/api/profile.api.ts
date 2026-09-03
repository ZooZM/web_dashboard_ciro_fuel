import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

// Feature 013 T126/FR-054: `GET /auth/me` — the same endpoint `bootstrap-session.ts`
// already calls at login, reused here rather than a second fetch path.
export interface MeProfile {
  id: string;
  role: string;
  companyId: string | null;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export async function getMe(): Promise<MeProfile> {
  const { data } = await apiClient.get<MeProfile>(apiRoutes.auth.me);
  return data;
}

// `UpdateUserDto` whitelists only fullName/phone (role/companyId immutable) — this screen
// only ever edits fullName; phone change goes through the separate OTP-verified flow
// below (spec 005 T097), and email is not in the whitelist at all (immutable).
export async function updateMyName(id: string, fullName: string): Promise<MeProfile> {
  const { data } = await apiClient.patch<MeProfile>(apiRoutes.users.detail(id), { fullName });
  return data;
}

// spec 005 T097/FR-035 — any authenticated role may change their own phone via a real
// 6-digit OTP (never 4, and the code goes to the NEW number, not the old one).
export async function requestPhoneVerification(newPhone: string): Promise<void> {
  await apiClient.post(apiRoutes.users.phoneVerificationRequest, { newPhone });
}

export async function confirmPhoneVerification(code: string): Promise<MeProfile> {
  const { data } = await apiClient.post<MeProfile>(apiRoutes.users.phoneVerificationConfirm, { code });
  return data;
}

export interface MyCompany {
  _id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export async function getMyCompany(companyId: string): Promise<MyCompany> {
  const { data } = await apiClient.get<MyCompany>(apiRoutes.companies.detail(companyId));
  return data;
}
