import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { RegionCode } from '@/constants/regions';

// spec 013 T086a/T086b/T087/FR-035/FR-036 — `Company.coveredRegions`, the regions THIS
// fuel company covers itself, distinct from `servedRegions` (which regions a
// TRANSPORTER serves, see `transporters.api.ts`). `GET`/`PUT /companies/:id/covered-regions`
// are gated `assertCompanyAccess`, so `:id` is always the acting admin's own company.
export async function getCoveredRegions(companyId: string): Promise<RegionCode[]> {
  const { data } = await apiClient.get<RegionCode[]>(apiRoutes.companies.coveredRegions(companyId));
  return data;
}

export async function setCoveredRegions(companyId: string, regionCodes: RegionCode[]): Promise<RegionCode[]> {
  const { data } = await apiClient.put<RegionCode[]>(apiRoutes.companies.coveredRegions(companyId), {
    regionCodes,
  });
  return data;
}
