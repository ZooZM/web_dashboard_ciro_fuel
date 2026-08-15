import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { Role } from '@/constants/roles';
import type { Client, CreateClientInput } from '@/features/clients/types';

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
}

export async function listClients(page = 1): Promise<Paginated<Client>> {
  const { data } = await apiClient.get<Paginated<Client>>(apiRoutes.users.list, {
    params: { role: Role.CLIENT, page },
  });
  return data;
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  const { data } = await apiClient.post<Client>(apiRoutes.users.create, {
    ...input,
    role: Role.CLIENT,
  });
  return data;
}

export async function setClientActive(id: string, isActive: boolean): Promise<Client> {
  const path = isActive ? apiRoutes.users.activate(id) : apiRoutes.users.deactivate(id);
  const { data } = await apiClient.patch<Client>(path);
  return data;
}
