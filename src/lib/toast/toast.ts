import { create } from 'zustand';

export type ToastVariant = 'default' | 'success' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastState {
  toasts: ToastMessage[];
  push: (message: string, variant: ToastVariant) => void;
  dismiss: (id: string) => void;
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, variant) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message, variant }],
    })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().push(message, 'success'),
  error: (message: string) => useToastStore.getState().push(message, 'error'),
  info: (message: string) => useToastStore.getState().push(message, 'default'),
};

export const useToasts = () => useToastStore((s) => s.toasts);
export const useDismissToast = () => useToastStore((s) => s.dismiss);
