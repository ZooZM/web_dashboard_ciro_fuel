import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { Order } from '@/transport_company/orders/types';

/**
 * spec 011 FR-012. "Handled" means the administrator has dealt with it, never
 * that the record goes away: the platform keeps the stop event in full and
 * returns the whole order back, so the card re-renders from the truth rather
 * than from an optimistic guess about what changed.
 */
export async function resolveStop(orderId: string, stopId: string): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.resolveStop(orderId, stopId));
  return data;
}
