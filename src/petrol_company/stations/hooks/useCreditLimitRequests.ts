import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as requestsApi from '@/petrol_company/stations/api/credit-limit-requests.api';
import type {
  CreditLimitRequestState,
  ResolveCreditLimitRequestInput,
} from '@/petrol_company/stations/api/credit-limit-requests.api';

export function useCreditLimitRequests(state?: CreditLimitRequestState) {
  return useQuery({
    queryKey: queryKeys.creditLimitRequests.list(state),
    queryFn: () => requestsApi.listCreditLimitRequests(state),
  });
}

export function useResolveCreditLimitRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ResolveCreditLimitRequestInput }) =>
      requestsApi.resolveCreditLimitRequest(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['credit-limit-requests'] });
      void queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
