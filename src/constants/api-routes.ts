// Feature 013 T038/FR-097: routes every later phase's `api/*.api.ts` file consumes are
// defined once here, never as a literal path at the point of use. The `contracts/
// rest-api-delta.md` column in each comment names the phase that actually wires the
// route — most of these have no consumer yet and are added ahead of their phase so the
// route constant, not the literal string, is what a phase author reaches for first.
export const apiRoutes = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    me: '/auth/me',
    logout: '/auth/logout',
    // spec 015 (dashboard auth) — passwordless administrator sign-in.
    loginCodeRequest: '/auth/login/code/request',
    loginCodeVerify: '/auth/login/code/verify',
    // spec 015 US7 — SMS password recovery (existing, unchanged platform endpoints).
    passwordResetRequest: '/auth/password-reset/request',
    passwordResetVerify: '/auth/password-reset/verify',
    passwordResetComplete: '/auth/password-reset/complete',
    // spec 017 (operator dashboard) — the operator's own identity, session count
    // and last sign-in. SUPER_ADMIN only; distinct from `me`, which every role reads.
    meAccount: '/auth/me/account',
  },
  companies: {
    list: '/companies',
    create: '/companies',
    detail: (id: string) => `/companies/${id}`,
    status: (id: string) => `/companies/${id}/status`,
    fuelPrices: (id: string) => `/companies/${id}/fuel-prices`,
    pricingConfig: (id: string) => `/companies/${id}/pricing-config`, // Phase 8 (US5)
    transporters: (id: string) => `/companies/${id}/transporters`, // Phase 7 (US4)
    regions: (id: string) => `/companies/${id}/regions`, // Phase 7 (US4) — :id is the transporter
    coveredRegions: (id: string) => `/companies/${id}/covered-regions`, // Phase 7 (US4), T086b
    commissionCeiling: (id: string) => `/companies/${id}/commission-ceiling`, // Phase 12 (US9)
    // :id is the TRANSPORT company. GET is readable by the transporter AND its parent fuel
    // company; PUT is TRANSPORT_COMPANY_ADMIN and self-only — a fuel company may read what
    // its transporter charges but may never set it.
    deliveryRates: (id: string) => `/companies/${id}/delivery-rates`,
    // spec 017 (operator dashboard) FR-027 — the OPERATOR's onboarding route. Distinct
    // from `transporters(id)` above, which is the parent fuel company's own route: this
    // one NAMES the parent in the body rather than taking it from the actor's tenant.
    onboardTransporter: '/companies/transporters',
    // `exchangePartners` is REMOVED (feature 016, FR-040, research R10) — its only
    // consumer was the directed model's recipient selector, which no longer exists.
  },
  users: {
    list: '/users',
    create: '/users',
    detail: (id: string) => `/users/${id}`,
    activate: (id: string) => `/users/${id}/activate`,
    deactivate: (id: string) => `/users/${id}/deactivate`,
    truck: (id: string) => `/users/${id}/truck`,
    stations: (id: string) => `/users/${id}/stations`, // Phase 6 (US3)
    creditLimit: (id: string) => `/users/${id}/credit-limit`, // Phase 6 (US3)
    creditLimitRequests: '/users/me/credit-limit-requests', // Phase 6 (US3), client side
    phoneVerificationRequest: '/users/me/phone/verification', // Phase 11 (US8)
    phoneVerificationConfirm: '/users/me/phone/verification/confirm', // Phase 11 (US8)
  },
  orders: {
    list: '/orders',
    summary: '/orders/summary', // Phase 10 (US7), T109
    quote: '/orders/quote',
    detail: (id: string) => `/orders/${id}`,
    approve: (id: string) => `/orders/${id}/approve`,
    reject: (id: string) => `/orders/${id}/reject`,
    route: (id: string) => `/orders/${id}/route`, // Phase 5 (US2)
    cancel: (id: string) => `/orders/${id}/cancel`,
    forceComplete: (id: string) => `/orders/${id}/force-complete`,
    redispatch: (id: string) => `/orders/${id}/redispatch`,
    supplierInvoiceUpload: (id: string) => `/orders/${id}/supplier-invoice/upload`, // Phase 14 (US11)
    supplierInvoice: (id: string) => `/orders/${id}/supplier-invoice`, // Phase 14 (US11)
    overrideVerification: (id: string) => `/orders/${id}/override-verification`,
    reassignVehicle: (id: string) => `/orders/${id}/reassign-vehicle`,
    // spec 011 FR-012: mark a stop handled. Addressed by stop, not by order — a delivery
    // can accumulate several across one journey.
    resolveStop: (id: string, stopId: string) => `/orders/${id}/stops/${stopId}/resolve`,
  },
  dispatch: {
    trigger: (orderId: string) => `/dispatch/orders/${orderId}`,
    // spec 009 T025/US1 — the transporter's own two actions.
    candidates: (orderId: string) => `/dispatch/orders/${orderId}/candidates`,
    assign: (orderId: string) => `/dispatch/orders/${orderId}/assign`,
  },
  trucks: {
    list: '/trucks',
    create: '/trucks',
    detail: (id: string) => `/trucks/${id}`,
    update: (id: string) => `/trucks/${id}`,
    withdraw: (id: string) => `/trucks/${id}/withdraw`,
    restore: (id: string) => `/trucks/${id}/restore`,
    pairCard: (id: string) => `/trucks/${id}/pair-card`,
    mintQrToken: (id: string) => `/trucks/${id}/qr-token`,
    rotateQrToken: (id: string) => `/trucks/${id}/qr-token/rotate`,
    revokeQrToken: (id: string) => `/trucks/${id}/qr-token/revoke`,
  },
  tanks: {
    list: '/tanks',
    create: '/tanks',
    detail: (id: string) => `/tanks/${id}`,
    update: (id: string) => `/tanks/${id}`,
    withdraw: (id: string) => `/tanks/${id}/withdraw`,
    restore: (id: string) => `/tanks/${id}/restore`,
  },
  stations: {
    // `/stations` (bare) is CLIENT-only; the FCA cross-owner listing needed its own path
    // since Nest cannot bind two role-gated handlers to the same @Get() route.
    allForCompany: '/stations/all', // Phase 6 (US3), T058
    detail: (id: string) => `/stations/${id}`,
    update: (id: string) => `/stations/${id}`,
  },
  files: {
    upload: '/files', // Phase 13 (US10)
    detail: (id: string) => `/files/${id}`,
  },
  invoices: {
    list: '/invoices', // Phase 9 (US6)
    detail: (id: string) => `/invoices/${id}`,
    settle: (id: string) => `/invoices/${id}/settle`,
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
    // spec 017 T112/FR-047 — already on the platform and role-agnostic; the
    // dashboard simply never had a constant for it.
    markAllRead: '/notifications/read-all',
  },
  support: {
    // Corrected from the placeholder `/support` — the real path is
    // `support/requests` (`src/modules/support/support.controller.ts`).
    list: '/support/requests', // Phase 11 (US8)
    acknowledge: (id: string) => `/support/requests/${id}/acknowledge`, // Phase 11 (US8)
  },
  creditLimitRequests: {
    list: '/credit-limit-requests', // Phase 6 (US3), FCA queue
    resolve: (id: string) => `/credit-limit-requests/${id}/resolve`,
  },
  litreBalances: {
    list: '/litre-balances', // Phase 14 (US11), FCA
    mine: '/users/me/litre-balances', // Phase 14 (US11), CLIENT
    correction: (id: string) => `/litre-balances/${id}/corrections`,
  },
  billing: {
    commissionTermsCurrent: '/billing/commission-terms/current', // Phase 12 (US9)
    commissionTerms: '/billing/commission-terms',
    cashbackProgrammeCurrent: '/billing/cashback-programme/current',
    cashbackProgramme: '/billing/cashback-programme',
    balancesMe: '/billing/balances/me',
    balancesForCompany: (companyId: string) => `/billing/balances/${companyId}`, // Phase 16 (US13)
  },
  // spec 017 (operator dashboard) — the platform's own cross-company figures. Every
  // route here is SUPER_ADMIN-only and has no tenant-scoped equivalent.
  platform: {
    overview: '/platform/overview',
    transportCompanyVolumes: '/platform/transport-company-volumes',
  },
  drivers: {
    // The platform-wide driver roster (FR-038). Deliberately its own route rather than
    // a widened `users.list`: it carries an employer name and a last-operated truck and
    // omits every location and trip field (FR-043, FR-044).
    roster: '/drivers/roster',
  },
  announcements: {
    list: '/announcements',
    create: '/announcements',
    detail: (id: string) => `/announcements/${id}`,
  },
  platformAccount: {
    movements: '/platform-account/movements', // Phase 13 (US10)
    payments: '/platform-account/payments',
    confirmPayment: (id: string) => `/platform-account/payments/${id}/confirm`,
    // spec 017 (operator dashboard) US8 — what the platform owes a fuel company, and
    // recording that it paid. No payment provider is integrated: these record that
    // money moved elsewhere (FR-065, FR-066).
    cashbackOwed: (companyId: string) => `/platform-account/cashback/${companyId}/owed`,
    cashbackPayouts: (companyId: string) => `/platform-account/cashback/${companyId}/payouts`,
  },
  // Feature 016 (broadcast fuel exchange offers) — replaces the directed model's
  // `/fuel-exchange/requests` entirely (FR-040); no recipient is ever named on any route.
  fuelExchange: {
    list: '/fuel-exchange/offers',
    create: '/fuel-exchange/offers',
    summary: '/fuel-exchange/offers/summary',
    detail: (id: string) => `/fuel-exchange/offers/${id}`,
    propose: (id: string) => `/fuel-exchange/offers/${id}/proposals`,
    award: (id: string) => `/fuel-exchange/offers/${id}/award`,
    withdraw: (id: string) => `/fuel-exchange/offers/${id}/withdraw`,
  },
} as const;
