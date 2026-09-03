import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { StationListStats } from './StationListStats';
import { StationOwnerListItem, type StationOwner } from './StationOwnerListItem';
import { StationListItem, type Station } from './StationListItem';
import { useOwners } from '@/petrol_company/stations/hooks/useOwners';
import { useAllStations } from '@/petrol_company/stations/hooks/useStations';
import { useCreditLimitRequests } from '@/petrol_company/stations/hooks/useCreditLimitRequests';

// Feature 013 T072/T073/FR-025/FR-047/FR-048: wired to `GET /users?role=CLIENT`,
// `GET /stations/all` and the pending credit-limit-request queue — every `MOCK_*` array
// and every fabricated monthly figure this screen shipped with is gone.
export function StationsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'owners' | 'stations'>('owners');
  const [search, setSearch] = useState('');

  const ownersQuery = useOwners();
  const stationsQuery = useAllStations();
  const pendingRequestsQuery = useCreditLimitRequests('PENDING');

  const owners = ownersQuery.data ?? [];
  const allStations = stationsQuery.data ?? [];

  const stationsByOwner = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of allStations) {
      map.set(s.clientId, (map.get(s.clientId) ?? 0) + 1);
    }
    return map;
  }, [allStations]);

  const stationOwners: StationOwner[] = useMemo(
    () =>
      owners
        .filter((o) => o.fullName.toLowerCase().includes(search.toLowerCase()) || o._id.includes(search))
        .map((o) => ({
          id: o._id,
          name: o.fullName,
          isActive: o.isActive,
          stationsCount: stationsByOwner.get(o._id) ?? 0,
        })),
    [owners, search, stationsByOwner],
  );

  const stationItems: Station[] = useMemo(
    () =>
      allStations
        .filter(
          (s) =>
            (s.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
            s.addressText.toLowerCase().includes(search.toLowerCase()) ||
            s._id.includes(search),
        )
        .map((s) => ({
          id: s._id,
          name: s.name ?? '',
          regionCode: s.regionCode,
          governorateCode: s.governorateCode,
          addressText: s.addressText,
          isDefault: s.isDefault,
          isFavourite: s.isFavourite,
        })),
    [allStations, search],
  );

  const isLoading = activeTab === 'owners' ? ownersQuery.isLoading : stationsQuery.isLoading;
  const isError = activeTab === 'owners' ? ownersQuery.isError : stationsQuery.isError;
  const isEmpty = activeTab === 'owners' ? stationOwners.length === 0 : stationItems.length === 0;

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col text-right">
          <h1 className="text-2xl font-black text-slate-900 mb-1">{t('owners.title')}</h1>
          <p className="text-sm font-semibold text-slate-500">{t('owners.subtitle')}</p>
        </div>
        <button
          onClick={() => navigate('/petrolCompany/stations/owners/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <img src="/petrolCompany/transporters/plus.svg" alt="Add" className="w-4 h-4" />
          {t('owners.add')}
        </button>
      </div>

      {/* Stats Grid */}
      <StationListStats
        ownersCount={owners.length}
        activeOwnersCount={owners.filter((o) => o.isActive).length}
        stationsCount={allStations.length}
        pendingCreditRequestsCount={pendingRequestsQuery.data?.length ?? 0}
      />

      {/* Main Content Area */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col p-4 mb-8">

        {/* Controls: Search and Tabs */}
        <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-4 mb-4 transition-all">

          {/* Search */}
          <div className="relative w-full md:w-[300px] h-[40px]">
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <img src="/petrolCompany/station/search.svg" alt="Search" className="w-4 h-4 " />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={activeTab === 'owners' ? t('owners.search') : t('stations.title')}
              className="w-full h-full bg-slate-50 border border-slate-200 rounded-xl pr-10 pl-4 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center  rounded-xl border border-slate-200 w-full md:w-[200px] h-[40px]">
            <button
              onClick={() => setActiveTab('stations')}
              className={cn(
                "flex-1 w-full h-full rounded-lg text-xs font-bold transition-all",
                activeTab === 'stations' ? "bg-blue-100 text-blue-600 border-b-2 border-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t('stations.title')}
            </button>
            <button
              onClick={() => setActiveTab('owners')}
              className={cn(
                "flex-1 w-full   h-full rounded-lg  text-xs font-bold transition-all",
                activeTab === 'owners' ? "bg-blue-100 text-blue-600 border-b-2 border-blue-600  shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t('owners.title')}
            </button>
          </div>

        </div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-12">{t('common.loading')}</p>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <p className="text-sm text-red-500">
              {activeTab === 'owners' ? t('owners.loadError') : t('stations.loadError')}
            </p>
            <button
              onClick={() => (activeTab === 'owners' ? ownersQuery.refetch() : stationsQuery.refetch())}
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : isEmpty ? (
          <p className="text-center text-sm text-slate-400 py-12">
            {activeTab === 'owners' ? t('owners.empty') : t('stations.empty')}
          </p>
        ) : activeTab === 'owners' ? (
          <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
            {stationOwners.map((owner, index) => (
              <StationOwnerListItem
                key={owner.id}
                owner={owner}
                isLast={index === stationOwners.length - 1}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col border border-slate-100 rounded-xl overflow-hidden">
            {stationItems.map((station, index) => (
              <StationListItem
                key={station.id}
                station={station}
                isLast={index === stationItems.length - 1}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
