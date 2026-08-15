import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toApiError } from '@/lib/api/api-error';
import { toast } from '@/lib/toast/toast';

const DEFAULT_STALE_TIME_MS = 10_000;

function reportError(error: unknown): void {
  const apiError = toApiError(error);
  // Centralized, uniform error surface (Constitution III) — never leaks internal details
  // or tenant existence (FR-002/FR-019).
  toast.error(apiError.message);
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME_MS,
      retry: (failureCount, error) => {
        const apiError = toApiError(error);
        if (apiError.isAuthBoundary) return false;
        return failureCount < 2;
      },
    },
  },
  queryCache: new QueryCache({
    onError: reportError,
  }),
  mutationCache: new MutationCache({
    onError: reportError,
  }),
});
