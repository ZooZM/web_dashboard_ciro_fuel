import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';
import type { CursorPage } from '@/lib/api/pagination';
import { CommissionBasis } from '@/petrol_company/invoices/api/billing.api';

// Feature 013 T170/FR-064/FR-071: mirrors `src/modules/platform-account/schemas/
// account-movement.schema.ts`. `AccountMovementKind`/`AccountMovementState` reuse
// `CommissionBasis`'s `as const` pattern (FR-097).
export const AccountMovementKind = {
  COMMISSION_CHARGED: 'COMMISSION_CHARGED',
  CASHBACK_CREDITED: 'CASHBACK_CREDITED',
  PAYMENT_RECORDED: 'PAYMENT_RECORDED',
  // spec 017 T148/FR-066 — the platform paying a fuel company its accrued
  // cashback. The only OUTBOUND kind on the platform.
  CASHBACK_PAID_OUT: 'CASHBACK_PAID_OUT',
} as const;
export type AccountMovementKind = (typeof AccountMovementKind)[keyof typeof AccountMovementKind];

/**
 * spec 017 (operator dashboard) T148/FR-064/FR-071 — which way the money went,
 * from the COMPANY's point of view.
 *
 * **Derived by the platform from `kind` at serialisation, never stored** — so
 * no existing row migrated and every field this dashboard already read is
 * unchanged. Without it a cashback the platform paid OUT and a payment the
 * company paid IN are two rows with a positive amount and no visible
 * difference between them, which is exactly the confusion FR-071 exists to
 * prevent.
 */
export const AccountMovementDirection = {
  INBOUND: 'INBOUND',
  OUTBOUND: 'OUTBOUND',
} as const;
export type AccountMovementDirection =
  (typeof AccountMovementDirection)[keyof typeof AccountMovementDirection];

export const AccountMovementState = {
  RECORDED: 'RECORDED',
  CONFIRMED: 'CONFIRMED',
} as const;
export type AccountMovementState = (typeof AccountMovementState)[keyof typeof AccountMovementState];

export const SettlementMethod = {
  BANK_TRANSFER: 'BANK_TRANSFER',
  NATIONAL_PAYMENT_SERVICE: 'NATIONAL_PAYMENT_SERVICE',
} as const;
export type SettlementMethod = (typeof SettlementMethod)[keyof typeof SettlementMethod];

export interface AccountMovement {
  _id: string;
  companyId: string;
  kind: AccountMovementKind;
  amount: number;
  currency: string;
  sourceInvoiceId: string | null;
  appliedRate: number | null;
  appliedBasis: CommissionBasis | null;
  method: SettlementMethod | null;
  reference: string | null;
  documentFileId: string | null;
  state: AccountMovementState;
  confirmedBy: string | null;
  confirmedAt: string | null;
  reversalOfId: string | null;
  createdAt: string;
  /** Derived from `kind` by the platform (FR-064). */
  direction: AccountMovementDirection;
}

export interface MovementListParams {
  kind?: AccountMovementKind;
  state?: AccountMovementState;
  cursor?: string;
}

export async function listMovements(params: MovementListParams = {}): Promise<CursorPage<AccountMovement>> {
  const { data } = await apiClient.get<CursorPage<AccountMovement>>(apiRoutes.platformAccount.movements, {
    params,
  });
  return data;
}

export interface RecordPaymentInput {
  amount: number;
  method: SettlementMethod;
  reference?: string;
  documentFileId?: string;
}

// T161/FR-065/FR-072: full or partial — created `RECORDED`, never affecting the balance
// until the operator confirms it (T163, out of this role's reach entirely — no
// confirm-related call exists in this file, FR-069 is `SA` only).
export async function recordPayment(input: RecordPaymentInput): Promise<AccountMovement> {
  const { data } = await apiClient.post<AccountMovement>(apiRoutes.platformAccount.payments, input);
  return data;
}

// T165/FR-067 — the generic upload endpoint, `purpose: PAYMENT_EVIDENCE`. Returns the
// FileRecord's id, passed as `documentFileId` to `recordPayment` above.
export async function uploadPaymentEvidence(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('purpose', 'PAYMENT_EVIDENCE');
  formData.append('file', file);
  const { data } = await apiClient.post<{ _id: string }>(apiRoutes.files.upload, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data._id;
}

// `GET /files/:id` is a 302 to a short-lived signed location, not a public byte route
// (spec 012 FR-039/042a) — a bare `<a href>` would send no `Authorization` header and get
// a 401 before the redirect is ever reached. Fetching it through `apiClient` attaches the
// header, and the browser follows the 302 transparently, so the response body IS the
// file's bytes; `URL.createObjectURL` turns that into something a new tab can open.
export async function getDocumentBlobUrl(fileId: string): Promise<string> {
  const response = await apiClient.get<Blob>(apiRoutes.files.detail(fileId), { responseType: 'blob' });
  return URL.createObjectURL(response.data);
}
