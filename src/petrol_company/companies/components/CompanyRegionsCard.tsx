import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAssignTransporterRegions } from '@/petrol_company/companies/hooks/useTransporters';
import type { Transporter } from '@/petrol_company/companies/api/transporters.api';
import { ALL_REGION_CODES, regionLabel } from '@/constants/regions';
import type { RegionCode } from '@/constants/regions';

// Feature 013 T086/T087/FR-035/FR-036: wired to `PUT /companies/:id/regions`. Dropped: a
// per-region price and minimum-charge figure — `Company.servedRegions` is a plain
// `RegionCode[]`, carrying no per-region pricing at all (pricing is per fuel company via
// `pricingConfig`, not per region-per-transporter).
export function CompanyRegionsCard({ company }: { company: Transporter }) {
  const { t, i18n } = useTranslation();
  const assignRegions = useAssignTransporterRegions(company._id);
  const [isAdding, setIsAdding] = useState(false);
  const [selected, setSelected] = useState<RegionCode | ''>('');

  const available = ALL_REGION_CODES.filter((code) => !company.servedRegions.includes(code));

  async function handleAdd() {
    if (!selected) return;
    try {
      await assignRegions.mutateAsync([...company.servedRegions, selected]);
      setSelected('');
      setIsAdding(false);
    } catch {
      toast.error(t('errors.generic'));
    }
  }

  async function handleRemove(code: RegionCode) {
    try {
      await assignRegions.mutateAsync(company.servedRegions.filter((r) => r !== code));
    } catch {
      toast.error(t('errors.generic'));
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/transporters/details/detail.svg" alt="" className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-900">{t('companies.servedRegions')}</h2>
            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">
              {company.servedRegions.length}
            </span>
          </div>
        </div>

        {!isAdding && available.length > 0 && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2 justify-center"
          >
            <img src="/petrolCompany/transporters/details/plus.svg" alt="Add" className="w-4 h-4" />
            {t('companies.addRegion')}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="flex items-center gap-3 mb-4">
          <select
            className="flex-1 bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
            dir="rtl"
            value={selected}
            onChange={(e) => setSelected(e.target.value as RegionCode)}
          >
            <option value="">—</option>
            {available.map((code) => (
              <option key={code} value={code}>{regionLabel(code, i18n.language)}</option>
            ))}
          </select>
          <button onClick={() => setIsAdding(false)} className="px-4 py-3 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100">
            {t('common.cancel')}
          </button>
          <button onClick={handleAdd} disabled={!selected || assignRegions.isPending} className="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-60">
            {t('common.confirm')}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {company.servedRegions.map((code) => (
          <div key={code} className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-4 flex-1">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm bg-blue-500")}>
                <img src="/petrolCompany/transporters/details/bluePin.svg" alt="" className="w-5 h-5 filter brightness-0 invert" />
              </div>
              <span className="text-sm font-black text-slate-900">{regionLabel(code, i18n.language)}</span>
            </div>
            <button
              onClick={() => handleRemove(code)}
              disabled={assignRegions.isPending}
              className="w-9 h-9 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 disabled:opacity-60"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
        {company.servedRegions.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm font-bold bg-slate-50 rounded-xl border border-dashed border-slate-200">
            {t('companies.noRegions')}
          </div>
        )}
      </div>
    </div>
  );
}
