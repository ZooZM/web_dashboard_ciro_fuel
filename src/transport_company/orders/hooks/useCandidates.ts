import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as dispatchApi from '@/transport_company/orders/api/dispatch.api';

export function useCandidates(orderId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.dispatch.candidates(orderId),
    queryFn: () => dispatchApi.getCandidates(orderId),
    enabled: Boolean(orderId) && enabled,
  });
}
