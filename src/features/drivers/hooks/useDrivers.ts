import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as driversApi from '@/features/drivers/api/drivers.api';
import type { CreateDriverInput, UpdateTruckInput } from '@/features/drivers/types';
import { Role } from '@/constants/roles';

export function useDriversList(page = 1) {
  return useQuery({
    queryKey: queryKeys.users.list({ role: Role.DRIVER, page }),
    queryFn: () => driversApi.listDrivers(page),
  });
}

function useInvalidateDrivers() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: ['users'] });
}

export function useCreateDriver() {
  const invalidate = useInvalidateDrivers();
  return useMutation({
    mutationFn: (input: CreateDriverInput) => driversApi.createDriver(input),
    onSuccess: invalidate,
  });
}

export function useSetDriverActive() {
  const invalidate = useInvalidateDrivers();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      driversApi.setDriverActive(id, isActive),
    onSuccess: invalidate,
  });
}

export function useUpdateDriverTruck() {
  const invalidate = useInvalidateDrivers();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTruckInput }) =>
      driversApi.updateDriverTruck(id, input),
    onSuccess: invalidate,
  });
}
