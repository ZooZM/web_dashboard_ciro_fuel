import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as trucksApi from '@/transport_company/trucks/api/trucks.api';

/**
 * FR-052/SC-022: issue, rotate and revoke are three distinct calls, all effective
 * immediately server-side (no stale window) — this hook just wires them, it does not
 * cache or persist the raw token; the caller displays it once, at mint/rotate time, per
 * `TruckWithQrToken`'s own doc comment.
 */
export function useMintQrToken(truckId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => trucksApi.mintQrToken(truckId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.detail(truckId) });
    },
  });
}

export function useRotateQrToken(truckId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => trucksApi.rotateQrToken(truckId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.detail(truckId) });
    },
  });
}

export function useRevokeQrToken(truckId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => trucksApi.revokeQrToken(truckId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.detail(truckId) });
    },
  });
}
