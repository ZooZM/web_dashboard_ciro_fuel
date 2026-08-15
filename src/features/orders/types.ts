import type { FuelType, OrderStatus } from '@/constants/order-status';

export interface OrderStatusEvent {
  status: OrderStatus;
  at: string;
  manualOverride?: boolean;
  overrideReason?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  fuelType: FuelType;
  quantityLiters: number;
  estimatedPrice: number;
  finalPrice: number | null;
  clientName: string;
  driverName: string | null;
  statusHistory: OrderStatusEvent[];
  createdAt: string;
}

export interface OrderListParams {
  status?: OrderStatus;
  from?: string;
  to?: string;
  page?: number;
}

export interface ApproveOrderInput {
  finalPrice?: number;
}

export interface RejectOrderInput {
  reason: string;
}

export interface ForceCompleteOrderInput {
  reason: string;
}
