import { create } from 'zustand'

interface SessionState {
  lastActive: number
  updateActivity: () => void
}

export const useSessionStore = create<SessionState>((set) => ({
  lastActive: Date.now(),
  updateActivity: () => set({ lastActive: Date.now() }),
}))
