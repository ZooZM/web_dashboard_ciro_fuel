import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  id: string
  name: string
  email: string
  role: 'admin' | 'petrol_company' | 'transport_company'
  permissions: string[]
}

interface AuthState {
  token: string | null
  user: UserProfile | null
  isAuthenticated: boolean
  login: (token: string, user: UserProfile) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
