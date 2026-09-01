import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { Order } from '@/transport_company/orders/types';

export async function overrideVerification(orderId: string, reason: string): Promise<Order> {
  const { data } = await apiClient.post<Order>(apiRoutes.orders.overrideVerification(orderId), { reason });
  return data;
}

export async function reassignVehicle(orderId: string, truckId: string, tankId: string): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.reassignVehicle(orderId), { truckId, tankId });
  return data;
}
