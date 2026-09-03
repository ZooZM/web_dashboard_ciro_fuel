import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fuelTypeLabelKey } from '@/constants/order-status';
import type { FuelType } from '@/constants/order-status';

// Feature 013 T095/FR-037/FR-040/FR-098: wired to `PUT /companies/:id/fuel-prices`.
// Dropped the "schedule for later" option entirely — there is no scheduled-price concept
// anywhere on the platform; `SetFuelPricesDto` is a direct, immediate overwrite, so this
// modal only ever writes the current price.
interface EditPriceModalProps {
  fuelType: FuelType;
  currentPrice: number;
  onClose: () => void;
  onSave: (newPrice: number) => void;
  isSaving: boolean;
  error?: string | null;
}

export function EditPriceModal({ fuelType, currentPrice, onClose, onSave, isSaving, error }: EditPriceModalProps) {
  const { t } = useTranslation();
  const [newPrice, setNewPrice] = useState(currentPrice);

  const handleDecrease = () => setNewPrice((prev) => Math.max(0.01, parseFloat((prev - 0.01).toFixed(2))));
  const handleIncrease = () => setNewPrice((prev) => parseFloat((prev + 0.01).toFixed(2)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-[360px] overflow-hidden shadow-2xl" dir="rtl">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img src="/petrolCompany/orderDetails/edit.svg" className='w-4 h-4 object-contain' alt="" />
            <span className="font-bold text-[#162155] text-base">
              {t('pricing.editTitle', { grade: t(fuelTypeLabelKey(fuelType)) })}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          <div className="bg-[#F1F5F9] rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{t('pricing.currentPrice')}</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-[#162155] text-lg">{currentPrice.toFixed(2)}</span>
              <span className="text-sm font-medium text-slate-500">{t('pricing.perLiter')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-500">{t('pricing.newPrice')}</span>
            <div className="border border-slate-200 rounded-2xl p-1.5 flex items-center justify-between">
              <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F1F5F9] text-[#1E5FFF] hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              <div className="flex flex-col items-center gap-1">
                <span className="text-xl font-black text-[#162155] leading-none">{newPrice.toFixed(2)}</span>
                <span className="text-[12px] font-medium text-slate-400 leading-none">ر.س</span>
              </div>

              <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F1F5F9] text-[#1E5FFF] hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {error && <p className="text-sm font-bold text-red-500">{error}</p>}

          <div className="bg-[#F8FAFC] border border-dashed border-slate-300 rounded-xl p-3 text-center">
            <p className="text-[12px] font-medium text-slate-400 leading-relaxed">{t('pricing.updateNote')}</p>
          </div>
        </div>

        <div className="p-5 pt-0 flex items-center gap-3">
          <button
            onClick={() => onSave(newPrice)}
            disabled={isSaving}
            className="flex-1 py-2.5 rounded-xl bg-[#1E5FFF] text-white font-bold hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
          >
            {t('pricing.update')}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[#1E5FFF] font-bold hover:bg-slate-50 transition-colors bg-white text-sm">
            {t('common.cancel')}
          </button>
        </div>
      </div>
    </div>
  );
}
