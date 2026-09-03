import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { RegionCode } from '@/constants/regions';

// spec 013 T082/FR-033: `GET /companies/:id/transporters` — a genuine platform addition
// (found while wiring Phase 5's route-order UI, not a pre-existing endpoint; see
// CompaniesService.findTransporters). The backend returns raw Mongoose documents
// (`_id`, not `id`).
export interface Transporter {
  _id: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  status: 'ACTIVE' | 'SUSPENDED';
  servedRegions: RegionCode[];
  parentFuelCompanyId: string;
  createdAt: string;
}

export interface OnboardTransporterInput {
  name: string;
  contactEmail: string;
  contactPhone: string;
  adminEmail: string;
  adminFullName: string;
  adminPhone: string;
  adminPassword: string;
}

export interface OnboardTransporterResult {
  company: Transporter;
  admin: { id: string; email: string };
}

export async function listTransporters(fuelCompanyId: string): Promise<Transporter[]> {
  const { data } = await apiClient.get<Transporter[]>(apiRoutes.companies.transporters(fuelCompanyId));
  return data;
}

export async function getTransporter(id: string): Promise<Transporter> {
  const { data } = await apiClient.get<Transporter>(apiRoutes.companies.detail(id));
  return data;
}

export async function onboardTransporter(
  fuelCompanyId: string,
  input: OnboardTransporterInput,
): Promise<OnboardTransporterResult> {
  const { data } = await apiClient.post<OnboardTransporterResult>(
    apiRoutes.companies.transporters(fuelCompanyId),
    input,
  );
  return data;
}

export async function assignTransporterRegions(
  transporterId: string,
  regionCodes: RegionCode[],
): Promise<{ servedRegions: RegionCode[] }> {
  const { data } = await apiClient.put<{ servedRegions: RegionCode[] }>(
    apiRoutes.companies.regions(transporterId),
    { regionCodes },
  );
  return data;
}
