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
  // `refreshToken` is optional: bootstrapSession()'s reload path re-establishes a session
  // from an already-valid access token and has no new refresh token to record — the one
  // persisted from the original login (or the last silent refresh) is still current.
  // spec 015 R9: `remember` chooses where the refresh token persists — localStorage
  // (survives a browser restart) vs sessionStorage (this tab only).
  setSession: (
    user: SessionUser,
    accessToken: string,
    refreshToken?: string,
    remember?: boolean,
  ) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      status: 'booting',
      setStatus: (status) => set({ status }),
      setSession: (user, accessToken, refreshToken, remember) => {
        tokenStore.set(accessToken);
        if (refreshToken) {
          tokenStore.setRefreshToken(refreshToken, remember);
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
