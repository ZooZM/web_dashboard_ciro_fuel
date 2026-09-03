import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/query-keys';
import * as supplierInvoiceApi from '@/petrol_company/orders/api/supplier-invoice.api';
import type { ConfirmSupplierInvoiceInput } from '@/petrol_company/orders/api/supplier-invoice.api';

export function useUploadSupplierInvoice(orderId: string) {
  return useMutation({
    mutationFn: (file: File) => supplierInvoiceApi.uploadSupplierInvoice(orderId, file),
  });
}

function useInvalidateOrderAndBalances(orderId: string) {
  const queryClient = useQueryClient();
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    void queryClient.invalidateQueries({ queryKey: ['litre-balances'] });
  };
}

export function useConfirmSupplierInvoice(orderId: string) {
  const invalidate = useInvalidateOrderAndBalances(orderId);
  return useMutation({
    mutationFn: (input: ConfirmSupplierInvoiceInput) => supplierInvoiceApi.confirmSupplierInvoice(orderId, input),
    onSuccess: invalidate,
  });
}

export function useReplaceSupplierInvoice(orderId: string) {
  const invalidate = useInvalidateOrderAndBalances(orderId);
  return useMutation({
    mutationFn: (input: ConfirmSupplierInvoiceInput) => supplierInvoiceApi.replaceSupplierInvoice(orderId, input),
    onSuccess: invalidate,
  });
}
