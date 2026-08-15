import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as clientsApi from '@/features/clients/api/clients.api';
import type { CreateClientInput } from '@/features/clients/types';
import { Role } from '@/constants/roles';

export function useClientsList(page = 1) {
  return useQuery({
    queryKey: queryKeys.users.list({ role: Role.CLIENT, page }),
    queryFn: () => clientsApi.listClients(page),
  });
}

function useInvalidateClients() {
  const queryClient = useQueryClient();
  return () => void queryClient.invalidateQueries({ queryKey: ['users'] });
}

export function useCreateClient() {
  const invalidate = useInvalidateClients();
  return useMutation({
    mutationFn: (input: CreateClientInput) => clientsApi.createClient(input),
    onSuccess: invalidate,
  });
}

export function useSetClientActive() {
  const invalidate = useInvalidateClients();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      clientsApi.setClientActive(id, isActive),
    onSuccess: invalidate,
  });
}
