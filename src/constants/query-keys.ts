export interface OrderListParams {
  status?: string;
  from?: string;
  to?: string;
  page?: number;
}

export interface UserListParams {
  role?: 'DRIVER' | 'CLIENT';
  isActive?: boolean;
  page?: number;
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
  },
  users: {
    list: (params: UserListParams) => ['users', params] as const,
    detail: (id: string) => ['users', id] as const,
  },
  notifications: (unread?: boolean) => ['notifications', { unread }] as const,
} as const;
