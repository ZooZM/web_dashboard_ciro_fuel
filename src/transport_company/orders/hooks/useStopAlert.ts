import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as stopAlertApi from '@/transport_company/orders/api/stop-alert.api';

/**
 * spec 011 FR-012: marks a stop handled.
 *
 * Invalidates the order list as well as the detail: the same alert drives
 * whatever attention marker the list carries, and leaving that stale would
 * show an administrator an alert they had just cleared.
 */
export function useResolveStop(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stopId: string) => stopAlertApi.resolveStop(orderId, stopId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
