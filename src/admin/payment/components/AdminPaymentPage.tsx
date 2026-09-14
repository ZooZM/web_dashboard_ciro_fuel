import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import { toApiError } from '@/lib/api/api-error';
import {
  useCashbackOwed,
  useRecordCashbackPayout,
} from '@/admin/payment/hooks/useCashback';
import { SettlementMethod } from '@/petrol_company/platform_account/api/platform-account.api';

/**
 * spec 017 (operator dashboard) US8 — the operator records a cashback payout to
 * a fuel company.
 *
 * Two corrections worth stating, both of which this file previously carried in
 * the opposite direction:
 *
 *  - **`TOTAL_AMOUNT = 299060.50` is gone.** The owed figure is now computed
 *    live, and the way it is computed is the whole trap this story turns on:
 *    it nets confirmed `CASHBACK_PAID_OUT` against confirmed
 *    `CASHBACK_CREDITED`. The platform's existing balance method is per-kind
 *    and would have left this number unchanged after every payout, while still
 *    returning something perfectly plausible (research R11).
 *  - **This file's own comment asserted the platform "never pays a company out
 *    through this flow".** That was true when written and is false now.
 *
 * **The displayed balance is never decremented optimistically** (FR-069). The
 * authoritative figure is re-read server-side inside the recording transaction,
 * so a local decrement could disagree with it — and would disagree in the one
 * direction that matters, showing less owed than actually is.
 */
// The platform has exactly two settlement channels — read from the shared
// constant, never re-listed here (Constitution I).
const METHODS: SettlementMethod[] = Object.values(SettlementMethod);

export function AdminPaymentPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { companyId } = useParams<{ companyId: string }>();

  const owed = useCashbackOwed(companyId);
  const payout = useRecordCashbackPayout(companyId);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<SettlementMethod>(SettlementMethod.BANK_TRANSFER);
  const [reference, setReference] = useState('');
  const [evidence, setEvidence] = useState<File | null>(null);

  const error = payout.error ? toApiError(payout.error) : null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await payout.mutateAsync({
      amount: Number(amount),
      method,
      reference,
      ...(evidence ? { evidence } : {}),
    });
    setAmount('');
    setReference('');
    setEvidence(null);
  }

  return (
    <div
      className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans animate-in fade-in duration-500"
      dir="rtl"
    >
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E9EF] rounded-lg hover:bg-slate-50 transition-colors shrink-0"
          >
            <ChevronRight className="w-5 h-5 text-[#162155]" />
          </button>
          <span className="text-[#858C95] font-bold text-sm">{t('cashback.payout')}</span>
        </div>

        {/* The live owed figure (FR-065). */}
        <div className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm text-center">
          <span className="text-[#858C95] text-xs font-bold block mb-2">
            {t('cashback.owed')}
          </span>
          {owed.isLoading && <div className="h-8 bg-slate-100 rounded animate-pulse" />}
          {owed.isError && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-sm font-bold text-red-700">{t('common.loadError')}</p>
              <button
                type="button"
                onClick={() => void owed.refetch()}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
              >
                {t('common.retry')}
              </button>
            </div>
          )}
          {owed.data && (
            <span className="text-3xl font-black text-[#162155]">
              {owed.data.owed.toLocaleString()}{' '}
              <span className="text-base text-slate-500">{owed.data.currency}</span>
            </span>
          )}
        </div>

        <form
          onSubmit={submit}
          className="bg-white border border-[#E7E9EF] rounded-2xl p-6 shadow-sm flex flex-col gap-4 text-right"
        >
          <div className="flex flex-col">
            <label htmlFor="payout-amount" className="text-sm font-bold text-slate-700 mb-2">
              {t('cashback.amount')}
            </label>
            <input
              id="payout-amount"
              required
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full px-4 py-3 border border-[#E7E9EF] rounded-xl text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="payout-method" className="text-sm font-bold text-slate-700 mb-2">
              {t('cashback.method')}
            </label>
            <select
              id="payout-method"
              value={method}
              onChange={(event) => setMethod(event.target.value as SettlementMethod)}
              className="w-full px-4 py-3 border border-[#E7E9EF] rounded-xl text-sm font-medium"
            >
              {METHODS.map((option) => (
                <option key={option} value={option}>
                  {t(`billing.settlementMethod.${option}`, { defaultValue: option })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="payout-reference" className="text-sm font-bold text-slate-700 mb-2">
              {t('cashback.reference')} <span className="text-red-500">*</span>
            </label>
            <input
              id="payout-reference"
              required
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              className="w-full px-4 py-3 border border-[#E7E9EF] rounded-xl text-sm font-medium font-mono"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="payout-evidence" className="text-sm font-bold text-slate-700 mb-2">
              {t('cashback.evidence')}
            </label>
            <input
              id="payout-evidence"
              type="file"
              onChange={(event) => setEvidence(event.target.files?.[0] ?? null)}
              className="w-full text-sm"
            />
          </div>

          {/*
            Both refusals are the PLATFORM's and are rendered as refusals. A
            409 over-balance is judged against the figure re-read inside the
            recording transaction, not the one this screen is showing — so it
            can fire even when the number above looks sufficient, and the
            wording says what happened rather than blaming the form.
          */}
          {error && (
            <p className="text-sm font-bold text-red-700">
              {error.error === 'CASHBACK_PAYOUT_EXCEEDS_BALANCE'
                ? t('cashback.exceedsBalance')
                : error.error === 'CASHBACK_PAYOUT_DUPLICATE_REFERENCE'
                  ? t('cashback.duplicateReference')
                  : error.message}
            </p>
          )}

          {payout.isSuccess && (
            <p className="text-sm font-bold text-emerald-700">{t('cashback.recorded')}</p>
          )}

          <button
            type="submit"
            disabled={payout.isPending || !companyId}
            className="self-start bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-bold"
          >
            {payout.isPending ? t('common.saving') : t('cashback.payout')}
          </button>
        </form>
      </div>
    </div>
  );
}
