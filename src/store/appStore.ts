import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  theme: 'light' | 'dark' | 'system'
  isRtl: boolean
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  toggleRtl: () => void
  setRtl: (isRtl: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      isRtl: true, // Defaulting to true as the dashboard is in Arabic
      setTheme: (theme) => set({ theme }),
      toggleRtl: () => set((state) => ({ isRtl: !state.isRtl })),
      setRtl: (isRtl) => set({ isRtl }),
    }),
    {
      name: 'app-storage',
    }
  )
)
