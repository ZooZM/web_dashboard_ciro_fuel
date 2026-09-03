import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as invoicesApi from '@/petrol_company/invoices/api/invoices.api';
import type { InvoiceListParams } from '@/petrol_company/invoices/api/invoices.api';

export function useInvoiceDetail(id: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.invoices.detail(id ?? ''),
    queryFn: () => invoicesApi.getInvoice(id!),
    enabled: Boolean(id),
  });
}

export function useInvoicesList(params: InvoiceListParams) {
  return useQuery({
    queryKey: queryKeys.invoices.list(params),
    queryFn: () => invoicesApi.listInvoices(params),
  });
}

export function useSettleInvoice(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentReference?: string) => invoicesApi.settleInvoice(id, paymentReference),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(id) });
      void queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}
