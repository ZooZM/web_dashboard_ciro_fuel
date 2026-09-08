// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// call-site syntax (e.g. `LitreMovementKind.ORDER_DRAWDOWN`) while remaining fully erasable.
//
// Feature 013 (fuel company admin dashboard) FR-097 — named constants shared across more
// than one phase, defined once here rather than at the point of use in whichever phase
// happens to reach for them first.
//
// Every value mirrors the platform's own enum exactly — `src/common/enums/litre-movement-kind.enum.ts`
// in the platform repo — so a value round-trips through the API without translation at this
// boundary.

export const LitreMovementKind = {
  SHORTFALL_CREDIT: 'SHORTFALL_CREDIT',
  EXCESS_DEBIT: 'EXCESS_DEBIT',
  ORDER_DRAWDOWN: 'ORDER_DRAWDOWN',
  DRAWDOWN_RETURNED: 'DRAWDOWN_RETURNED',
  CORRECTION: 'CORRECTION',
} as const;

export type LitreMovementKind = (typeof LitreMovementKind)[keyof typeof LitreMovementKind];

// Feature 016 (broadcast fuel exchange offers) — replaces feature 014's
// `ExchangeRequestState` entirely (FR-040): the directed request model, and its
// `/fuel-exchange/requests` endpoints, no longer exist. Mirrors
// `src/common/enums/exchange-offer-state.enum.ts` in the platform repo exactly.
export const ExchangeOfferState = {
  OPEN: 'OPEN',
  AWARDED: 'AWARDED',
  WITHDRAWN: 'WITHDRAWN',
  CLOSED_NO_AWARD: 'CLOSED_NO_AWARD',
} as const;

export type ExchangeOfferState = (typeof ExchangeOfferState)[keyof typeof ExchangeOfferState];

// Mirrors `src/common/enums/proposal-outcome.enum.ts` in the platform repo exactly.
export const ProposalOutcome = {
  PROPOSED: 'PROPOSED',
  DECLINED: 'DECLINED',
  AWARDED: 'AWARDED',
  NOT_SELECTED: 'NOT_SELECTED',
} as const;

export type ProposalOutcome = (typeof ProposalOutcome)[keyof typeof ProposalOutcome];

// The `GET /fuel-exchange/offers?direction=` filter — direction is derived by the platform
// from `raisedByCompanyId` against the viewer, never stored per-viewer, so this is a query
// parameter's vocabulary, not an entity field.
export const ExchangeDirection = {
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
  ALL: 'all',
} as const;

export type ExchangeDirection = (typeof ExchangeDirection)[keyof typeof ExchangeDirection];
