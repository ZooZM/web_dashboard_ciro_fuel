import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as driversApi from '@/transport_company/drivers/api/drivers.api';
import type { CreateDriverInput } from '@/transport_company/drivers/types';
import { Role } from '@/constants/roles';

export function useDriversList(isActive?: boolean) {
  return useQuery({
    queryKey: queryKeys.users.list({ role: Role.DRIVER, isActive }),
    queryFn: () => driversApi.listDrivers(isActive),
  });
}

export function useDriver(id: string) {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => driversApi.getDriver(id),
    enabled: Boolean(id),
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
