import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import { getSummary } from '@/transport_company/dashboard/api/summary.api';
import { ORDER_POLL_INTERVAL_MS } from '@/constants/polling';

export function useSummary(from?: string, to?: string) {
  return useQuery({
    queryKey: queryKeys.orders.summary(from, to),
    queryFn: () => getSummary(from, to),
    refetchInterval: ORDER_POLL_INTERVAL_MS,
  });
}
