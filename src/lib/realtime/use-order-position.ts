import { useEffect, useRef, useState } from 'react';
import { acquireTrackingSocket, releaseTrackingSocket } from './tracking-socket';

export type PositionState =
  | { status: 'connecting' }
  | { status: 'not-trackable' }
  | { status: 'not-found' }
  | { status: 'error' }
  | { status: 'live'; lat: number; lng: number; lastReceivedAt: number };

interface LocationPayload {
  orderId: string;
  lat: number;
  lng: number;
  recordedAt: string;
  receivedAt: string;
}

/**
 * Feature 009 FR-016/FR-017/FR-018/FR-021-024 (contracts/realtime-contract.md): the one
 * live connection this dashboard holds, and the one thing it is for. `order:watch`'s
 * ack IS the trackability answer (FR-017) — this hook never judges it locally, only
 * relays `NOT_TRACKABLE`/`NOT_FOUND` from the platform. Opens only while `orderId` is set
 * and this component is mounted; closes on unmount (FR-023) via the socket's own
 * reference count (FR-024 — one connection regardless of how many screens ask).
 */
export function useOrderPosition(orderId: string | null): PositionState {
  const [state, setState] = useState<PositionState>({ status: 'connecting' });
  const watchedOrderId = useRef<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setState({ status: 'not-found' });
      return;
    }

    setState({ status: 'connecting' });
    const socket = acquireTrackingSocket();
    watchedOrderId.current = orderId;

    function onLocation(payload: LocationPayload): void {
      if (payload.orderId !== orderId) return;
      setState({ status: 'live', lat: payload.lat, lng: payload.lng, lastReceivedAt: Date.now() });
    }

    function watch(): void {
      socket.emit(
        'order:watch',
        { orderId },
        (ack: { ok: boolean; error?: string }) => {
          if (ack.ok) return;
          if (ack.error === 'NOT_TRACKABLE') {
            setState({ status: 'not-trackable' });
          } else if (ack.error === 'NOT_FOUND') {
            setState({ status: 'not-found' });
          } else {
            setState({ status: 'error' });
          }
        },
      );
    }

    // Cost constraint: nobody is looking at a hidden tab, so there is nothing to push to
    // it — unwatch while hidden, rewatch on return, rather than holding the room open for
    // no reader (research.md's server-cost governance, applied to the one live surface).
    function onVisibilityChange(): void {
      if (document.hidden) {
        socket.emit('order:unwatch', { orderId });
      } else {
        watch();
      }
    }

    socket.on('order:location', onLocation);
    socket.on('connect', watch);
    document.addEventListener('visibilitychange', onVisibilityChange);
    if (socket.connected) watch();

    return () => {
      socket.off('order:location', onLocation);
      socket.off('connect', watch);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (watchedOrderId.current) {
        socket.emit('order:unwatch', { orderId: watchedOrderId.current });
      }
      releaseTrackingSocket();
    };
  }, [orderId]);

  return state;
}
