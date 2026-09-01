export const apiRoutes = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  companies: {
    list: '/companies',
    create: '/companies',
    detail: (id: string) => `/companies/${id}`,
    status: (id: string) => `/companies/${id}/status`,
    fuelPrices: (id: string) => `/companies/${id}/fuel-prices`,
  },
  users: {
    list: '/users',
    create: '/users',
    detail: (id: string) => `/users/${id}`,
    activate: (id: string) => `/users/${id}/activate`,
    deactivate: (id: string) => `/users/${id}/deactivate`,
    // Feature 009 T024: `truck(id)` (`PATCH /users/:id/truck`) removed. A
    // vehicle is no longer a field embedded on the driver (spec 008
    // cutover) — see trucks/tanks below.
  },
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    summary: '/orders/summary',
    // approve/reject/cancel/forceComplete belong to FUEL_COMPANY_ADMIN (or
    // CLIENT for cancel) — this file is shared platform-wide, not owned by
    // the transport surface. Feature 009 T023 removed the TRANSPORT-side
    // wrapper functions that called these (`transport_company/orders/api/
    // orders.api.ts`, FR-070: this role gets 403 for all four) — it never
    // removed the routes themselves, which `petrol_company/orders/api/`
    // still legitimately needs.
    approve: (id: string) => `/orders/${id}/approve`,
    reject: (id: string) => `/orders/${id}/reject`,
    cancel: (id: string) => `/orders/${id}/cancel`,
    forceComplete: (id: string) => `/orders/${id}/force-complete`,
    overrideVerification: (id: string) => `/orders/${id}/override-verification`,
    reassignVehicle: (id: string) => `/orders/${id}/reassign-vehicle`,
    // spec 011 FR-012: mark a stop handled. Addressed by stop, not by
    // order — a delivery can accumulate several across one journey.
    resolveStop: (id: string, stopId: string) => `/orders/${id}/stops/${stopId}/resolve`,
  },
  dispatch: {
    // Feature 009 T024/T025: `trigger` (`POST /dispatch/orders/:id`) removed
    // — the pre-split auto-select retry no longer exists on the platform
    // (research.md R1). Replaced by the transporter's own two actions.
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
  invoices: {
    list: '/invoices',
    detail: (id: string) => `/invoices/${id}`,
    settle: (id: string) => `/invoices/${id}/settle`,
  },
  files: {
    detail: (id: string) => `/files/${id}`,
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
  },
} as const;
