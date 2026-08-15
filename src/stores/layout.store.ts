import { create } from 'zustand';

interface LayoutState {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
}));
