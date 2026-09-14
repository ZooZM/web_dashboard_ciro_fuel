import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CursorPage } from '@/lib/api/pagination';

/**
 * spec 017 (operator dashboard) T087/US5 — the platform's driver roster.
 *
 * **This type is the privacy boundary as the screen sees it** (FR-043,
 * FR-044). The platform sends exactly these seven fields and nothing else — no
 * `location`, `lastSeenAt`, `lastMovedAt`, `activeOrderId`, trip count or
 * delivery date — and SC-014 asserts that against the serialized response
 * rather than against what any screen renders. Declaring the narrow shape here
 * too means a component cannot reach for a field the platform does not send.
 */
export type DutyState = 'ON_DUTY' | 'OFF_DUTY' | 'UNKNOWN';

export interface DriverRosterRow {
  driverId: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  /**
   * Three-valued. `UNKNOWN` means the driver has never connected — a PRESENT
   * value on a PRESENT row, not a reason to omit them (FR-040).
   */
  dutyState: DutyState;
  transportCompany: { id: string; name: string } | null;
  /**
   * `null` means **never driven** (FR-039b) — a real, distinct fact the screen
   * renders as such rather than as a blank cell.
   */
  lastOperatedTruck: { id: string; plateNumber: string } | null;
}

export interface DriverRosterParams {
  isActive?: boolean;
  dutyState?: DutyState;
  cursor?: string;
}

export async function listDriverRoster(
  params: DriverRosterParams = {},
): Promise<CursorPage<DriverRosterRow>> {
  const { data } = await apiClient.get<CursorPage<DriverRosterRow>>(
    apiRoutes.drivers.roster,
    {
      params: {
        ...(params.isActive === undefined ? {} : { isActive: String(params.isActive) }),
        ...(params.dutyState ? { dutyState: params.dutyState } : {}),
        ...(params.cursor ? { cursor: params.cursor } : {}),
      },
    },
  );
  return data;
}
