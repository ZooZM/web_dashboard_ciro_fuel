import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { useCoveredRegions, useSetCoveredRegions } from '@/petrol_company/companies/hooks/useTransporters';
import { ALL_REGION_CODES, regionLabel } from '@/constants/regions';
import type { RegionCode } from '@/constants/regions';

// spec 013 T086a/T086b/T087/FR-035/FR-036: the regions THIS fuel company covers itself
// (`Company.coveredRegions`) — a company-level fact distinct from which regions any one
// of its transporters happens to serve (`CompanyRegionsCard`, on a transporter's own
// detail page). Wired to `GET`/`PUT /companies/:id/covered-regions`.
export function CompanyCoveredRegionsCard() {
  const { t, i18n } = useTranslation();
  const { data: regions, isLoading, isError, refetch } = useCoveredRegions();
  const setCoveredRegions = useSetCoveredRegions();

  const [isAdding, setIsAdding] = useState(false);
  const [selected, setSelected] = useState<RegionCode | ''>('');

  const current = regions ?? [];
  const available = ALL_REGION_CODES.filter((code) => !current.includes(code));

  async function handleAdd() {
    if (!selected) return;
    try {
      await setCoveredRegions.mutateAsync([...current, selected]);
      setSelected('');
      setIsAdding(false);
    } catch {
      toast.error(t('errors.generic'));
    }
  }

  async function handleRemove(code: RegionCode) {
    try {
      await setCoveredRegions.mutateAsync(current.filter((r) => r !== code));
    } catch {
      toast.error(t('errors.generic'));
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/transporters/pin.svg" alt="" className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-slate-900">{t('companies.regionsCount')}</h2>
            <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full">
              {current.length}
            </span>
          </div>
        </div>

        {!isAdding && !isLoading && !isError && available.length > 0 && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm flex items-center gap-2 justify-center"
          >
            <img src="/petrolCompany/transporters/details/plus.svg" alt="Add" className="w-4 h-4" />
            {t('companies.addRegion')}
          </button>
        )}
      </div>

      {isLoading ? (
        <p className="text-center text-sm text-slate-400 py-6">{t('common.loading')}</p>
      ) : isError ? (
        <div className="flex flex-col items-center gap-3 py-6">
          <p className="text-sm text-red-500">{t('companies.loadError')}</p>
          <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
            {t('common.retry')}
          </button>
        </div>
      ) : (
        <>
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
              <button onClick={handleAdd} disabled={!selected || setCoveredRegions.isPending} className="px-4 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-60">
                {t('common.confirm')}
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {current.map((code) => (
              <div key={code} className="flex items-center gap-2 bg-[#F8FAFC] border border-slate-200 rounded-xl px-4 py-2">
                <span className="text-sm font-bold text-slate-900">{regionLabel(code, i18n.language)}</span>
                <button
                  onClick={() => handleRemove(code)}
                  disabled={setCoveredRegions.isPending}
                  className="text-red-500 hover:text-red-600 disabled:opacity-60"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {current.length === 0 && (
              <p className="text-sm font-bold text-slate-400">{t('companies.noRegions')}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
