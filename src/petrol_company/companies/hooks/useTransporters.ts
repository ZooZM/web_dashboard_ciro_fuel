import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as transportersApi from '@/petrol_company/companies/api/transporters.api';
import type { OnboardTransporterInput } from '@/petrol_company/companies/api/transporters.api';
import * as ownCompanyApi from '@/petrol_company/companies/api/own-company.api';
import type { RegionCode } from '@/constants/regions';
import { useSessionStore } from '@/stores/session.store';

function useOwnCompanyId(): string {
  const companyId = useSessionStore((s) => s.user?.companyId);
  if (!companyId) {
    throw new Error('useTransporters requires an authenticated FUEL_COMPANY_ADMIN session');
  }
  return companyId;
}

export function useTransporters() {
  const companyId = useOwnCompanyId();
  return useQuery({
    queryKey: queryKeys.companies.transporters(companyId),
    queryFn: () => transportersApi.listTransporters(companyId),
  });
}

export function useTransporterDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.companies.detail(id),
    queryFn: () => transportersApi.getTransporter(id),
    enabled: Boolean(id),
  });
}

export function useOnboardTransporter() {
  const companyId = useOwnCompanyId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OnboardTransporterInput) => transportersApi.onboardTransporter(companyId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.transporters(companyId) });
    },
  });
}

export function useAssignTransporterRegions(transporterId: string) {
  const companyId = useOwnCompanyId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (regionCodes: RegionCode[]) =>
      transportersApi.assignTransporterRegions(transporterId, regionCodes),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(transporterId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.transporters(companyId) });
    },
  });
}

// T087 — the regions THIS fuel company covers itself, distinct from the hook above
// (which sets a TRANSPORTER's own `servedRegions`).
export function useCoveredRegions() {
  const companyId = useOwnCompanyId();
  return useQuery({
    queryKey: queryKeys.companies.coveredRegions(companyId),
    queryFn: () => ownCompanyApi.getCoveredRegions(companyId),
  });
}

export function useSetCoveredRegions() {
  const companyId = useOwnCompanyId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (regionCodes: RegionCode[]) => ownCompanyApi.setCoveredRegions(companyId, regionCodes),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.coveredRegions(companyId) });
    },
  });
}
