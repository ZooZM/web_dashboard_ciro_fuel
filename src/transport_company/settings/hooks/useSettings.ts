import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as settingsApi from '@/transport_company/settings/api/settings.api';
import type { FuelPrice } from '@/transport_company/settings/types';

export function useCompanyProfile(companyId: string) {
  return useQuery({
    queryKey: queryKeys.companies.detail(companyId),
    queryFn: () => settingsApi.getCompanyProfile(companyId),
    enabled: Boolean(companyId),
  });
}

export function useUpdateCompanyProfile(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => settingsApi.updateCompanyProfile(companyId, name),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: queryKeys.companies.detail(companyId) }),
  });
}

export function useFuelPrices(companyId: string) {
  return useQuery({
    queryKey: queryKeys.companies.fuelPrices(companyId),
    queryFn: () => settingsApi.getFuelPrices(companyId),
    enabled: Boolean(companyId),
  });
}

export function useSetFuelPrices(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prices: FuelPrice[]) => settingsApi.setFuelPrices(companyId, prices),
    onSuccess: () =>
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.fuelPrices(companyId) }),
  });
}
