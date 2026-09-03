import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as pricingApi from '@/petrol_company/fuel_prices/api/pricing.api';
import type { FuelPriceEntry, PricingConfig } from '@/petrol_company/fuel_prices/api/pricing.api';
import { useSessionStore } from '@/stores/session.store';

function useOwnCompanyId(): string {
  const companyId = useSessionStore((s) => s.user?.companyId);
  if (!companyId) {
    throw new Error('usePricing requires an authenticated FUEL_COMPANY_ADMIN session');
  }
  return companyId;
}

export function useFuelPrices() {
  const companyId = useOwnCompanyId();
  return useQuery({
    queryKey: queryKeys.companies.fuelPrices(companyId),
    queryFn: () => pricingApi.getFuelPrices(companyId),
  });
}

export function useSetFuelPrices() {
  const companyId = useOwnCompanyId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prices: FuelPriceEntry[]) => pricingApi.setFuelPrices(companyId, prices),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.fuelPrices(companyId) });
    },
  });
}

export function usePricingConfig() {
  const companyId = useOwnCompanyId();
  return useQuery({
    queryKey: queryKeys.companies.pricingConfig(companyId),
    queryFn: () => pricingApi.getPricingConfig(companyId),
  });
}

export function useSetPricingConfig() {
  const companyId = useOwnCompanyId();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (config: PricingConfig) => pricingApi.setPricingConfig(companyId, config),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.companies.pricingConfig(companyId) });
    },
  });
}
