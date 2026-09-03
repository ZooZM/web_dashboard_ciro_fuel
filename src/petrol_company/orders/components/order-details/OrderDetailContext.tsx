import { createContext, useContext, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { useOrderDetail } from '@/petrol_company/orders/hooks/useOrders';
import type { Order } from '@/transport_company/orders/types';

interface OrderDetailContextValue {
  orderId: string;
  order: Order | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => unknown;
}

const OrderDetailContext = createContext<OrderDetailContextValue | null>(null);

export function OrderDetailProvider({ children }: { children: ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const orderId = id ?? '';
  const { data: order, isLoading, isError, refetch } = useOrderDetail(orderId);

  return (
    <OrderDetailContext.Provider value={{ orderId, order, isLoading, isError, refetch }}>
      {children}
    </OrderDetailContext.Provider>
  );
}

export function useOrderDetailContext(): OrderDetailContextValue {
  const ctx = useContext(OrderDetailContext);
  if (!ctx) throw new Error('useOrderDetailContext must be used within OrderDetailProvider');
  return ctx;
}
