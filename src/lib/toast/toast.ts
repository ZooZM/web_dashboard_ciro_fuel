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

const MAX_TOASTS = 3;

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, variant) =>
    set((state) => {
      // Deduplicate: do not add if a toast with the exact same message and variant already exists
      const isDuplicate = state.toasts.some(
        (t) => t.message === message && t.variant === variant
      );
      if (isDuplicate) {
        return state;
      }

      const newToasts = [...state.toasts, { id: crypto.randomUUID(), message, variant }];
      
      // Limit the number of visible toasts
      if (newToasts.length > MAX_TOASTS) {
        return { toasts: newToasts.slice(newToasts.length - MAX_TOASTS) };
      }
      return { toasts: newToasts };
    }),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().push(message, 'success'),
  error: (message: string) => useToastStore.getState().push(message, 'error'),
  info: (message: string) => useToastStore.getState().push(message, 'default'),
};

export const useToasts = () => useToastStore((s) => s.toasts);
export const useDismissToast = () => useToastStore((s) => s.dismiss);
