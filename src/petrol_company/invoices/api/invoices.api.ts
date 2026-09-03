import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CursorPage } from '@/lib/api/pagination';

// Feature 013 Phase 6/9: `GET /invoices` — settling and the full list screen land in
// Phase 9 (US6); `getInvoice` here backs the order-detail card, which needs only the one
// invoice an approved order already carries (R4 — issued at approval, not delivery).
export interface Invoice {
  _id: string;
  orderId: string;
  fuelCompanyId: string;
  clientId: string;
  transportCompanyId: string | null;
  amount: number;
  method: 'DIRECT' | 'DEFERRED' | 'CREDIT';
  state: 'ISSUED' | 'SETTLED' | 'VOID';
  payerRole: string;
  settledAt: string | null;
  paymentReference: string | null;
  createdAt: string;
}

export async function getInvoice(id: string): Promise<Invoice> {
  const { data } = await apiClient.get<Invoice>(apiRoutes.invoices.detail(id));
  return data;
}

export interface InvoiceListParams {
  method?: string;
  state?: string;
  cursor?: string;
}

export async function listInvoices(params: InvoiceListParams): Promise<CursorPage<Invoice>> {
  const { data } = await apiClient.get<CursorPage<Invoice>>(apiRoutes.invoices.list, { params });
  return data;
}

export async function settleInvoice(id: string, paymentReference?: string): Promise<Invoice> {
  const { data } = await apiClient.post<Invoice>(apiRoutes.invoices.settle(id), {
    paymentReference,
  });
  return data;
}
