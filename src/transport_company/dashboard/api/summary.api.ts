import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

export interface OrderSummary {
  awaitingAssignment: number;
  inProgress: number;
  completedInPeriod: number;
  driversOnDuty: number;
  outstandingSettlements: { amount: number; currency: string; count: number };
}

/** FR-067: the whole dashboard home in one request. */
export async function getSummary(from?: string, to?: string): Promise<OrderSummary> {
  const { data } = await apiClient.get<OrderSummary>(apiRoutes.orders.summary, {
    params: { from, to },
  });
  return data;
}
