import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as deliveryRatesApi from '@/transport_company/delivery_areas/api/delivery-rates.api';
import type { DeliveryRate } from '@/transport_company/delivery_areas/api/delivery-rates.api';

export function useDeliveryRates(companyId: string) {
  return useQuery({
    queryKey: queryKeys.companies.deliveryRates(companyId),
    queryFn: () => deliveryRatesApi.getDeliveryRates(companyId),
    enabled: Boolean(companyId),
  });
}

export function useSetDeliveryRates(companyId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rates: Omit<DeliveryRate, 'updatedAt'>[]) =>
      deliveryRatesApi.setDeliveryRates(companyId, rates),
    onSuccess: () =>
      void queryClient.invalidateQueries({
        queryKey: queryKeys.companies.deliveryRates(companyId),
      }),
  });
}
