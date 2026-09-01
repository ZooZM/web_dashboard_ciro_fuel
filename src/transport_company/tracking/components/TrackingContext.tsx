import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useOrdersList } from '@/transport_company/orders/hooks/useOrders';
import { useOrderPosition, type PositionState } from '@/lib/realtime/use-order-position';
import { OrderStatus } from '@/constants/order-status';
import type { Order } from '@/transport_company/orders/types';

interface TrackingContextValue {
  trackableOrders: Order[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  selectedOrder: Order | undefined;
  selectedOrderId: string | null;
  selectOrder: (orderId: string) => void;
  position: PositionState;
}

const TrackingContext = createContext<TrackingContextValue | null>(null);

/**
 * Feature 009 FR-016/FR-017 (contracts/realtime-contract.md): "trackable" here mirrors the
 * platform's own IN_TRANSIT/UNLOADING rule exactly (`isTrackableOrderStatus`) — two list
 * calls merged client-side, since `GET /orders` takes one `status` value, not a set. This
 * sidebar is the only place that needs the merge; every other list in this feature filters
 * by a single stage.
 */
export function TrackingProvider({ children }: { children: ReactNode }) {
  const inTransit = useOrdersList({ status: OrderStatus.IN_TRANSIT });
  const unloading = useOrdersList({ status: OrderStatus.UNLOADING });
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const trackableOrders = useMemo(
    () => [...(inTransit.data?.items ?? []), ...(unloading.data?.items ?? [])],
    [inTransit.data, unloading.data],
  );

  const effectiveId = selectedOrderId ?? trackableOrders[0]?._id ?? null;
  const selectedOrder = trackableOrders.find((o) => o._id === effectiveId);
  const position = useOrderPosition(effectiveId);

  const refetch = () => {
    void inTransit.refetch();
    void unloading.refetch();
  };

  const value = useMemo<TrackingContextValue>(
    () => ({
      trackableOrders,
      isLoading: inTransit.isLoading || unloading.isLoading,
      isError: inTransit.isError || unloading.isError,
      refetch,
      selectedOrder,
      selectedOrderId: effectiveId,
      selectOrder: setSelectedOrderId,
      position,
    }),
    [trackableOrders, inTransit.isLoading, unloading.isLoading, inTransit.isError, unloading.isError, selectedOrder, effectiveId, position],
  );

  return <TrackingContext.Provider value={value}>{children}</TrackingContext.Provider>;
}

export function useTracking(): TrackingContextValue {
  const ctx = useContext(TrackingContext);
  if (!ctx) throw new Error('useTracking must be used within TrackingProvider');
  return ctx;
}
