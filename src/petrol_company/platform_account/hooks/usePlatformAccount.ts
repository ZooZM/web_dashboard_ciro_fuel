import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as platformAccountApi from '@/petrol_company/platform_account/api/platform-account.api';
import type { MovementListParams, RecordPaymentInput } from '@/petrol_company/platform_account/api/platform-account.api';

export function useMovementsList(params: MovementListParams = {}) {
  return useQuery({
    queryKey: queryKeys.platformAccount.movements(params),
    queryFn: () => platformAccountApi.listMovements(params),
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: RecordPaymentInput) => platformAccountApi.recordPayment(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['platform-account'] });
    },
  });
}
