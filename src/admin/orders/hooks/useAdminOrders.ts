import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as adminOrdersApi from '@/admin/orders/api/admin-orders.api';

const QK = {
  list: (params: adminOrdersApi.AdminOrdersParams) => ['admin', 'orders', params] as const,
  detail: (id: string) => ['admin', 'orders', id] as const,
  summary: ['admin', 'orders', 'summary'] as const,
};

export function useAdminOrders(params: adminOrdersApi.AdminOrdersParams = {}) {
  return useQuery({
    queryKey: QK.list(params),
    queryFn: () => adminOrdersApi.listAdminOrders(params),
  });
}

export function useAdminOrder(id: string | undefined) {
  return useQuery({
    queryKey: QK.detail(id ?? ''),
    queryFn: () => adminOrdersApi.getAdminOrder(id!),
    enabled: Boolean(id),
  });
}

export function usePlatformOrderSummary() {
  return useQuery({
    queryKey: QK.summary,
    queryFn: () => adminOrdersApi.getPlatformOrderSummary(),
  });
}

/**
 * FR-021 — the refusal is the platform's, and it is rendered as one. Nothing is
 * moved optimistically: the order's stage is the server's answer, so a refused
 * force-complete must leave the row exactly where it was.
 */
export function useForceCompleteOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminOrdersApi.forceCompleteOrder(id, reason),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      void queryClient.invalidateQueries({ queryKey: QK.detail(variables.id) });
    },
  });
}
