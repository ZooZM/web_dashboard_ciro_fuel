import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as trucksApi from '@/transport_company/trucks/api/trucks.api';

/**
 * FR-005/FR-050: on a conflict the platform names the truck already holding the card
 * (`heldByPlateNumber`/`heldByTruckId` — see `trucks.service.ts`'s `pairCard`, extended for
 * this feature) via `ApiError.details`. The dialog reads that directly from the mutation's
 * error rather than this hook re-shaping it — one place decides what the refusal means.
 */
export function usePairCard(truckId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nfcCardUid: string) => trucksApi.pairCard(truckId, nfcCardUid),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.detail(truckId) });
    },
  });
}
