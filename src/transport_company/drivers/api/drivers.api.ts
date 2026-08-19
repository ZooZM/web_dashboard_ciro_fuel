import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { Role } from '@/constants/roles';
import type { Driver, CreateDriverInput, UpdateTruckInput } from '@/transport_company/drivers/types';

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
}

export async function listDrivers(page = 1): Promise<Paginated<Driver>> {
  const { data } = await apiClient.get<Paginated<Driver>>(apiRoutes.users.list, {
    params: { role: Role.DRIVER, page },
  });
  return data;
}

export async function createDriver(input: CreateDriverInput): Promise<Driver> {
  const { data } = await apiClient.post<Driver>(apiRoutes.users.create, {
    ...input,
    role: Role.DRIVER,
  });
  return data;
}

export async function setDriverActive(id: string, isActive: boolean): Promise<Driver> {
  const path = isActive ? apiRoutes.users.activate(id) : apiRoutes.users.deactivate(id);
  const { data } = await apiClient.patch<Driver>(path);
  return data;
}

export async function updateDriverTruck(id: string, input: UpdateTruckInput): Promise<Driver> {
  const { data } = await apiClient.patch<Driver>(apiRoutes.users.truck(id), input);
  return data;
}
