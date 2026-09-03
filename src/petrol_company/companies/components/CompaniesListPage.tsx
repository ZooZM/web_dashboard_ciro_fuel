import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CompanyListStats } from './CompanyListStats';
import { CompanyListItem } from './CompanyListItem';
import { CompanyCoveredRegionsCard } from './CompanyCoveredRegionsCard';
import { useTransporters } from '@/petrol_company/companies/hooks/useTransporters';

// Feature 013 T084/FR-033/FR-047/FR-048: wired to `GET /companies/:id/transporters` — the
// `MOCK_COMPANIES` array and every fabricated monthly figure it carried are gone.
export function CompaniesListPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useTransporters();
  const transporters = data ?? [];

  const servedRegionsCount = useMemo(() => {
    const set = new Set<string>();
    for (const c of transporters) for (const r of c.servedRegions) set.add(r);
    return set.size;
  }, [transporters]);

  const filtered = transporters.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c._id.includes(search),
  );

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 min-h-full border border-slate-200 rounded-3xl" dir="rtl">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-900 mb-1">{t('nav.companies')}</h1>
        </div>
        <button
          onClick={() => navigate('/petrolCompany/companies/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <img src="/petrolCompany/transporters/plus.svg" alt="Add" className="w-4 h-4" />
          {t('companies.onboard')}
        </button>
      </div>

      <CompanyListStats
        totalCount={transporters.length}
        activeCount={transporters.filter((c) => c.status === 'ACTIVE').length}
        servedRegionsCount={servedRegionsCount}
      />

      <CompanyCoveredRegionsCard />

      <div className="mb-4 relative w-full md:w-[300px] h-[40px]">
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <img src="/petrolCompany/station/search.svg" alt="Search" className="w-4 h-4 " />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('companies.search')}
          className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('companies.loadError')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('companies.empty')}</p>
        ) : (
          filtered.map((company, index) => (
            <CompanyListItem
              key={company._id}
              company={company}
              isLast={index === filtered.length - 1}
            />
          ))
        )}
      </div>

    </div>
  );
}
