import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CursorPage } from '@/lib/api/pagination';
import type { Order } from '@/transport_company/orders/types';
import type { OrderStatus, OrderStatusBucket } from '@/constants/order-status';

/**
 * spec 017 (operator dashboard) T055/US3 — the operator's platform-wide order
 * list, one order in full, and the force-complete action.
 *
 * `GET /orders` **already returned every order on the platform to this role**
 * (research R4) and `toRoleScopedShape` already grants the full restricted
 * record — so this file adds no new list endpoint. What is new is the `bucket`
 * filter and the identifier search.
 *
 * The row type is `Order` from the transport module, reused rather than
 * redeclared: it is the same server shape, and a second copy is a second thing
 * to keep in step with the platform.
 */
export interface AdminOrdersParams {
  /** One of the six working buckets (FR-016). */
  bucket?: OrderStatusBucket;
  /** One real state, narrowing within the bucket when both are given. */
  status?: OrderStatus;
  /**
   * An exact order identifier (FR-016a). **Identifier only** — free-text
   * search over company or station names is explicitly out of scope, because
   * `Order` has no human reference field and the platform carries no text index
   * (research R13). The search box says so.
   */
  orderId?: string;
  cursor?: string;
}

export async function listAdminOrders(
  params: AdminOrdersParams = {},
): Promise<CursorPage<Order>> {
  const { data } = await apiClient.get<CursorPage<Order>>(apiRoutes.orders.list, {
    params,
  });
  return data;
}

export async function getAdminOrder(id: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(apiRoutes.orders.detail(id));
  return data;
}

/**
 * FR-023 — the operator's OWN summary shape, six buckets and a total.
 *
 * Until this feature `GET /orders/summary` handed a `SUPER_ADMIN` the TRANSPORT
 * company's shape: `awaitingAssignment` and `driversOnDuty`, real numbers
 * answering a transporter's questions rather than the operator's (research R5).
 */
export interface PlatformOrderSummary {
  from: string;
  to: string;
  buckets: Record<OrderStatusBucket, number>;
  /** Equals the sum of the six above (FR-023d). */
  total: number;
}

export async function getPlatformOrderSummary(): Promise<PlatformOrderSummary> {
  const { data } = await apiClient.get<PlatformOrderSummary>(apiRoutes.orders.summary);
  return data;
}

/**
 * FR-020/FR-021 — force a delivery closed, with a recorded reason.
 *
 * A 409 at any stage other than `LOADING`/`IN_TRANSIT`/`UNLOADING` is the
 * platform's stated refusal and must be rendered as one, with the row left
 * where it is.
 */
export async function forceCompleteOrder(id: string, reason: string): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.forceComplete(id), {
    reason,
  });
  return data;
}
