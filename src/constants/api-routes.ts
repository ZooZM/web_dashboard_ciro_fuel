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
    truck: (id: string) => `/users/${id}/truck`,
  },
  orders: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    approve: (id: string) => `/orders/${id}/approve`,
    reject: (id: string) => `/orders/${id}/reject`,
    cancel: (id: string) => `/orders/${id}/cancel`,
    forceComplete: (id: string) => `/orders/${id}/force-complete`,
    redispatch: (id: string) => `/orders/${id}/redispatch`,
  },
  dispatch: {
    trigger: (orderId: string) => `/dispatch/orders/${orderId}`,
  },
  files: {
    detail: (id: string) => `/files/${id}`,
  },
  notifications: {
    list: '/notifications',
    markRead: (id: string) => `/notifications/${id}/read`,
  },
} as const;
