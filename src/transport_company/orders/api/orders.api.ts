import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type {
  Order,
  OrderListParams,
  ApproveOrderInput,
  RejectOrderInput,
  ForceCompleteOrderInput,
} from '@/transport_company/orders/types';

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
}

export async function listOrders(params: OrderListParams): Promise<Paginated<Order>> {
  const { data } = await apiClient.get<Paginated<Order>>(apiRoutes.orders.list, { params });
  return data;
}

export async function getOrder(id: string): Promise<Order> {
  const { data } = await apiClient.get<Order>(apiRoutes.orders.detail(id));
  return data;
}

export async function approveOrder(id: string, input: ApproveOrderInput): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.approve(id), input);
  return data;
}

export async function rejectOrder(id: string, input: RejectOrderInput): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.reject(id), input);
  return data;
}

export async function cancelOrder(id: string): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.cancel(id));
  return data;
}

export async function forceCompleteOrder(id: string, input: ForceCompleteOrderInput): Promise<Order> {
  const { data } = await apiClient.patch<Order>(apiRoutes.orders.forceComplete(id), input);
  return data;
}

export async function redispatchOrder(id: string): Promise<{ assigned: boolean }> {
  const { data } = await apiClient.post<{ assigned: boolean }>(apiRoutes.orders.redispatch(id));
  return data;
}
