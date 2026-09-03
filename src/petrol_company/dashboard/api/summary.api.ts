import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

// Feature 013 T112/FR-044/FR-046: `GET /orders/summary` — for a FUEL_COMPANY_ADMIN this
// returns `FuelCompanySummaryDto`, not the TRANSPORT_COMPANY_ADMIN shape
// (`transport_company/dashboard/api/summary.api.ts`'s `OrderSummary`) the platform
// returns to that other role on the same route.
export interface OutstandingSettlementsSummary {
  amount: number;
  currency: string;
  count: number;
}

export interface FuelCompanySummary {
  pendingApproval: number;
  inProgress: number;
  completedInPeriod: number;
  stationOwnersCount: number;
  stationsCount: number;
  creditOutstanding: OutstandingSettlementsSummary;
}

export async function getFuelCompanySummary(from?: string, to?: string): Promise<FuelCompanySummary> {
  const { data } = await apiClient.get<FuelCompanySummary>(apiRoutes.orders.summary, {
    params: { from, to },
  });
  return data;
}
