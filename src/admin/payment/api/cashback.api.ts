import { apiClient } from '@/lib/api/api.client';
import { apiRoutes } from '@/constants/api-routes';

/**
 * spec 017 (operator dashboard) T145/US8 — what the platform owes a fuel
 * company, and recording that it paid.
 *
 * **No payment provider is integrated** (FR-073). These routes record that
 * money moved elsewhere; they do not move any.
 */
// Reused, never redeclared — the platform has exactly TWO settlement channels
// (`src/common/enums/settlement-method.enum.ts`), and a local copy here would be
// a second list to keep in step with it.
export { SettlementMethod } from '@/petrol_company/platform_account/api/platform-account.api';
import type { SettlementMethod } from '@/petrol_company/platform_account/api/platform-account.api';

export interface CashbackOwed {
  companyId: string;
  /**
   * Computed live as confirmed `CASHBACK_CREDITED` minus confirmed
   * `CASHBACK_PAID_OUT` — a TWO-kind derivation, never a stored total. The
   * platform's per-kind balance cannot answer this: a payout under the new kind
   * leaves the credited total untouched (research R11).
   */
  owed: number;
  currency: string;
}

export async function getCashbackOwed(companyId: string): Promise<CashbackOwed> {
  const { data } = await apiClient.get<CashbackOwed>(
    apiRoutes.platformAccount.cashbackOwed(companyId),
  );
  return data;
}

export interface RecordCashbackPayoutInput {
  amount: number;
  method: SettlementMethod;
  /**
   * **Required** (FR-070). It is what the duplicate refusal is keyed on: an
   * optional reference would leave the platform unable to tell a resubmitted
   * form from a genuine second payout, which is exactly the mistake that pays a
   * company twice.
   */
  reference: string;
  evidence?: File;
}

export async function recordCashbackPayout(
  companyId: string,
  input: RecordCashbackPayoutInput,
): Promise<{ _id: string; amount: number; direction: string; state: string }> {
  const formData = new FormData();
  formData.append('amount', String(input.amount));
  formData.append('method', input.method);
  formData.append('reference', input.reference);
  if (input.evidence) formData.append('evidence', input.evidence);

  const { data } = await apiClient.post<{
    _id: string;
    amount: number;
    direction: string;
    state: string;
  }>(apiRoutes.platformAccount.cashbackPayouts(companyId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}
