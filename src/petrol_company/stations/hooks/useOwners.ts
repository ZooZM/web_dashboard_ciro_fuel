import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as ownersApi from '@/petrol_company/stations/api/owners.api';
import type { CreateOwnerInput } from '@/petrol_company/stations/api/owners.api';

export function useOwnerDetail(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(id ?? ''),
    queryFn: () => ownersApi.getUser(id!),
    enabled: Boolean(id),
  });
}

// Phase 6 (US3) T071-T081 — the fuller owners surface (list/onboarding/activation),
// alongside the single-owner lookup above that order-detail's customer card already used.
export function useOwners() {
  return useQuery({
    queryKey: queryKeys.users.list({ role: 'CLIENT' }),
    queryFn: () => ownersApi.listOwners(),
  });
}

export function useCreateOwner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOwnerInput) => ownersApi.createOwner(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.list({ role: 'CLIENT' }) });
    },
  });
}

export function useSetOwnerActive(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (active: boolean) =>
      active ? ownersApi.activateOwner(id) : ownersApi.deactivateOwner(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.list({ role: 'CLIENT' }) });
    },
  });
}

export function useCreditStanding(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.creditLimit(id ?? ''),
    queryFn: () => ownersApi.getCreditStanding(id!),
    enabled: Boolean(id),
  });
}

export function useSetCreditLimit(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (creditLimit: number) => ownersApi.setCreditLimit(id, creditLimit),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.creditLimit(id) });
    },
  });
}
