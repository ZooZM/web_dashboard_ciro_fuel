import type { FuelType, OrderStatus } from '@/constants/order-status';
import type { StopOrigin, StopReason } from '@/constants/stop-events';

export interface OrderStatusEvent {
  from: OrderStatus;
  to: OrderStatus;
  at: string;
  manualOverride?: boolean;
  overrideReason?: string;
}

export interface DriverSummary {
  fullName: string;
  phone: string;
  plateNumber: string;
}

export interface ClientSummary {
  fullName: string;
  phone: string;
}

export interface TankSummary {
  code: string;
  material: 'IRON' | 'ALUMINIUM';
}

export interface WarehouseSummary {
  name: string;
  addressText: string;
}

export interface VehicleVerificationEntry {
  stage: 'DEPARTURE' | 'LOADING';
  method: string;
  matched: boolean;
  at: string;
}

export interface StationSummary {
  id: string;
  name?: string;
  addressText?: string;
}

export interface RatingSummary {
  score: number;
  review: string | null;
}

/**
 * Feature 009 Phase 3/4 (data-model.md §2 Order): the real shape `GET /orders/:id` returns
 * to an operator/driver role — `tankSummary`/`verifications` are operator-and-driver-only
 * (stripped for CLIENT server-side); the handover code is never part of this shape at all,
 * on any role (FR-071).
 */
export interface Order {
  _id: string;
  status: OrderStatus;
  fuelType: FuelType;
  quantityLiters: number;
  estimatedPrice: number;
  finalPrice: number | null;
  deliveryAddressText: string;
  deliveryLocation: { type: 'Point'; coordinates: [number, number] } | null;
  station: StationSummary | null;
  statusHistory: OrderStatusEvent[];
  createdAt: string;
  driverId: string | null;
  driverSummary: DriverSummary | null;
  clientSummary: ClientSummary | null;
  truckId: string | null;
  tankId: string | null;
  tankSummary: TankSummary | null;
  warehouseId: string | null;
  warehouseSummary: WarehouseSummary | null;
  verifications: VehicleVerificationEntry[];
  vehicleVerified: boolean;
  etaMinutes: number | null;
  driverLocation: { lat: number; lng: number } | null;
  // spec 011 FR-017a: when that position was last reported. Without it the
  // map cannot tell a truck that stopped reporting from one parked at
  // exactly this spot — it draws the same dot for both.
  driverLocationAt: string | null;
  deliveredAt: string | null;
  rating: RatingSummary | null;
  // Feature 010 (driver availability & assignment escalation)
  assignmentAcknowledgedAt: string | null;
  assignmentEscalationSmsAt: string | null;
  assignmentEscalationSkippedReason: 'NO_PHONE' | 'SEND_FAILED' | null;
  assignedWhileIneligible: boolean;
  assignedWhileIneligibleReason: string | null;
  // spec 011 (in-transit stop detection). Operator/driver shapes only —
  // stripped for CLIENT server-side, deliberately: a customer has no business
  // knowing where a truck paused or why.
  stopEvents: StopEvent[];
}

/**
 * spec 011: one stop on one delivery. Unlike every other embedded record on
 * an order, this one carries an `_id` — the resolve action addresses a
 * specific stop, and a delivery can accumulate several across a journey.
 *
 * The four states an administrator can see are combinations of three
 * nullable fields rather than a status enum, so read them in this order:
 * `resolvedAt` set → handled; `reasonGivenAt` set → the driver explained;
 * `escalatedAt` set → nobody answered in time; otherwise → we have asked and
 * are waiting. `origin: DECLARED` cuts across all of it: the driver told us
 * before we asked, and it arrives already answered and already resolved.
 */
export interface StopEvent {
  _id: string;
  origin: StopOrigin;
  detectedAt: string;
  location: { type: 'Point'; coordinates: [number, number] } | null;
  reason: StopReason | null;
  reasonText: string | null;
  reasonGivenAt: string | null;
  expectedDurationMinutes: number | null;
  suppressedUntil: string | null;
  escalatedAt: string | null;
  resolvedAt: string | null;
  resolvedBy: string | null;
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
