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
      // Feature 013 FR-049/FR-050/SC-010, R11: a per-screen `refetchInterval` is how each
      // list/detail/count screen states its own freshness need (set at the individual
      // `useQuery` call, not here) — this is the ONE place that governs every one of them
      // while the tab is hidden. `refetchIntervalInBackground: false` is TanStack Query's
      // own default, left explicit here rather than merely relied upon: it is what makes
      // FR-050 a single global setting instead of a per-screen visibility check repeated
      // wherever a `refetchInterval` is later added (Phases 5-16). Do not override this to
      // `true` on an individual query — that would reopen exactly the request-while-hidden
      // gap this setting exists to close.
      refetchIntervalInBackground: false,
    },
  },
  queryCache: new QueryCache({
    onError: reportError,
  }),
  mutationCache: new MutationCache({
    onError: reportError,
  }),
});
