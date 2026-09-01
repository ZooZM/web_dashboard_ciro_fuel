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
}

export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  companies: {
    all: ['companies'] as const,
    detail: (id: string) => ['companies', id] as const,
    fuelPrices: (id: string) => ['companies', id, 'fuel-prices'] as const,
  },
  orders: {
    list: (params: OrderListParams) => ['orders', params] as const,
    detail: (id: string) => ['orders', id] as const,
    summary: (from?: string, to?: string) => ['orders', 'summary', { from, to }] as const,
  },
  dispatch: {
    candidates: (orderId: string) => ['dispatch', 'candidates', orderId] as const,
  },
  users: {
    list: (params: UserListParams) => ['users', params] as const,
    detail: (id: string) => ['users', id] as const,
  },
  trucks: {
    all: ['trucks'] as const,
    detail: (id: string) => ['trucks', id] as const,
  },
  tanks: {
    all: ['tanks'] as const,
    detail: (id: string) => ['tanks', id] as const,
  },
  notifications: (unread?: boolean) => ['notifications', { unread }] as const,
} as const;
