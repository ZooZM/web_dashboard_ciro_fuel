import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

// Feature 013 T154/FR-055/FR-059: mirrors `src/common/enums/commission-basis.enum.ts`
// (FR-097).
export const CommissionBasis = {
  PERCENTAGE: 'PERCENTAGE',
  PER_UNIT: 'PER_UNIT',
} as const;
export type CommissionBasis = (typeof CommissionBasis)[keyof typeof CommissionBasis];

export interface CommissionTerm {
  _id: string;
  basis: CommissionBasis;
  rate: number;
  effectiveFrom: string;
  setBy: string;
}

export interface CashbackProgramme {
  _id: string;
  basis: CommissionBasis;
  rate: number;
  isActive: boolean;
  targetsAllCompanies: boolean;
  targetCompanyIds: string[];
  effectiveFrom: string;
  setBy: string;
}

export interface BillingBalances {
  commissionAccrued: number;
  cashbackAccrued: number;
  commissionCeiling: number;
  ceilingWarning: boolean;
  ceilingExceeded: boolean;
  currency: string;
}

// Read-only for FUEL_COMPANY_ADMIN — no `setCommissionTerm`/`setCashbackProgramme`
// functions exist in this file at all (T155/FR-056: the editing surface belongs to the
// operator only, US13). `null` means the operator hasn't configured one yet.
export async function getCurrentCommissionTerm(): Promise<CommissionTerm | null> {
  const { data } = await apiClient.get<CommissionTerm | null>(apiRoutes.billing.commissionTermsCurrent);
  return data;
}

export async function getCurrentCashbackProgramme(): Promise<CashbackProgramme | null> {
  const { data } = await apiClient.get<CashbackProgramme | null>(apiRoutes.billing.cashbackProgrammeCurrent);
  return data;
}

export async function getMyBillingBalances(): Promise<BillingBalances> {
  const { data } = await apiClient.get<BillingBalances>(apiRoutes.billing.balancesMe);
  return data;
}
