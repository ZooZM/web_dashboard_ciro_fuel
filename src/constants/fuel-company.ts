// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// call-site syntax (e.g. `LitreMovementKind.ORDER_DRAWDOWN`) while remaining fully erasable.
//
// Feature 013 (fuel company admin dashboard) FR-097 — named constants shared across more
// than one phase, defined once here rather than at the point of use in whichever phase
// happens to reach for them first:
// - `LitreMovementKind`/`ExchangeRequestState` are read by both the fuel company surface
//   (Phases 14/15) and the operator's oversight screens (Phase 16, US13).
// - `ExchangeDirection` is the `?direction=` filter both `GET /fuel-exchange/requests`
//   (contracts/rest-api-delta.md) and the dashboard's incoming/outgoing/all toggle share.
//
// Every value mirrors the platform's own enum exactly — `src/common/enums/litre-movement-kind.enum.ts`
// and `src/common/enums/exchange-request-state.enum.ts` in the platform repo (Phase 14/15 tasks
// T182/T219) — so a value round-trips through the API without translation at this boundary.

export const LitreMovementKind = {
  SHORTFALL_CREDIT: 'SHORTFALL_CREDIT',
  EXCESS_DEBIT: 'EXCESS_DEBIT',
  ORDER_DRAWDOWN: 'ORDER_DRAWDOWN',
  DRAWDOWN_RETURNED: 'DRAWDOWN_RETURNED',
  CORRECTION: 'CORRECTION',
} as const;

export type LitreMovementKind = (typeof LitreMovementKind)[keyof typeof LitreMovementKind];

export const ExchangeRequestState = {
  AWAITING_RESPONSE: 'AWAITING_RESPONSE',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  WITHDRAWN: 'WITHDRAWN',
} as const;

export type ExchangeRequestState = (typeof ExchangeRequestState)[keyof typeof ExchangeRequestState];

// The `GET /fuel-exchange/requests?direction=` filter (FR-084) — direction is derived by the
// platform from `raisedByCompanyId` against the viewer, never stored per-viewer, so this is a
// query parameter's vocabulary, not an entity field.
export const ExchangeDirection = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
  ALL: 'all',
} as const;

export type ExchangeDirection = (typeof ExchangeDirection)[keyof typeof ExchangeDirection];
