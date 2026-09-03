// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// call-site syntax (e.g. `OrderStatus.APPROVED`) while remaining fully erasable.
//
// Feature 013 (fuel company admin dashboard) Phase 4/T031/T032/FR-010/FR-011/R1: the
// dashboard had 8 of the platform's 12 stages — missing exactly `AWAITING_ROUTING`,
// `ROUTED_TO_TRANSPORT`, `ASSIGNED_TO_DRIVER` and `LOADING`. Mirrors
// `src/common/enums/order-status.enum.ts` exactly (FR-097).
export const OrderStatus = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  AWAITING_ROUTING: 'AWAITING_ROUTING',
  ROUTED_TO_TRANSPORT: 'ROUTED_TO_TRANSPORT',
  ASSIGNED_TO_DRIVER: 'ASSIGNED_TO_DRIVER',
  PENDING_PAYMENT: 'PENDING_PAYMENT',
  LOADING: 'LOADING',
  IN_TRANSIT: 'IN_TRANSIT',
  UNLOADING: 'UNLOADING',
  DELIVERED: 'DELIVERED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

const KNOWN_STATUSES: ReadonlySet<string> = new Set(Object.values(OrderStatus));

/** FR-010: does the platform's current vocabulary recognise this value at all. */
export function isKnownOrderStatus(status: string): status is OrderStatus {
  return KNOWN_STATUSES.has(status);
}

export type OrderStatusTone =
  | 'pending'
  | 'info'
  | 'actionable'
  | 'progress'
  | 'success'
  | 'danger'
  | 'neutral'
  | 'unknown';

// FR-011: total over every value above, no extras — enforced by
// tests/unit/order-status.test.ts. An unrecognised value never falls through to a
// neighbour's styling; OrderStatusBadge.tsx keys its style table on this type precisely
// so a status this dashboard hasn't been taught yet still renders, conspicuously, rather
// than silently matching whatever tone happens to be defined for undefined lookups.
export const ORDER_STATUS_TONE: Record<OrderStatus, OrderStatusTone> = {
  PENDING_APPROVAL: 'pending',
  APPROVED: 'info',
  AWAITING_ROUTING: 'actionable',
  ROUTED_TO_TRANSPORT: 'actionable',
  ASSIGNED_TO_DRIVER: 'progress',
  PENDING_PAYMENT: 'pending',
  LOADING: 'progress',
  IN_TRANSIT: 'progress',
  UNLOADING: 'progress',
  DELIVERED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'neutral',
};

export const ORDER_STATUS_UNKNOWN_LABEL_KEY = 'orderStatus.unknown';

// FR-011: total over every value above, no extras. Leaf matches the status value itself
// (e.g. `orderStatus.LOADING`) so a translator adding a new platform status has exactly
// one convention to follow, verified against en/ar.json by the test suite.
export const ORDER_STATUS_LABEL_KEY: Record<OrderStatus, string> = Object.fromEntries(
  Object.values(OrderStatus).map((status) => [status, `orderStatus.${status}`]),
) as Record<OrderStatus, string>;

/** FR-011: an unrecognised value renders as explicit unknown, never blank, never a neighbour. */
export function orderStatusLabelKey(status: string): string {
  return isKnownOrderStatus(status) ? ORDER_STATUS_LABEL_KEY[status] : ORDER_STATUS_UNKNOWN_LABEL_KEY;
}

export function orderStatusTone(status: string): OrderStatusTone {
  return isKnownOrderStatus(status) ? ORDER_STATUS_TONE[status] : 'unknown';
}

// FR-009/FR-017/data-model.md §1.2 — derived predicates, each backed by exactly one
// platform rule rather than re-implemented per screen:

/** The one status from which a transporter can be assigned (`POST /dispatch/orders/:id/assign`). */
export function isAssignableOrderStatus(status: string): boolean {
  return status === OrderStatus.ROUTED_TO_TRANSPORT;
}

/** Mirrors the platform's own `order:watch` trackability rule exactly (IN_TRANSIT, UNLOADING only)
 *  — LOADING is deliberately NOT trackable, the stage this dashboard could not previously express. */
export function isTrackableOrderStatus(status: string): boolean {
  return status === OrderStatus.IN_TRANSIT || status === OrderStatus.UNLOADING;
}

/** An order in one of these states will never change again. */
export function isTerminalOrderStatus(status: string): boolean {
  return (
    status === OrderStatus.DELIVERED ||
    status === OrderStatus.REJECTED ||
    status === OrderStatus.CANCELLED
  );
}

export const CompanyStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
} as const;

export type CompanyStatus = (typeof CompanyStatus)[keyof typeof CompanyStatus];

// spec 010 (driver availability & assignment escalation) FR-002/FR-004: a computed
// classification, never stored on `User` — mirrors
// `src/common/enums/driver-eligibility.enum.ts` exactly. Four values, not a boolean: the
// two ineligible-but-selectable-with-a-reason states (offline vs. already committed) are
// shown distinctly, and INACTIVE is a separate, never-selectable-at-all state.
export const DriverEligibility = {
  ELIGIBLE: 'ELIGIBLE',
  BUSY: 'BUSY',
  OFFLINE: 'OFFLINE',
  INACTIVE: 'INACTIVE',
} as const;

export type DriverEligibility = (typeof DriverEligibility)[keyof typeof DriverEligibility];

// Feature 013 T033/R1: this dashboard's fuel-grade constant was fabricated outright
// (`{OCTANE_91:'91', OCTANE_95:'95', OCTANE_98:'98', DIESEL}`) against values the platform
// has never sent. Mirrors `src/common/enums/fuel-type.enum.ts` exactly (FR-037, FR-097).
export const FuelType = {
  DIESEL: 'DIESEL',
  PETROL_91: 'PETROL_91',
  PETROL_95: 'PETROL_95',
  KEROSENE: 'KEROSENE',
} as const;

export type FuelType = (typeof FuelType)[keyof typeof FuelType];

export const FUEL_TYPES: readonly FuelType[] = [
  FuelType.DIESEL,
  FuelType.PETROL_91,
  FuelType.PETROL_95,
  FuelType.KEROSENE,
];

// Phase 8 (US5) T094 — same leaf-matches-value convention as `ORDER_STATUS_LABEL_KEY`.
export const FUEL_TYPE_LABEL_KEY: Record<FuelType, string> = Object.fromEntries(
  FUEL_TYPES.map((type) => [type, `fuelType.${type}`]),
) as Record<FuelType, string>;

export function fuelTypeLabelKey(type: string): string {
  return (FUEL_TYPES as readonly string[]).includes(type)
    ? FUEL_TYPE_LABEL_KEY[type as FuelType]
    : 'fuelType.unknown';
}

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export const DEFAULT_LANGUAGE: Language = 'ar';

export function directionForLanguage(language: Language): Direction {
  return language === 'ar' ? 'rtl' : 'ltr';
}
