import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as trucksApi from '@/transport_company/trucks/api/trucks.api';
import type { CreateTruckInput, UpdateTruckInput } from '@/transport_company/trucks/types';

export function useTrucksList(availableOnly = false) {
  return useQuery({
    queryKey: [...queryKeys.trucks.all, { availableOnly }] as const,
    queryFn: () => trucksApi.listTrucks(availableOnly),
  });
}

export function useTruck(id: string) {
  return useQuery({
    queryKey: queryKeys.trucks.detail(id),
    queryFn: () => trucksApi.getTruck(id),
    enabled: Boolean(id),
  });
}

function useInvalidateTrucks() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: queryKeys.trucks.all });
}

export function useCreateTruck() {
  const invalidate = useInvalidateTrucks();
  return useMutation({
    mutationFn: (input: CreateTruckInput) => trucksApi.createTruck(input),
    onSuccess: invalidate,
  });
}

export function useUpdateTruck(id: string) {
  const invalidate = useInvalidateTrucks();
  return useMutation({
    mutationFn: (input: UpdateTruckInput) => trucksApi.updateTruck(id, input),
    onSuccess: invalidate,
  });
}

export function useWithdrawTruck() {
  const invalidate = useInvalidateTrucks();
  return useMutation({
    mutationFn: (id: string) => trucksApi.withdrawTruck(id),
    onSuccess: invalidate,
  });
}

export function useRestoreTruck() {
  const invalidate = useInvalidateTrucks();
  return useMutation({
    mutationFn: (id: string) => trucksApi.restoreTruck(id),
    onSuccess: invalidate,
  });
}
