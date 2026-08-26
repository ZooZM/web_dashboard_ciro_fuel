// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// call-site syntax (e.g. `OrderStatus.APPROVED`) while remaining fully erasable.
//
// Feature 009 Slice 1 (R3/T015): this vocabulary had 8 of the platform's 12 values — missing
// exactly the transporter's own working range. A transport dashboard that cannot express
// AWAITING_ROUTING, ROUTED_TO_TRANSPORT, ASSIGNED_TO_DRIVER or LOADING can only display the
// parts of a delivery that happen before it reaches this company and after it has left.
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

const ALL_ORDER_STATUSES: readonly OrderStatus[] = Object.values(OrderStatus);

/**
 * Every place the dashboard names a delivery's stage MUST recognise the full twelve-value
 * vocabulary (FR-010), and a value it does not recognise MUST render as an explicit unknown,
 * never blank and never the nearest neighbour (FR-011). This is the one function every
 * stage-rendering call site goes through, so there is exactly one place that guarantee can
 * ever be violated.
 */
export function isKnownOrderStatus(status: string): status is OrderStatus {
  return (ALL_ORDER_STATUSES as readonly string[]).includes(status);
}

// i18n keys — see src/lib/i18n/{en,ar}.json's `orderStatus` namespace. `unknown` is the
// FR-011 fallback and is deliberately not one of the twelve platform values.
export const ORDER_STATUS_LABEL_KEY: Record<OrderStatus, string> = {
  [OrderStatus.PENDING_APPROVAL]: 'orderStatus.PENDING_APPROVAL',
  [OrderStatus.APPROVED]: 'orderStatus.APPROVED',
  [OrderStatus.AWAITING_ROUTING]: 'orderStatus.AWAITING_ROUTING',
  [OrderStatus.ROUTED_TO_TRANSPORT]: 'orderStatus.ROUTED_TO_TRANSPORT',
  [OrderStatus.ASSIGNED_TO_DRIVER]: 'orderStatus.ASSIGNED_TO_DRIVER',
  [OrderStatus.PENDING_PAYMENT]: 'orderStatus.PENDING_PAYMENT',
  [OrderStatus.LOADING]: 'orderStatus.LOADING',
  [OrderStatus.IN_TRANSIT]: 'orderStatus.IN_TRANSIT',
  [OrderStatus.UNLOADING]: 'orderStatus.UNLOADING',
  [OrderStatus.DELIVERED]: 'orderStatus.DELIVERED',
  [OrderStatus.REJECTED]: 'orderStatus.REJECTED',
  [OrderStatus.CANCELLED]: 'orderStatus.CANCELLED',
};

export const ORDER_STATUS_UNKNOWN_LABEL_KEY = 'orderStatus.unknown';

/** Resolves the i18n key for a stage, falling back to the FR-011 unknown key for anything
 *  the platform sends that this dashboard's vocabulary has not (yet) been taught. */
export function orderStatusLabelKey(status: string): string {
  return isKnownOrderStatus(status) ? ORDER_STATUS_LABEL_KEY[status] : ORDER_STATUS_UNKNOWN_LABEL_KEY;
}

// Visual treatment. `unknown` gets its own neutral-but-conspicuous tone — it must never be
// mistaken for a recognised, healthy stage.
export const ORDER_STATUS_TONE = {
  [OrderStatus.PENDING_APPROVAL]: 'pending',
  [OrderStatus.APPROVED]: 'info',
  [OrderStatus.AWAITING_ROUTING]: 'pending',
  [OrderStatus.ROUTED_TO_TRANSPORT]: 'actionable',
  [OrderStatus.ASSIGNED_TO_DRIVER]: 'info',
  [OrderStatus.PENDING_PAYMENT]: 'pending',
  [OrderStatus.LOADING]: 'info',
  [OrderStatus.IN_TRANSIT]: 'progress',
  [OrderStatus.UNLOADING]: 'progress',
  [OrderStatus.DELIVERED]: 'success',
  [OrderStatus.REJECTED]: 'danger',
  [OrderStatus.CANCELLED]: 'neutral',
} as const satisfies Record<OrderStatus, string>;

export type OrderStatusTone = (typeof ORDER_STATUS_TONE)[OrderStatus] | 'unknown';

export function orderStatusTone(status: string): OrderStatusTone {
  return isKnownOrderStatus(status) ? ORDER_STATUS_TONE[status] : 'unknown';
}

/** Assignable = this transporter's own work queue (FR-009). Exactly one value: the moment
 *  before assignment exists. */
export function isAssignableOrderStatus(status: OrderStatus): boolean {
  return status === OrderStatus.ROUTED_TO_TRANSPORT;
}

/** Trackable mirrors the platform's own `order:watch` refusal rule exactly (contracts/
 *  realtime-contract.md) — this is not a judgement the dashboard makes independently, it is
 *  a restatement of what the platform already enforces, kept here only so every screen asks
 *  the same question the same way. */
export function isTrackableOrderStatus(status: OrderStatus): boolean {
  return status === OrderStatus.IN_TRANSIT || status === OrderStatus.UNLOADING;
}

export function isTerminalOrderStatus(status: OrderStatus): boolean {
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

export const FuelType = {
  OCTANE_91: '91',
  OCTANE_95: '95',
  OCTANE_98: '98',
  DIESEL: 'DIESEL',
} as const;

export type FuelType = (typeof FuelType)[keyof typeof FuelType];

export const FUEL_TYPES: readonly FuelType[] = [
  FuelType.OCTANE_91,
  FuelType.OCTANE_95,
  FuelType.OCTANE_98,
  FuelType.DIESEL,
];

export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export const DEFAULT_LANGUAGE: Language = 'ar';

export function directionForLanguage(language: Language): Direction {
  return language === 'ar' ? 'rtl' : 'ltr';
}
