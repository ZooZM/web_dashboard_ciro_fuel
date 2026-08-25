import { create } from 'zustand';

interface LayoutState {
  isSidebarCollapsed: boolean;
  isSidebarOpen: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  isSidebarCollapsed: false,
  isSidebarOpen: false,
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ 
    isSidebarCollapsed: !state.isSidebarCollapsed,
    isSidebarOpen: !state.isSidebarOpen
  })),
}));
