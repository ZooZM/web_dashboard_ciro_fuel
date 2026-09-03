import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CursorPage } from '@/lib/api/pagination';
import type { FuelType } from '@/constants/order-status';

export const ExchangeRequestState = {
  AWAITING_RESPONSE: 'AWAITING_RESPONSE',
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
  WITHDRAWN: 'WITHDRAWN',
} as const;
export type ExchangeRequestState = (typeof ExchangeRequestState)[keyof typeof ExchangeRequestState];

export type ExchangeDirection = 'incoming' | 'outgoing' | 'all';

export interface ExchangeRequest {
  _id: string;
  partyCompanyIds: string[];
  raisedByCompanyId: string;
  recipientCompanyId: string;
  raisedByUserId: string;
  fuelType: FuelType;
  quantityLitres: number;
  unitPrice: number;
  currency: string;
  deliveryAt: string;
  deliveryPlaceText: string;
  state: ExchangeRequestState;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export interface ExchangeRequestDetail extends ExchangeRequest {
  counterparty: { _id: string; name: string; contactEmail: string; contactPhone: string };
}

export interface ExchangePartner {
  _id: string;
  name: string;
}

// Feature 013 T230/FR-078/FR-079/FR-084: `direction` is the platform's own
// incoming/outgoing/all split — never computed client-side from `raisedByCompanyId`
// (the backend already derives it against the viewer, FR-079).
export async function listExchangeRequests(
  direction: ExchangeDirection,
  cursor?: string,
): Promise<CursorPage<ExchangeRequest>> {
  const { data } = await apiClient.get<CursorPage<ExchangeRequest>>(apiRoutes.fuelExchange.list, {
    params: { direction, ...(cursor ? { cursor } : {}) },
  });
  return data;
}

export async function getExchangeRequest(id: string): Promise<ExchangeRequestDetail> {
  const { data } = await apiClient.get<ExchangeRequestDetail>(apiRoutes.fuelExchange.detail(id));
  return data;
}

export interface CreateExchangeRequestInput {
  recipientCompanyId: string;
  fuelType: FuelType;
  quantityLitres: number;
  unitPrice: number;
  deliveryAt: string;
  deliveryPlaceText: string;
}

export async function createExchangeRequest(input: CreateExchangeRequestInput): Promise<ExchangeRequest> {
  const { data } = await apiClient.post<ExchangeRequest>(apiRoutes.fuelExchange.create, input);
  return data;
}

export async function respondToExchangeRequest(id: string, accept: boolean): Promise<ExchangeRequest> {
  const { data } = await apiClient.patch<ExchangeRequest>(apiRoutes.fuelExchange.respond(id), { accept });
  return data;
}

export async function withdrawExchangeRequest(id: string): Promise<ExchangeRequest> {
  const { data } = await apiClient.patch<ExchangeRequest>(apiRoutes.fuelExchange.withdraw(id), {});
  return data;
}

// T232/FR-078: the only way this role can discover a counterparty — `GET /companies`
// itself narrows a FUEL_COMPANY_ADMIN to their own company (a different, pre-existing
// contract this feature does not change).
export async function listExchangePartners(): Promise<ExchangePartner[]> {
  const { data } = await apiClient.get<ExchangePartner[]>(apiRoutes.companies.exchangePartners);
  return data;
}
