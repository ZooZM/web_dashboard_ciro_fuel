import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { CommissionTypeSelector } from '@/petrol_company/invoices/components/CommissionTypeSelector';
import {
  useAdminCurrentCommissionTerm,
  useAdminCurrentCashbackProgramme,
  useSetCommissionTerm,
  useSetCashbackProgramme,
} from '@/admin/petrol_companies/hooks/useFuelCompanies';
import { ApiError } from '@/lib/api/api-error';

type Basis = 'per_riyal' | 'percentage';
const toApiBasis = (b: Basis) => (b === 'percentage' ? 'PERCENTAGE' : 'PER_UNIT');
const fromApiBasis = (b: 'PERCENTAGE' | 'PER_UNIT'): Basis => (b === 'PERCENTAGE' ? 'percentage' : 'per_riyal');

// Feature 013 T239/FR-055/FR-056/FR-058/FR-059: the operator's own write surface for the
// PLATFORM-WIDE commission rate and cashback programme — genuinely new, since neither had
// anywhere to be edited from before this phase (`PUT /billing/commission-terms`/
// `cashback-programme` are SUPER_ADMIN only and existed since Phase 12 with no UI). Every
// write inserts a new effective-dated record (FR-058) — there is no "current value" to
// edit in place, so the form always starts from the CURRENT term/programme and submits a
// fresh one, exactly matching the backend's own no-update-path design.
export function AdminBillingSettingsPage() {
  const { t } = useTranslation();
  const { data: currentTerm } = useAdminCurrentCommissionTerm();
  const { data: currentProgramme } = useAdminCurrentCashbackProgramme();
  const setTerm = useSetCommissionTerm();
  const setProgramme = useSetCashbackProgramme();

  const [commissionBasis, setCommissionBasis] = useState<Basis>('percentage');
  const [commissionRate, setCommissionRate] = useState('');
  const [cashbackBasis, setCashbackBasis] = useState<Basis>('percentage');
  const [cashbackRate, setCashbackRate] = useState('');
  const [cashbackActive, setCashbackActive] = useState(true);

  async function handleSaveCommission() {
    const rate = Number(commissionRate);
    if (!Number.isFinite(rate) || rate < 0) {
      toast.error(t('adminCompanies.invalidRate'));
      return;
    }
    try {
      await setTerm.mutateAsync({ basis: toApiBasis(commissionBasis), rate });
      toast.success(t('adminCompanies.commissionUpdated'));
      setCommissionRate('');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  async function handleSaveCashback() {
    const rate = Number(cashbackRate);
    if (!Number.isFinite(rate) || rate < 0) {
      toast.error(t('adminCompanies.invalidRate'));
      return;
    }
    try {
      await setProgramme.mutateAsync({
        basis: toApiBasis(cashbackBasis),
        rate,
        isActive: cashbackActive,
        targetsAllCompanies: true,
        targetCompanyIds: [],
      });
      toast.success(t('adminCompanies.cashbackUpdated'));
      setCashbackRate('');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-[calc(100vh-6rem)] border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex flex-col gap-1 mb-8 text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('adminCompanies.billingSettingsTitle')}</h1>
        <p className="text-sm font-bold text-slate-500">{t('adminCompanies.billingSettingsSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-black text-[#162155]">{t('billing.commissionTitle')}</h2>
          {currentTerm ? (
            <p className="text-xs font-bold text-slate-400">
              {t('adminCompanies.currentValue')}: {currentTerm.rate} {currentTerm.basis === 'PERCENTAGE' ? '%' : t('billing.basisPerUnit')}
            </p>
          ) : (
            <p className="text-xs font-bold text-slate-400">{t('billing.notConfigured')}</p>
          )}
          <CommissionTypeSelector value={commissionBasis} onChange={setCommissionBasis} />
          <input
            type="number"
            min={0}
            value={commissionRate}
            onChange={(e) => setCommissionRate(e.target.value)}
            placeholder={t('adminCompanies.newRate')}
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
          />
          <button
            onClick={() => void handleSaveCommission()}
            disabled={setTerm.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-3 text-sm font-bold"
          >
            {setTerm.isPending ? t('common.loading') : t('adminCompanies.saveNewRate')}
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <h2 className="text-lg font-black text-[#162155]">{t('billing.cashbackTitle')}</h2>
          {currentProgramme ? (
            <p className="text-xs font-bold text-slate-400">
              {t('adminCompanies.currentValue')}: {currentProgramme.rate} {currentProgramme.basis === 'PERCENTAGE' ? '%' : t('billing.basisPerUnit')} —{' '}
              {currentProgramme.isActive ? t('billing.active') : t('billing.inactive')}
            </p>
          ) : (
            <p className="text-xs font-bold text-slate-400">{t('billing.notConfigured')}</p>
          )}
          <CommissionTypeSelector value={cashbackBasis} onChange={setCashbackBasis} />
          <input
            type="number"
            min={0}
            value={cashbackRate}
            onChange={(e) => setCashbackRate(e.target.value)}
            placeholder={t('adminCompanies.newRate')}
            className="border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold"
          />
          <label className="flex items-center gap-2 text-sm font-bold text-slate-600">
            <input type="checkbox" checked={cashbackActive} onChange={(e) => setCashbackActive(e.target.checked)} />
            {t('adminCompanies.cashbackActiveToggle')}
          </label>
          <button
            onClick={() => void handleSaveCashback()}
            disabled={setProgramme.isPending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-3 text-sm font-bold"
          >
            {setProgramme.isPending ? t('common.loading') : t('adminCompanies.saveNewRate')}
          </button>
        </div>
      </div>
    </div>
  );
}
