import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { FuelType } from '@/constants/order-status';

export interface UploadSupplierInvoiceResult {
  fileId: string;
  extracted: { quantityLitres?: number; fuelType?: FuelType; reference?: string; issueDate?: string };
  orderedQuantityLitres: number;
}

// Feature 013 T206/FR-073a-i/SC-014c: stores the document and attempts extraction.
// Records nothing on the order and moves no balance — a genuinely separate step from
// {@link confirmSupplierInvoice} below.
export async function uploadSupplierInvoice(orderId: string, file: File): Promise<UploadSupplierInvoiceResult> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await apiClient.post<UploadSupplierInvoiceResult>(
    apiRoutes.orders.supplierInvoiceUpload(orderId),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data;
}

export interface ConfirmSupplierInvoiceInput {
  fileId: string;
  confirmed: { quantityLitres: number; fuelType: FuelType; reference: string; issueDate: string };
}

export interface ConfirmSupplierInvoiceResult {
  shortfallLitres: number;
  balanceWarning?: 'LITRE_BALANCE_WOULD_GO_NEGATIVE';
  [key: string]: unknown;
}

// T186/FR-073a-ii — records the confirmed invoice and applies the balance movement.
// Refused (409 SUPPLIER_INVOICE_ALREADY_RECORDED) if this order already has one — the
// caller must use `replaceSupplierInvoice` instead once `order.supplierInvoice` exists.
export async function confirmSupplierInvoice(
  orderId: string,
  input: ConfirmSupplierInvoiceInput,
): Promise<ConfirmSupplierInvoiceResult> {
  const { data } = await apiClient.post<ConfirmSupplierInvoiceResult>(
    apiRoutes.orders.supplierInvoice(orderId),
    input,
  );
  return data;
}

// T192/FR-073e — supersedes the current invoice and restates the balance movement.
export async function replaceSupplierInvoice(
  orderId: string,
  input: ConfirmSupplierInvoiceInput,
): Promise<ConfirmSupplierInvoiceResult> {
  const { data } = await apiClient.put<ConfirmSupplierInvoiceResult>(
    apiRoutes.orders.supplierInvoice(orderId),
    input,
  );
  return data;
}
