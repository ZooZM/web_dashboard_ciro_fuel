import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { Order } from '@/transport_company/orders/types';

/**
 * FUEL_COMPANY_ADMIN's own order actions. Extracted here (rather than left inline on
 * `@/transport_company/orders/hooks/useOrders`, where they previously lived despite
 * belonging to a different persona) when feature 009 removed them from the transport
 * surface, which is forbidden all three (FR-070) — this repo had no fuel-company-owned
 * copy for `ApproveOrderDialog`/`RejectOrderDialog`/`ForceCompleteDialog` to fall back to.
 */
export interface ApproveOrderInput {
  finalPrice?: number;
}

export interface RejectOrderInput {
  reason: string;
}

export interface ForceCompleteOrderInput {
  reason: string;
}

export interface RouteOrderInput {
  transportCompanyId: string;
}

export async function approveOrder(id: string, input: ApproveOrderInput): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.approve(id), input);
  return data;
}

export async function rejectOrder(id: string, input: RejectOrderInput): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.reject(id), input);
  return data;
}

export async function forceCompleteOrder(id: string, input: ForceCompleteOrderInput): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.forceComplete(id), input);
  return data;
}

// FR-014: routes an APPROVED order to one of the administrator's affiliated transporters.
export async function routeOrder(id: string, input: RouteOrderInput): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.route(id), input);
  return data;
}

// FR-015: redispatch admits FUEL_COMPANY_ADMIN and CLIENT (spec 004) — this call is the
// FCA path; the client's own redispatch, if this dashboard ever needed it, would be a
// separate concern entirely (a different persona's screen).
export async function redispatchOrder(id: string): Promise<Order> {
  const { data } = await apiClient.post<Order>(apiRoutes.orders.redispatch(id));
  return data;
}
