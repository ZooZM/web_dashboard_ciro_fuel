import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { apiErrorMessage } from '@/lib/api/api-error';
import { Plus, Minus, X, Check } from 'lucide-react';
import { useCreditStanding, useSetCreditLimit } from '@/petrol_company/stations/hooks/useOwners';

// Feature 013 T077/FR-032: wired to `GET`/`PUT /users/:id/credit-limit`. Dropped: an
// "active/inactive credit" toggle, an expiry date, and an activation date — none of
// these exist on the platform (`CreditLimitRequest`/`User.creditLimit` are just a number
// and a resolution state, no expiry or standalone activation flag), so the mock modelled
// a capability this feature does not build.
export function CreditLimitCard({ ownerId }: { ownerId: string }) {
  const { t } = useTranslation();
  const { data, isLoading } = useCreditStanding(ownerId);
  const setCreditLimit = useSetCreditLimit(ownerId);

  const [isEditing, setIsEditing] = useState(false);
  const [editingLimit, setEditingLimit] = useState(0);

  const formatCurrency = (val: number) =>
    val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function openEditing() {
    setEditingLimit(data?.creditLimit ?? 0);
    setIsEditing(true);
  }

  async function handleSave() {
    try {
      await setCreditLimit.mutateAsync(editingLimit);
      toast.success(t('creditLimit.updateSuccess'));
      setIsEditing(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, t('errors.generic')));
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white border-t-4 border-orange-500 rounded-2xl p-6 shadow-lg" dir="rtl">
        <p className="text-sm text-slate-400">{t('common.loading')}</p>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white border border-orange-500 rounded-2xl p-6 shadow-sm border-t-4" dir="rtl">
        <div className="flex items-center justify-between mb-6">
          <span className="font-black text-slate-900 text-lg">{t('creditLimit.editTitle')}</span>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400">{t('creditLimit.newLimit')}</span>
            <div className="flex items-center justify-between border border-slate-200 rounded-xl p-2 bg-white shadow-sm">
              <button onClick={() => setEditingLimit((v) => Math.max(0, v - 10000))} className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-slate-100 shrink-0">
                <Minus className="w-5 h-5 text-slate-500" />
              </button>
              <div className="flex flex-col items-center">
                <span className="font-black text-base text-slate-900 mt-1">{editingLimit.toLocaleString()}</span>
                <span className="text-[10px] text-slate-400 font-bold mt-1">ر.س</span>
              </div>
              <button onClick={() => setEditingLimit((v) => v + 10000)} className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center hover:bg-blue-100 shrink-0">
                <Plus className="w-5 h-5 text-blue-600" />
              </button>
            </div>
          </div>

          <p className="text-xs font-bold text-amber-600">{t('creditLimit.lowerWarning')}</p>

          <div className="flex items-center gap-3 mt-4">
            <button onClick={() => setIsEditing(false)} className="flex-1 py-3 bg-white border border-red-200 text-red-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
              <X className="w-4 h-4" />
              {t('common.cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={setCreditLimit.isPending}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              <Check className="w-4 h-4" />
              {t('common.save')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const creditLimit = data?.creditLimit ?? null;
  const available = data?.available ?? null;
  const consumed = data?.consumed ?? null;
  const usagePercentage = creditLimit && creditLimit > 0 ? ((consumed ?? 0) / creditLimit) * 100 : 0;

  return (
    <div className="bg-white border-t-4 border-orange-500 rounded-2xl p-6 shadow-lg" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <span className="font-black text-slate-900 text-lg">{t('creditLimit.title')}</span>
        <button
          onClick={openEditing}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors font-bold text-xs"
        >
          <img src='/transportCompany/orderPage/orderDetails/edit.svg' className="w-4 h-4" />
          {t('common.edit')}
        </button>
      </div>

      {creditLimit == null ? (
        <p className="text-sm font-bold text-slate-400 text-center py-6">{t('creditLimit.notSet')}</p>
      ) : (
        <>
          <div className="flex items-end justify-between mb-2 text-right">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-0.5">{t('creditLimit.available')}</span>
              <span className="font-black text-lg text-slate-900">{formatCurrency(available ?? 0)} <span className="text-[10px] text-slate-400 font-bold">ر.س</span></span>
            </div>
            <span className="text-xs font-bold text-slate-400 mb-1">{t('creditLimit.limit')}: {formatCurrency(creditLimit)} ر.س</span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2 flex">
            <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${Math.min(100, Math.max(0, usagePercentage))}%` }}></div>
            <div className="h-full bg-slate-200 transition-all duration-300" style={{ width: `${100 - Math.min(100, Math.max(0, usagePercentage))}%` }}></div>
          </div>

          <div className="flex justify-start mb-2">
            <span className="text-[10px] font-bold text-slate-400">{t('creditLimit.consumed')}: {formatCurrency(consumed ?? 0)} ر.س ({usagePercentage.toFixed(1)}%)</span>
          </div>
        </>
      )}
    </div>
  );
}
