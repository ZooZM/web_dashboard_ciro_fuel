import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { AmountCard } from './AmountCard';
import { PaymentMethodCard } from './PaymentMethodCard';
import { SadadDetailsCard } from './SadadDetailsCard';
import { BankTransferDetailsCard } from './BankTransferDetailsCard';
import { useMyBillingBalances } from '@/petrol_company/invoices/hooks/useBilling';
import { useRecordPayment } from '@/petrol_company/platform_account/hooks/usePlatformAccount';
import { uploadPaymentEvidence, SettlementMethod } from '@/petrol_company/platform_account/api/platform-account.api';
import { ApiError } from '@/lib/api/api-error';

// Feature 013 T174/T175/T176/T177/FR-065/FR-066/FR-066a/FR-066b/FR-067/FR-098: records
// what the payer reports (`POST /platform-account/payments`) — no payment provider is
// integrated anywhere in this flow (FR-066a), and nothing here is ever presented as proof
// of payment (FR-066b). `totalAmount` is the real accrued commission balance
// (`GET /billing/balances/me`), not a fabricated figure.
export function PaymentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: balances, isLoading: balancesLoading } = useMyBillingBalances();
  const recordPayment = useRecordPayment();

  const [paymentMethod, setPaymentMethod] = useState<'sadad' | 'bank' | null>(null);
  const [amountType, setAmountType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState<number>(0);
  const [reference, setReference] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalAmount = balances?.commissionAccrued ?? 0;
  const amountToPay = amountType === 'full' ? totalAmount : partialAmount;
  const hasEvidence = reference.trim().length > 0 || file !== null;
  const canSubmit = paymentMethod !== null && amountToPay > 0 && hasEvidence && !submitting;

  async function handleSubmit() {
    if (!canSubmit || !paymentMethod) return;
    setSubmitting(true);
    try {
      const documentFileId = file ? await uploadPaymentEvidence(file) : undefined;
      await recordPayment.mutateAsync({
        amount: amountToPay,
        method: paymentMethod === 'bank' ? SettlementMethod.BANK_TRANSFER : SettlementMethod.NATIONAL_PAYMENT_SERVICE,
        reference: reference.trim() || undefined,
        documentFileId,
      });
      toast.success(t('platformAccount.paymentRecorded'));
      navigate('/petrolCompany/PlatformAccountPage');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E9EF] rounded-lg hover:bg-slate-50 transition-colors shrink-0">
            <ChevronRight className="w-5 h-5 text-[#162155]" />
          </button>
          <span className="text-[#858C95] font-bold text-sm">{t('platformAccount.payCommission')}</span>
        </div>

        <div className="flex flex-col gap-2 items-center text-center mt-2 mb-4">
          <h1 className="text-2xl font-black text-[#162155]">{t('platformAccount.chooseAmountAndMethod')}</h1>
          <p className="text-[#858C95] font-semibold text-sm">{t('platformAccount.payOwedSubtitle')}</p>
        </div>

        {balancesLoading ? (
          <p className="text-center text-sm text-slate-400 py-6">{t('common.loading')}</p>
        ) : totalAmount <= 0 ? (
          <p className="text-center text-sm text-slate-400 py-6">{t('platformAccount.nothingOwed')}</p>
        ) : (
          <>
            <AmountCard
              amountType={amountType}
              setAmountType={setAmountType}
              partialAmount={partialAmount}
              setPartialAmount={setPartialAmount}
              totalAmount={totalAmount}
            />

            <PaymentMethodCard paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />

            {paymentMethod === 'sadad' && (
              <SadadDetailsCard reference={reference} onReferenceChange={setReference} file={file} onFileChange={setFile} />
            )}
            {paymentMethod === 'bank' && (
              <BankTransferDetailsCard reference={reference} onReferenceChange={setReference} file={file} onFileChange={setFile} />
            )}

            {paymentMethod && (
              <button
                onClick={() => void handleSubmit()}
                disabled={!canSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-base py-4 rounded-2xl transition-colors"
              >
                {submitting ? t('common.loading') : t('platformAccount.confirmPayment')}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
