import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as dispatchApi from '@/transport_company/orders/api/dispatch.api';
import type { AssignDriverInput } from '@/transport_company/orders/api/dispatch.api';

/**
 * FR-006: on an already-assigned or cancelled refusal, invalidating the order and
 * candidates queries is what "refreshes the order and shows its true current state" — the
 * caller doesn't special-case this response, the refetch does the correcting.
 */
export function useAssignDriver(orderId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: AssignDriverInput) => dispatchApi.assignDriver(orderId, input),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dispatch.candidates(orderId) });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
