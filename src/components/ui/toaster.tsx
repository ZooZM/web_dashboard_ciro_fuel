import * as ToastPrimitive from '@radix-ui/react-toast';
import { useToasts, useDismissToast } from '@/lib/toast/toast';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function Toaster() {
  const toasts = useToasts();
  const dismiss = useDismissToast();

  return (
    <ToastPrimitive.Provider swipeDirection="left">
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          onOpenChange={(open) => {
            if (!open) dismiss(t.id);
          }}
          duration={5000}
          className={cn(
            'group pointer-events-auto relative flex w-full items-center justify-between overflow-hidden rounded-2xl border p-4 pr-5 shadow-2xl transition-all',
            'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-left-full data-[state=open]:slide-in-from-bottom-full',
            t.variant === 'error' && 'bg-white/90 backdrop-blur-xl border-red-100 text-slate-800',
            t.variant === 'success' && 'bg-white/90 backdrop-blur-xl border-emerald-100 text-slate-800',
            t.variant === 'default' && 'bg-white/90 backdrop-blur-xl border-blue-100 text-slate-800'
          )}
        >
          <div className="flex gap-3.5 items-center w-full">
            {t.variant === 'success' && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            )}
            {t.variant === 'error' && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle className="h-5 w-5" />
              </div>
            )}
            {t.variant === 'default' && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Info className="h-5 w-5" />
              </div>
            )}
            
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold leading-none">
                {t.variant === 'error' ? 'حدث خطأ' : t.variant === 'success' ? 'نجاح' : 'تنبيه'}
              </span>
              <ToastPrimitive.Description className="text-xs font-medium text-slate-500 leading-relaxed">
                {t.message}
              </ToastPrimitive.Description>
            </div>
          </div>
          <ToastPrimitive.Close className="absolute left-4 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-900 focus:opacity-100 group-hover:opacity-100">
            <X className="h-4 w-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed bottom-6 left-6 z-[100] flex w-full md:max-w-[380px] flex-col gap-3 outline-none" />
    </ToastPrimitive.Provider>
  );
}
