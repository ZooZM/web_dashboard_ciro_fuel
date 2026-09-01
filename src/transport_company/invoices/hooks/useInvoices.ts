import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as invoicesApi from '@/transport_company/invoices/api/invoices.api';
import type { InvoiceListParams } from '@/transport_company/invoices/api/invoices.api';

export function useInvoicesList(params: InvoiceListParams) {
  return useQuery({
    queryKey: ['invoices', params],
    queryFn: () => invoicesApi.listInvoices(params),
  });
}

export function useSettleInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, paymentReference }: { id: string; paymentReference?: string }) =>
      invoicesApi.settleInvoice(id, paymentReference),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['invoices'] }),
  });
}
