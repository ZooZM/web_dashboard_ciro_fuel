import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as rosterApi from '@/admin/drivers/api/driver-roster.api';

/** spec 017 (operator dashboard) T087/US5. */
export function useDriverRoster(params: rosterApi.DriverRosterParams = {}) {
  return useQuery({
    queryKey: queryKeys.drivers.roster(params),
    queryFn: () => rosterApi.listDriverRoster(params),
  });
}
