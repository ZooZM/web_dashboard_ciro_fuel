import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CursorPage } from '@/lib/api/pagination';
import type { Order, OrderListParams } from '@/transport_company/orders/types';

export async function listOrders(params: OrderListParams): Promise<CursorPage<Order>> {
  const { data } = await apiClient.get<CursorPage<Order>>(apiRoutes.orders.list, { params });
  return data;
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(apiRoutes.orders.detail(id));
  return data;
}

// Feature 009 T023 (US1): `approve`/`reject`/`forceComplete`/`cancel` removed. All four belong
// to FUEL_COMPANY_ADMIN or CLIENT (`OrdersController.cancel` checks
// `user.role === UserRole.FUEL_COMPANY_ADMIN`, admitting no transporter) — this role receives
// 403 for all of them (FR-070). The spec and contracts/rest-api-delta.md originally named only
// three; `cancel` is a finding from wiring this file, corrected there too. `redispatch`'s
// underlying platform path no longer exists (research.md R1; see dispatch.api.ts for the
// transporter's own actions: getCandidates/assignDriver/overrideVerification/reassignVehicle).
