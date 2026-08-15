import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useApproveOrder, useRejectOrder, useOrderDetail } from '@/features/orders/hooks/useOrders';
import { tokenStore } from '@/lib/auth/token-store';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ORDER_ID = 'order-1';

let orderStatus = 'PENDING_APPROVAL';
let orderFinalPrice: number | null = null;

const server = setupServer(
  http.get(`${BASE_URL}/orders/${ORDER_ID}`, () =>
    HttpResponse.json({
      id: ORDER_ID,
      status: orderStatus,
      fuelType: '95',
      quantityLiters: 100,
      estimatedPrice: 250,
      finalPrice: orderFinalPrice,
      clientName: 'Station A',
      driverName: null,
      statusHistory: [],
      createdAt: new Date().toISOString(),
    }),
  ),
  http.patch(`${BASE_URL}/orders/${ORDER_ID}/approve`, async ({ request }) => {
    const body = (await request.json()) as { finalPrice?: number };
    orderStatus = 'APPROVED';
    orderFinalPrice = body.finalPrice ?? 250;
    return HttpResponse.json({ id: ORDER_ID, status: orderStatus, finalPrice: orderFinalPrice });
  }),
  http.patch(`${BASE_URL}/orders/${ORDER_ID}/reject`, () => {
    orderStatus = 'REJECTED';
    return HttpResponse.json({ id: ORDER_ID, status: orderStatus });
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  orderStatus = 'PENDING_APPROVAL';
  orderFinalPrice = null;
});
afterAll(() => server.close());

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('order mutations reflect backend-confirmed state (FR-016)', () => {
  beforeAll(() => tokenStore.set('valid-token'));

  it('approve reflects the backend-confirmed APPROVED status and final price', async () => {
    const { result: detail } = renderHook(() => useOrderDetail(ORDER_ID), { wrapper });
    await waitFor(() => expect(detail.current.data?.status).toBe('PENDING_APPROVAL'));

    const { result: approve } = renderHook(() => useApproveOrder(ORDER_ID), { wrapper });
    approve.current.mutate({ finalPrice: 275 });

    await waitFor(() => expect(approve.current.isSuccess).toBe(true));
    expect(orderStatus).toBe('APPROVED');
    expect(orderFinalPrice).toBe(275);
  });

  it('reject reflects the backend-confirmed REJECTED status', async () => {
    const { result: reject } = renderHook(() => useRejectOrder(ORDER_ID), { wrapper });
    reject.current.mutate({ reason: 'Out of stock at station' });

    await waitFor(() => expect(reject.current.isSuccess).toBe(true));
    expect(orderStatus).toBe('REJECTED');
  });
});
