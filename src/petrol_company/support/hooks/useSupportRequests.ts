import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as supportApi from '@/petrol_company/support/api/support.api';

export function useSupportRequests() {
  return useQuery({
    queryKey: queryKeys.support(),
    queryFn: () => supportApi.listSupportRequests(),
  });
}

export function useAcknowledgeSupportRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => supportApi.acknowledgeSupportRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.support() });
    },
  });
}
