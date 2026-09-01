import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as stalledApi from '@/transport_company/orders/api/stalled.api';

/**
 * FR-054/FR-055/FR-056: an override writes no verification record on the platform — it
 * reads as overridden, never as verified, everywhere downstream. This hook does not add
 * any client-side flag to make that true; it is already true from what the platform stores.
 */
export function useOverrideVerification(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reason: string) => stalledApi.overrideVerification(orderId, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useReassignVehicle(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ truckId, tankId }: { truckId: string; tankId: string }) =>
      stalledApi.reassignVehicle(orderId, truckId, tankId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.tanks.all });
    },
  });
}
