import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

// Feature 013 T122/FR-053: mirrors `src/common/enums/support-topic.enum.ts` and
// `support-request-state.enum.ts` exactly (FR-097).
export const SupportTopic = {
  ORDER_ISSUE: 'ORDER_ISSUE',
  PAYMENT: 'PAYMENT',
  ACCOUNT: 'ACCOUNT',
  OTHER: 'OTHER',
} as const;
export type SupportTopic = (typeof SupportTopic)[keyof typeof SupportTopic];

export const SupportRequestState = {
  SUBMITTED: 'SUBMITTED',
  ACKNOWLEDGED: 'ACKNOWLEDGED',
} as const;
export type SupportRequestState = (typeof SupportRequestState)[keyof typeof SupportRequestState];

export interface SupportRequest {
  _id: string;
  companyId: string;
  clientId: string;
  orderId: string | null;
  topic: SupportTopic;
  message: string;
  state: SupportRequestState;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  createdAt: string;
}

// `GET /support/requests` — the tenant plugin scopes this to the acting FUEL_COMPANY_ADMIN's
// own company automatically; no params to send (contract §8 — not paginated).
export async function listSupportRequests(): Promise<SupportRequest[]> {
  const { data } = await apiClient.get<{ items: SupportRequest[] }>(apiRoutes.support.list);
  return data.items;
}

export async function acknowledgeSupportRequest(id: string): Promise<SupportRequest> {
  const { data } = await apiClient.patch<SupportRequest>(apiRoutes.support.acknowledge(id));
  return data;
}
