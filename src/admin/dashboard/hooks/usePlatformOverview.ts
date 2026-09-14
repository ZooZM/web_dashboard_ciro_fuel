import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as platformApi from '@/admin/dashboard/api/platform-overview.api';

/**
 * spec 017 (operator dashboard) T031/US1.
 *
 * The date range travels in the query key, so changing it refetches rather than
 * serving the previous period from cache — which would show the operator one
 * period's figures under another period's dates, with nothing saying so.
 */
export function usePlatformOverview(params: platformApi.PlatformOverviewParams = {}) {
  return useQuery({
    queryKey: queryKeys.platform.overview(params),
    queryFn: () => platformApi.getPlatformOverview(params),
  });
}

/**
 * spec 017 T070a/FR-026b — one call for a whole page of transport companies.
 * Disabled until there are ids to ask about, so an empty page issues no request
 * rather than one the platform would refuse.
 */
export function useTransportCompanyVolumes(params: {
  companyIds: string[];
  from?: string;
  to?: string;
}) {
  return useQuery({
    queryKey: queryKeys.platform.transportCompanyVolumes(params),
    queryFn: () => platformApi.getTransportCompanyVolumes(params),
    enabled: params.companyIds.length > 0,
  });
}
