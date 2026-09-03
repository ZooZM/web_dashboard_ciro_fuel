import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

// Mirrors `src/common/enums/credit-limit-request-state.enum.ts` (FR-097).
export const CreditLimitRequestState = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
} as const;
export type CreditLimitRequestState =
  (typeof CreditLimitRequestState)[keyof typeof CreditLimitRequestState];

export interface CreditLimitRequest {
  _id: string;
  companyId: string;
  clientId: string;
  requestedAmount: number;
  state: CreditLimitRequestState;
  grantedAmount?: number;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

// FR-030: the admin's queue, optionally filtered by state.
export async function listCreditLimitRequests(
  state?: CreditLimitRequestState,
): Promise<CreditLimitRequest[]> {
  const { data } = await apiClient.get<{ items: CreditLimitRequest[] }>(
    apiRoutes.creditLimitRequests.list,
    { params: state ? { state } : undefined },
  );
  return data.items;
}

export interface ResolveCreditLimitRequestInput {
  accept: boolean;
  grantedAmount?: number;
}

// FR-030/FR-031/SC-008: conditional on PENDING server-side — a second resolution 409s.
export async function resolveCreditLimitRequest(
  id: string,
  input: ResolveCreditLimitRequestInput,
): Promise<CreditLimitRequest> {
  const { data } = await apiClient.patch<CreditLimitRequest>(
    apiRoutes.creditLimitRequests.resolve(id),
    input,
  );
  return data;
}
