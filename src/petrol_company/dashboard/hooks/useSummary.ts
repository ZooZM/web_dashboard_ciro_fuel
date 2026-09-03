import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { getFuelCompanySummary } from '@/petrol_company/dashboard/api/summary.api';
import { ORDER_POLL_INTERVAL_MS } from '@/constants/polling';

// Feature 013 T117/FR-049/FR-050: refetches at Phase 4's established interval; the
// global `refetchIntervalInBackground: false` (`app/query-client.ts`) already stops this
// while the tab is hidden — no per-hook change needed to satisfy that half.
export function useFuelCompanySummary(from?: string, to?: string) {
  return useQuery({
    queryKey: queryKeys.orders.fuelCompanySummary(from, to),
    queryFn: () => getFuelCompanySummary(from, to),
    refetchInterval: ORDER_POLL_INTERVAL_MS,
  });
}
