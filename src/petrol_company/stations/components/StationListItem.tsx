import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { regionLabel, governorateLabel } from '@/constants/regions';
import type { RegionCode, GovernorateCode } from '@/constants/regions';

// Phase 6 (US3): `Station` has no `isActive`/`volumePerMonth`/`ordersPerMonth` field —
// removal is a soft delete (T075), and no volume/order aggregation exists per station.
// `isDefault`/`isFavourite` are the real, owner-set flags this list can honestly show.
export interface Station {
  id: string;
  name: string;
  regionCode: RegionCode;
  governorateCode: GovernorateCode;
  addressText: string;
  isDefault: boolean;
  isFavourite: boolean;
}

interface StationListItemProps {
  station: Station;
  isLast?: boolean;
}

export function StationListItem({ station, isLast }: StationListItemProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  return (
    <div className={cn(
      "flex flex-col md:flex-row items-center justify-between p-4 gap-4 transition-colors hover:bg-slate-50",
      !isLast && "border-b border-slate-100"
    )}>

      {/* Right section: Avatar, Name, ID */}
      <div className="flex items-center gap-3 w-full md:w-[250px] shrink-0">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
          <img src="/petrolCompany/station/station.svg" alt="" className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-black text-slate-900 leading-tight mb-0.5">{station.name || governorateLabel(station.governorateCode, i18n.language)}</span>
          <span className="text-[10px] font-bold text-slate-400">{station.addressText || regionLabel(station.regionCode, i18n.language)}</span>
        </div>
      </div>

      {/* Middle section: badges */}
      <div className="flex items-center bg-gray-100 justify-center gap-3 rounded-2xl px-6 py-2.5 w-full flex-1 max-w-xs mx-auto">
        <span className="text-xs font-bold text-slate-500">{regionLabel(station.regionCode, i18n.language)}</span>
        {station.isDefault && (
          <div className="px-3 py-1 rounded-lg text-[10px] font-bold bg-blue-100/50 text-blue-600">
            {t('stations.isDefault')}
          </div>
        )}
        {station.isFavourite && (
          <div className="px-3 py-1 rounded-lg text-[10px] font-bold bg-amber-100/50 text-amber-600">
            {t('stations.isFavourite')}
          </div>
        )}
      </div>

      {/* Left section: Action Button */}
      <div className="w-full md:w-auto flex justify-end shrink-0">
        <button
          onClick={() => navigate(`/petrolCompany/stations/${station.id}`)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors w-full md:w-auto shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" alt="" className="w-4 h-4" />
          <span className="text-xs font-bold">{t('owners.viewDetail')}</span>
        </button>
      </div>

    </div>
  );
}
