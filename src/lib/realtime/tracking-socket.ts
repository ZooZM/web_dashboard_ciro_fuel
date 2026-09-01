import { io, type Socket } from 'socket.io-client';
import { tokenStore } from '@/lib/auth/token-store';

/**
 * Feature 009 (contracts/realtime-contract.md): **one** connection per administrator
 * session, used for exactly one thing — the truck's live position. Opened only by
 * `useOrderPosition` when a tracking screen mounts on a trackable delivery, closed when it
 * unmounts (FR-023/FR-024). Every other view stays on background refresh (FR-020) — the
 * platform cannot deliver `order:status` to this role for the stages that matter most
 * (research.md R4), and refresh already meets the 15s bound for those.
 *
 * `UNAUTHORIZED` at handshake is terminal for that attempt, not retried blindly — the
 * ordinary refresh/session-expiry path takes over instead (realtime-contract.md's Handshake
 * table).
 */
let socket: Socket | null = null;
let refCount = 0;

function baseUrl(): string {
  const apiBase = import.meta.env.VITE_API_BASE_URL as string;
  // Strip the REST prefix (`/api/v1`) — the socket namespace lives on the bare origin.
  return apiBase.replace(/\/api\/v1\/?$/, '');
}

function ensureSocket(): Socket {
  if (socket) return socket;
  socket = io(`${baseUrl()}/tracking`, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    auth: (cb) => cb({ token: tokenStore.get() }),
  });
  return socket;
}

/** Reference-counted: several components may ask for the connection while a tracking
 *  screen is open, but only the first acquisition actually connects and only the last
 *  release actually disconnects — this is what keeps it to one connection per session. */
export function acquireTrackingSocket(): Socket {
  const s = ensureSocket();
  refCount += 1;
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function releaseTrackingSocket(): void {
  refCount = Math.max(0, refCount - 1);
  if (refCount === 0 && socket) {
    socket.disconnect();
  }
}
