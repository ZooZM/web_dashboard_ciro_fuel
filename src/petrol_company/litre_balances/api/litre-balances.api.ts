import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { FuelType } from '@/constants/order-status';

export const LitreMovementKind = {
  SHORTFALL_CREDIT: 'SHORTFALL_CREDIT',
  EXCESS_DEBIT: 'EXCESS_DEBIT',
  ORDER_DRAWDOWN: 'ORDER_DRAWDOWN',
  DRAWDOWN_RETURNED: 'DRAWDOWN_RETURNED',
  CORRECTION: 'CORRECTION',
} as const;
export type LitreMovementKind = (typeof LitreMovementKind)[keyof typeof LitreMovementKind];

export interface LitreMovement {
  _id: string;
  kind: LitreMovementKind;
  litres: number;
  orderId: string | null;
  reason: string | null;
  actorId: string;
  at: string;
}

export interface LitreBalance {
  _id: string;
  companyId: string;
  clientId: string;
  fuelType: FuelType;
  balanceLitres: number;
  movements: LitreMovement[];
}

// Feature 013 T170(-style)/FR-073/FR-074/FR-075/FR-076: `GET /litre-balances` (FCA,
// optional `?clientId=`) — the fuel company's own view across its clients.
export async function listLitreBalances(clientId?: string): Promise<LitreBalance[]> {
  const { data } = await apiClient.get<{ items: LitreBalance[] }>(apiRoutes.litreBalances.list, {
    params: clientId ? { clientId } : undefined,
  });
  return data.items;
}

export async function recordCorrection(balanceId: string, litres: number, reason: string): Promise<LitreBalance> {
  const { data } = await apiClient.post<LitreBalance>(apiRoutes.litreBalances.correction(balanceId), {
    litres,
    reason,
  });
  return data;
}
