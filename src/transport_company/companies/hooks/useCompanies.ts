import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as companiesApi from '@/transport_company/companies/api/companies.api';
import type { OnboardCompanyInput } from '@/transport_company/companies/types';
import type { CompanyStatus } from '@/constants/order-status';

export function useCompaniesList(page = 1) {
  return useQuery({
    queryKey: [...queryKeys.companies.all, page],
    queryFn: () => companiesApi.listCompanies(page),
  });
}

export function useCompanyDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.companies.detail(id),
    queryFn: () => companiesApi.getCompany(id),
    enabled: Boolean(id),
  });
}

export function useOnboardCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: OnboardCompanyInput) => companiesApi.onboardCompany(input),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.companies.all }),
  });
}

export function useSetCompanyStatus(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: CompanyStatus) => companiesApi.setCompanyStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(id) });
    },
  });
}
