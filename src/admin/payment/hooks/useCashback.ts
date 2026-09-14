import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as api from '@/admin/payment/api/cashback.api';

export function useCashbackOwed(companyId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.cashback.owed(companyId ?? ''),
    queryFn: () => api.getCashbackOwed(companyId!),
    enabled: Boolean(companyId),
  });
}

/**
 * FR-066/FR-068/FR-069 — records a payout.
 *
 * On success the owed figure is REFETCHED, never decremented locally. The
 * authoritative balance is re-read server-side inside the recording transaction
 * (FR-069), so an optimistic decrement here could disagree with it — and would
 * disagree in the one direction that matters, showing less owed than is.
 */
export function useRecordCashbackPayout(companyId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: api.RecordCashbackPayoutInput) =>
      api.recordCashbackPayout(companyId!, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.cashback.owed(companyId ?? ''),
      });
      void queryClient.invalidateQueries({ queryKey: ['platform-account'] });
    },
  });
}
