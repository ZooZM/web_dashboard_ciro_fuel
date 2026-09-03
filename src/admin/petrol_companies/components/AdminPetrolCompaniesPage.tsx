import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AdminPetrolCompaniesStats } from './AdminPetrolCompaniesStats';
import { AdminPetrolCompanyListItem } from './AdminPetrolCompanyListItem';
import { useFuelCompaniesList } from '@/admin/petrol_companies/hooks/useFuelCompanies';

// Feature 013 T236/FR-087: wired to `GET /companies?type=FUEL`; delete sample rows. The
// previous mock's "owners"/"stations" tabs (a global, cross-company directory) named no
// FR and had no backing endpoint — FR-089 is a PER-COMPANY drill-down (T238), not a
// platform-wide owners/stations list, so those two tabs are dropped rather than faked.
export function AdminPetrolCompaniesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data: companies, isLoading, isError, refetch } = useFuelCompaniesList();
  const [search, setSearch] = useState('');

  const filtered = (companies ?? []).filter((c) => c.name.includes(search) || c._id.includes(search));

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-[calc(100vh-6rem)]" dir="rtl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col text-right">
          <h1 className="text-2xl font-black text-slate-900 mb-1">{t('adminCompanies.title')}</h1>
          <p className="text-sm font-semibold text-slate-500">{t('adminCompanies.subtitle')}</p>
        </div>
        <button
          onClick={() => navigate('/admin/petrol-companies/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <img src="/petrolCompany/transporters/plus.svg" alt="Add" className="w-4 h-4" />
          {t('adminCompanies.addCompany')}
        </button>
      </div>

      <AdminPetrolCompaniesStats companies={companies ?? []} />

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col p-4 mb-8">
        <div className="flex items-center justify-end mb-4">
          <div className="relative w-full md:w-[300px] h-[40px]">
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <img src="/petrolCompany/station/search.svg" alt="Search" className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('adminCompanies.searchPlaceholder')}
              className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">{t('adminCompanies.loadError')}</p>
            <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
              {t('common.retry')}
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('adminCompanies.empty')}</p>
        ) : (
          <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
            {filtered.map((company, index) => (
              <AdminPetrolCompanyListItem key={company._id} company={company} isLast={index === filtered.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
