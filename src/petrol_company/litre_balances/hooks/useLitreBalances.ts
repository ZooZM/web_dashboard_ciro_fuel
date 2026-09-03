import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as litreBalancesApi from '@/petrol_company/litre_balances/api/litre-balances.api';

export function useLitreBalancesList(clientId?: string) {
  return useQuery({
    queryKey: queryKeys.litreBalances.list(clientId),
    queryFn: () => litreBalancesApi.listLitreBalances(clientId),
  });
}

export function useRecordLitreCorrection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ balanceId, litres, reason }: { balanceId: string; litres: number; reason: string }) =>
      litreBalancesApi.recordCorrection(balanceId, litres, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['litre-balances'] });
    },
  });
}
