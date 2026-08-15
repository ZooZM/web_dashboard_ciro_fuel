import { useEffect, useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { DirectionProvider } from '@radix-ui/react-direction';
import '@/lib/i18n/i18n';
import { queryClient } from '@/app/query-client';
import { router } from '@/app/router';
import { useLanguageStore } from '@/stores/language.store';
import { bootstrapSession, wireSessionExpiry } from '@/features/auth/bootstrap-session';
import { Toaster } from '@/components/ui/toaster';

wireSessionExpiry();

export function Providers(): ReactNode {
  const direction = useLanguageStore((s) => (s.language === 'ar' ? 'rtl' : 'ltr'));
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    void bootstrapSession().finally(() => setBootstrapped(true));
  }, []);

  if (!bootstrapped) {
    return null; // brief blank frame while the silent refresh resolves (FR-011)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider dir={direction}>
        <RouterProvider router={router} />
        <Toaster />
      </DirectionProvider>
    </QueryClientProvider>
  );
}
