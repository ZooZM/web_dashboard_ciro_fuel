import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '@/admin/transport_companies/api/transport-companies.api';
import type { CompanyStatus } from '@/constants/order-status';

const QK = {
  list: ['admin', 'transport-companies'] as const,
  detail: (id: string) => ['admin', 'transport-companies', id] as const,
};

export function useTransportCompanyDetail(id: string | undefined) {
  return useQuery({
    queryKey: QK.detail(id ?? ''),
    queryFn: () => api.getTransportCompany(id!),
    enabled: Boolean(id),
  });
}

export function useOnboardTransportCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.OnboardTransportCompanyInput) =>
      api.onboardTransportCompany(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QK.list });
    },
  });
}

export function useSetTransportCompanyStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CompanyStatus }) =>
      api.setTransportCompanyStatus(id, status),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: QK.list });
      void queryClient.invalidateQueries({ queryKey: QK.detail(variables.id) });
    },
  });
}
