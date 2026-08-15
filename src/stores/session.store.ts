import { create } from 'zustand';
import type { Role } from '@/constants/roles';
import { tokenStore } from '@/lib/auth/token-store';

export interface SessionUser {
  id: string;
  role: Role;
  companyId: string | null;
  fullName: string;
  email: string;
}

export type SessionStatus = 'booting' | 'authenticated' | 'anonymous';

interface SessionState {
  user: SessionUser | null;
  status: SessionStatus;
  setStatus: (status: SessionStatus) => void;
  setSession: (user: SessionUser, accessToken: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  status: 'booting',
  setStatus: (status) => set({ status }),
  setSession: (user, accessToken) => {
    tokenStore.set(accessToken);
    set({ user, status: 'authenticated' });
  },
  clearSession: () => {
    tokenStore.set(null);
    set({ user: null, status: 'anonymous' });
  },
}));

// Convenience selector hook mirroring the shape used throughout routing/components.
export function useSession() {
  const user = useSessionStore((s) => s.user);
  const status = useSessionStore((s) => s.status);
  return { user, status };
}
