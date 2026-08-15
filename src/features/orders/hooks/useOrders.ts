import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { ORDER_POLL_INTERVAL_MS } from '@/constants/polling';
import * as ordersApi from '@/features/orders/api/orders.api';
import type {
  OrderListParams,
  ApproveOrderInput,
  RejectOrderInput,
  ForceCompleteOrderInput,
} from '@/features/orders/types';

// FR-012a: active order lists/detail auto-refresh via polling — no Socket.io in v1.
// Paused when the tab is hidden (refetchIntervalInBackground: false, the default).
export function useOrdersList(params: OrderListParams) {
  return useQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => ordersApi.listOrders(params),
    refetchInterval: ORDER_POLL_INTERVAL_MS,
  });
}

export function useOrderDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => ordersApi.getOrder(id),
    refetchInterval: ORDER_POLL_INTERVAL_MS,
    enabled: Boolean(id),
  });
}

function useInvalidateOrder(id: string) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
    void queryClient.invalidateQueries({ queryKey: ['orders'] });
  };
}

export function useApproveOrder(id: string) {
  const invalidate = useInvalidateOrder(id);
  return useMutation({
    mutationFn: (input: ApproveOrderInput) => ordersApi.approveOrder(id, input),
    onSuccess: invalidate,
  });
}

export function useRejectOrder(id: string) {
  const invalidate = useInvalidateOrder(id);
  return useMutation({
    mutationFn: (input: RejectOrderInput) => ordersApi.rejectOrder(id, input),
    onSuccess: invalidate,
  });
}

export function useCancelOrder(id: string) {
  const invalidate = useInvalidateOrder(id);
  return useMutation({
    mutationFn: () => ordersApi.cancelOrder(id),
    onSuccess: invalidate,
  });
}

export function useForceCompleteOrder(id: string) {
  const invalidate = useInvalidateOrder(id);
  return useMutation({
    mutationFn: (input: ForceCompleteOrderInput) => ordersApi.forceCompleteOrder(id, input),
    onSuccess: invalidate,
  });
}
