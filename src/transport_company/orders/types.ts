import type { FuelType, OrderStatus, OrderStatusBucket } from '@/constants/order-status';
import type { StopOrigin, StopReason } from '@/constants/stop-events';

export interface OrderStatusEvent {
  from: OrderStatus;
  to: OrderStatus;
  at: string;
  manualOverride?: boolean;
  overrideReason?: string;
}

// Feature 013 T042/FR-020: the four itemised components an order detail screen must
// show (spec 005 D3/FR-011a) — was on the backend schema (`PriceBreakdown`) but absent
// from this type entirely. Optional: orders placed before that feature have none, and
// none is ever back-filled (research R2) — FR-020 requires omitting it, never inventing it.
export interface PriceBreakdown {
  fuelLineTotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  total: number;
  unitPrice: number;
  serviceFeePercent: number;
  taxRatePercent: number;
  currency: string;
  pricedAt: string;
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
/** Mirrors the platform's `PaymentMethod` (spec 004 FR-021). DEFERRED is the one a
 *  transporter carries: it pays the invoice on the client's behalf. */
export type PaymentMethod = 'DIRECT' | 'DEFERRED' | 'CREDIT';

export interface Order {
  _id: string;
  status: OrderStatus;
  fuelType: FuelType;
  quantityLiters: number;
  paymentMethod: PaymentMethod;
  estimatedPrice: number;
  finalPrice: number | null;
  priceBreakdown: PriceBreakdown | null;
  deliveryAddressText: string;
  deliveryLocation: { type: 'Point'; coordinates: [number, number] } | null;
  station: StationSummary | null;
  statusHistory: OrderStatusEvent[];
  createdAt: string;
  // Feature 013 T042: present in the real `toObject()` response for every operator/driver
  // role (never stripped by `toRoleScopedShape`) but was missing from this type entirely —
  // a fuel company administrator's own orders list has no other way to identify the
  // station owner or the transporter an order is routed to.
  clientId: string;
  transportCompanyId: string | null;
  // Set inside the SAME transaction that approves the order (R4 — approval issues the
  // invoice, not delivery). Absent only before approval.
  invoiceId: string | null;
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
  // spec 013 T193/FR-073b/FR-073f: `FUEL_COMPANY_ADMIN`/`SUPER_ADMIN` only — absent (key
  // missing, never null) for every other role and whenever no supplier invoice has been
  // confirmed yet (SC-014c). Never the raw `supplierInvoices` array (never sent to any
  // role, including this one) — this is the server's own shaped, single-current view.
  supplierInvoice?: SupplierInvoiceView;
}

export interface SupplierInvoiceView {
  fileId: string;
  extracted: { quantityLitres?: number; fuelType?: FuelType; reference?: string; issueDate?: string } | null;
  confirmed: { quantityLitres: number; fuelType: FuelType; reference: string; issueDate: string };
  confirmedBy: string | null;
  confirmedAt: string | null;
  orderedQuantityLitres: number;
  suppliedQuantityLitres: number;
  proportionFulfilled: number;
  shortfallLitres: number;
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
  // spec 017 FR-016/FR-016a: role-agnostic — the scoping plugin still limits both to this
  // company's own orders. `orderId` is an exact identifier match; a malformed one is an
  // empty page, never an error.
  bucket?: OrderStatusBucket;
  orderId?: string;
}

// Feature 009 T023: ApproveOrderInput/RejectOrderInput/ForceCompleteOrderInput removed along
// with the mutations and dialogs that used them — approve/reject/force-complete/cancel all
// belong to FUEL_COMPANY_ADMIN or CLIENT, and this role receives 403 for every one (FR-070).
