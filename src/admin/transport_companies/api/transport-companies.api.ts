import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { CompanyStatus, CompanyType } from '@/constants/order-status';
import type { RegionCode } from '@/constants/regions';

/**
 * spec 017 (operator dashboard) T069/US4 — the operator's view of the
 * platform's transport companies, and the route that onboards one.
 */
export interface TransportCompany {
  _id: string;
  name: string;
  type: CompanyType;
  status: CompanyStatus;
  contactEmail: string;
  contactPhone: string;
  /** TRANSPORT-only: the regions this transporter serves (FR-026). */
  servedRegions: RegionCode[];
  parentFuelCompanyId: string | null;
  createdAt: string;
}

export async function listTransportCompanies(): Promise<TransportCompany[]> {
  const { data } = await apiClient.get<TransportCompany[]>(apiRoutes.companies.list, {
    params: { type: CompanyType.TRANSPORT },
  });
  return data;
}

export async function getTransportCompany(id: string): Promise<TransportCompany> {
  const { data } = await apiClient.get<TransportCompany>(apiRoutes.companies.detail(id));
  return data;
}

/**
 * FR-027/FR-029/FR-030 — the OPERATOR's onboarding route.
 *
 * Distinct from `POST /companies/:id/transporters`, which is the parent fuel
 * company's own: that one takes the parent from the actor's tenant, and a
 * `SUPER_ADMIN` has no tenant, so this one NAMES the parent in the body.
 * `parentFuelCompanyId` is required and immutable — a transport company with no
 * parent is unroutable, because routing resolves a transporter through its
 * parent fuel company.
 */
export interface OnboardTransportCompanyInput {
  name: string;
  contactEmail: string;
  contactPhone: string;
  parentFuelCompanyId: string;
  adminEmail: string;
  adminFullName: string;
  adminPhone: string;
  adminPassword: string;
}

export async function onboardTransportCompany(
  input: OnboardTransportCompanyInput,
): Promise<{ company: TransportCompany; admin: { id: string; email: string } }> {
  const { data } = await apiClient.post<{
    company: TransportCompany;
    admin: { id: string; email: string };
  }>(apiRoutes.companies.onboardTransporter, input);
  return data;
}

/**
 * FR-033 — suspend and reinstate reuse the EXISTING operator-only, type-agnostic
 * status route. No backend change was needed for this at all.
 */
export async function setTransportCompanyStatus(
  id: string,
  status: CompanyStatus,
): Promise<TransportCompany> {
  const { data } = await apiClient.patch<TransportCompany>(apiRoutes.companies.status(id), {
    status,
  });
  return data;
}
