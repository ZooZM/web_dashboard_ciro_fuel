import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { ORDER_POLL_INTERVAL_MS } from '@/constants/polling';
import * as ordersApi from '@/transport_company/orders/api/orders.api';
import type { OrderListParams } from '@/transport_company/orders/types';

// FR-020: active order lists/detail stay current by repeated background refresh, at the
// longest interval that still meets the 15s bound (SC-003) — never a live connection; that is
// reserved for the truck's position alone (contracts/realtime-contract.md). Paused when the
// tab is hidden (refetchIntervalInBackground: false, the default) — FR-022.
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

// Feature 009 T023 (US1): useApproveOrder/useRejectOrder/useCancelOrder/useForceCompleteOrder
// removed along with the API calls they wrapped — all four belong to FUEL_COMPANY_ADMIN or
// CLIENT and this role receives 403 for every one (FR-070). The transporter's own mutations
// (useAssignDriver, useOverrideVerification, useReassignVehicle) live in dispatch-related hook
// files, not here — see contracts/dashboard-integration.md Slice 2/5.
