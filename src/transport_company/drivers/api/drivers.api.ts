import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import { Role } from '@/constants/roles';
import type { Driver, CreateDriverInput } from '@/transport_company/drivers/types';

// Feature 009 Phase 6: `UsersController.findAll` returns a plain array — no wrapper, no
// pagination of any kind (`UsersService.findAll(): Promise<UserDocument[]>`). The
// `{ items, total, page }` shape this file declared before never matched what the platform
// actually returns.
export async function listDrivers(isActive?: boolean): Promise<Driver[]> {
  const { data } = await apiClient.get<Driver[]>(apiRoutes.users.list, {
    params: { role: Role.DRIVER, ...(isActive !== undefined ? { isActive } : {}) },
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

export async function getDriver(id: string): Promise<Driver> {
  const { data } = await apiClient.get<Driver>(apiRoutes.users.detail(id));
  return data;
}

export async function setDriverActive(id: string, isActive: boolean): Promise<Driver> {
  const path = isActive ? apiRoutes.users.activate(id) : apiRoutes.users.deactivate(id);
  const { data } = await apiClient.patch<Driver>(path);
  return data;
}

// Feature 009 T024: `updateDriverTruck` removed — a vehicle is no longer a field on the
// driver (spec 008 cutover). See trucks.api.ts/tanks.api.ts for the real entities, and
// dispatch.api.ts's `assignDriver` for how a driver, truck and tank are actually associated
// (per delivery, never persistently).
