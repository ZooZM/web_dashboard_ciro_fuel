import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as tanksApi from '@/transport_company/trucks/api/tanks.api';
import type { CreateTankInput, UpdateTankInput } from '@/transport_company/trucks/types';

export function useTanksList() {
  return useQuery({
    queryKey: queryKeys.tanks.all,
    queryFn: () => tanksApi.listTanks(),
  });
}

export function useTank(id: string) {
  return useQuery({
    queryKey: queryKeys.tanks.detail(id),
    queryFn: () => tanksApi.getTank(id),
    enabled: Boolean(id),
  });
}

function useInvalidateTanks() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: queryKeys.tanks.all });
}

export function useCreateTank() {
  const invalidate = useInvalidateTanks();
  return useMutation({
    mutationFn: (input: CreateTankInput) => tanksApi.createTank(input),
    onSuccess: invalidate,
  });
}

export function useUpdateTank(id: string) {
  const invalidate = useInvalidateTanks();
  return useMutation({
    mutationFn: (input: UpdateTankInput) => tanksApi.updateTank(id, input),
    onSuccess: invalidate,
  });
}

export function useWithdrawTank() {
  const invalidate = useInvalidateTanks();
  return useMutation({
    mutationFn: (id: string) => tanksApi.withdrawTank(id),
    onSuccess: invalidate,
  });
}

export function useRestoreTank() {
  const invalidate = useInvalidateTanks();
  return useMutation({
    mutationFn: (id: string) => tanksApi.restoreTank(id),
    onSuccess: invalidate,
  });
}
