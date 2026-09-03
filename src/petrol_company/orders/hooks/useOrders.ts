import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
// Reuses transport_company's fetch functions directly — `listOrders`/`getOrder` are
// role-agnostic (the backend scopes the result by the caller's role/tenant), so a second
// copy of the same two HTTP calls would only duplicate what already works (FR-007's
// "exactly one" principle, applied to fetch logic as well as session state).
import * as ordersApi from '@/transport_company/orders/api/orders.api';
import type { OrderListParams } from '@/transport_company/orders/types';
import { ORDER_POLL_INTERVAL_MS } from '@/constants/polling';

// FR-049: background refresh at the longest interval that still meets each screen's need
// — never a live connection (R11). Paused while the tab is hidden by the global
// `refetchIntervalInBackground: false` default (FR-050, SC-010) — no per-screen check needed.
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
