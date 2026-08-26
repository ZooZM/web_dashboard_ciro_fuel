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
  // Feature 009 T018: the platform paginates by cursor, never `page` — `?status=&cursor=`
  // (contracts/rest-api-delta.md Part 5). Passing `page` here has never done anything; the
  // platform's query parser simply ignores unrecognised keys.
  cursor?: string;
}

// Feature 009 T023: ApproveOrderInput/RejectOrderInput/ForceCompleteOrderInput removed along
// with the mutations and dialogs that used them — approve/reject/force-complete/cancel all
// belong to FUEL_COMPANY_ADMIN or CLIENT, and this role receives 403 for every one (FR-070).
