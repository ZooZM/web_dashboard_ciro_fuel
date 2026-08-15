import * as ToastPrimitive from '@radix-ui/react-toast';
import { useToasts, useDismissToast } from '@/lib/toast/toast';
import { cn } from '@/lib/utils';

export function Toaster() {
  const toasts = useToasts();
  const dismiss = useDismissToast();

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id);
          }}
          duration={5000}
          className={cn(
            'rounded-md border p-4 shadow-lg bg-background text-foreground',
            t.variant === 'error' && 'border-destructive text-destructive',
            t.variant === 'success' && 'border-primary',
          )}
        >
          <ToastPrimitive.Description>{t.message}</ToastPrimitive.Description>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-4 end-4 z-[100] flex w-96 max-w-full flex-col gap-2" />
    </ToastPrimitive.Provider>
  );
}
