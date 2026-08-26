import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  // refreshToken is optional only for the rehydration path (bootstrapSession's `/auth/me` call
  // has no fresh refresh token to offer) — every real login or refresh MUST pass one (FR-078).
  setSession: (user: SessionUser, accessToken: string, refreshToken?: string) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      status: 'booting',
      setStatus: (status) => set({ status }),
      setSession: (user, accessToken, refreshToken) => {
        tokenStore.set(accessToken);
        if (refreshToken) {
          tokenStore.setRefreshToken(refreshToken);
        }
        set({ user, status: 'authenticated' });
      },
      clearSession: () => {
        tokenStore.clear();
        set({ user: null, status: 'anonymous' });
      },
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({ user: state.user, status: state.status }),
    }
  )
);

// Convenience selector hook mirroring the shape used throughout routing/components.
export function useSession() {
  const user = useSessionStore((s) => s.user);
  const status = useSessionStore((s) => s.status);
  return { user, status };
}
