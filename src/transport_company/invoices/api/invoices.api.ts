import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CursorPage } from '@/lib/api/pagination';
import type { Invoice } from '@/transport_company/invoices/types';

export interface InvoiceListParams {
  state?: 'ISSUED' | 'SETTLED' | 'VOID';
  cursor?: string;
}

export async function listInvoices(params: InvoiceListParams): Promise<CursorPage<Invoice>> {
  const { data } = await apiClient.get<CursorPage<Invoice>>(apiRoutes.invoices.list, { params });
  return data;
}

export async function settleInvoice(id: string, paymentReference?: string): Promise<Invoice> {
  const { data } = await apiClient.post<Invoice>(apiRoutes.invoices.settle(id), { paymentReference });
  return data;
}
