export interface OrderListParams {
  status?: string;
  from?: string;
  to?: string;
  // Feature 009 T018: cursor, never `page` (data-model.md §1.3).
  cursor?: string;
}

export interface UserListParams {
  role?: 'DRIVER' | 'CLIENT';
  isActive?: boolean;
  page?: number;
  // spec 017 T071 — the operator's per-company drill-downs pass a companyId.
  // It is load-bearing only for SUPER_ADMIN: the tenant plugin overwrites it
  // for every other role, which is why it appears on operator screens alone.
  // Part of the KEY because two companies' driver lists must not share a cache
  // entry — omitting it would serve one company's drivers under another's id.
  companyId?: string;
}

// Feature 013 T038/FR-097: query keys every later phase's `hooks/use*.ts` file consumes,
// defined once here rather than as an ad hoc array literal at each `useQuery` call site.
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  companies: {
    all: ['companies'] as const,
    detail: (id: string) => ['companies', id] as const,
    fuelPrices: (id: string) => ['companies', id, 'fuel-prices'] as const,
    pricingConfig: (id: string) => ['companies', id, 'pricing-config'] as const, // Phase 8
    transporters: (id: string) => ['companies', id, 'transporters'] as const, // Phase 7
    coveredRegions: (id: string) => ['companies', id, 'covered-regions'] as const, // Phase 7
    deliveryRates: (id: string) => ['companies', id, 'delivery-rates'] as const,
  },
  orders: {
    list: (params: OrderListParams) => ['orders', params] as const,
    detail: (id: string) => ['orders', id] as const,
    summary: (from?: string, to?: string) => ['orders', 'summary', { from, to }] as const,
    // Phase 10 (US7) — the FUEL_COMPANY_ADMIN summary shape, keyed separately from
    // `summary` above (the TRANSPORT_COMPANY_ADMIN one) since the two return genuinely
    // different response shapes for the same route.
    fuelCompanySummary: (from?: string, to?: string) =>
      ['orders', 'summary', 'fuel-company', { from, to }] as const,
  },
  dispatch: {
    candidates: (orderId: string) => ['dispatch', 'candidates', orderId] as const,
  },
  trucks: {
    all: ['trucks'] as const,
    detail: (id: string) => ['trucks', id] as const,
  },
  tanks: {
    all: ['tanks'] as const,
    detail: (id: string) => ['tanks', id] as const,
  },
  users: {
    list: (params: UserListParams) => ['users', params] as const,
    detail: (id: string) => ['users', id] as const,
    // The administrator account(s) of one company — SUPER_ADMIN only in practice, since
    // the tenant plugin overwrites `companyId` for every other role.
    companyAdmins: (companyId: string) => ['users', 'company-admins', companyId] as const,
    stations: (id: string) => ['users', id, 'stations'] as const, // Phase 6
    creditLimit: (id: string) => ['users', id, 'credit-limit'] as const, // Phase 6
  },
  invoices: {
    list: (params: { method?: string; state?: string; cursor?: string }) =>
      ['invoices', params] as const, // Phase 9
    detail: (id: string) => ['invoices', id] as const,
  },
  notifications: (unread?: boolean, cursor?: string) =>
    ['notifications', { unread, cursor }] as const,
  support: (state?: string) => ['support', { state }] as const, // Phase 11
  stations: {
    all: ['stations'] as const, // Phase 6, T058
  },
  creditLimitRequests: {
    list: (state?: string) => ['credit-limit-requests', { state }] as const, // Phase 6
    mine: ['credit-limit-requests', 'mine'] as const,
  },
  litreBalances: {
    list: (clientId?: string) => ['litre-balances', { clientId }] as const, // Phase 14
    mine: ['litre-balances', 'mine'] as const,
  },
  billing: {
    commissionTerms: ['billing', 'commission-terms'] as const, // Phase 12
    cashbackProgramme: ['billing', 'cashback-programme'] as const,
    balancesMe: ['billing', 'balances', 'me'] as const,
  },
  platformAccount: {
    movements: (params: { kind?: string; state?: string; cursor?: string } = {}) =>
      ['platform-account', 'movements', params] as const, // Phase 13
  },
  // spec 017 (operator dashboard) — one key per hook this feature adds. Every key
  // that takes a period carries `from`/`to` in its params so changing the date range
  // refetches rather than serving the previous period from cache.
  platform: {
    overview: (params: { from?: string; to?: string } = {}) =>
      ['platform', 'overview', params] as const,
    transportCompanyVolumes: (
      params: { companyIds: string[]; from?: string; to?: string },
    ) => ['platform', 'transport-company-volumes', params] as const,
  },
  drivers: {
    roster: (params: { isActive?: boolean; dutyState?: string; cursor?: string } = {}) =>
      ['drivers', 'roster', params] as const,
  },
  announcements: {
    list: (cursor?: string) => ['announcements', { cursor }] as const,
    detail: (id: string) => ['announcements', id] as const,
  },
  operatorAccount: ['auth', 'me', 'account'] as const,
  cashback: {
    owed: (companyId: string) => ['platform-account', 'cashback', companyId, 'owed'] as const,
  },
  fuelExchange: {
    // Feature 016 (broadcast fuel exchange offers) — `partners` is gone with the
    // recipient selector it fed (FR-040, research R10); `summary` is new (research R9).
    list: (direction?: string, state?: string, cursor?: string) =>
      ['fuel-exchange', { direction, state, cursor }] as const,
    detail: (id: string) => ['fuel-exchange', id] as const,
    summary: ['fuel-exchange', 'summary'] as const,
  },
} as const;
