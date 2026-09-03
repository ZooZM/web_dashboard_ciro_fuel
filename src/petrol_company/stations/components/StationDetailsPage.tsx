import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { useAllStations, useUpdateStation, useRemoveStation } from '@/petrol_company/stations/hooks/useStations';
import { useOwnerDetail } from '@/petrol_company/stations/hooks/useOwners';
import {
  RegionCode,
  ALL_REGION_CODES,
  REGION_GOVERNORATES,
  regionLabel,
  governorateLabel,
} from '@/constants/regions';
import type { GovernorateCode } from '@/constants/regions';

// Feature 013 T075/FR-036: no dedicated `GET /stations/:id` exists — this admin surface
// already fetches `GET /stations/all` for the list screen, so the detail page reads from
// that same cached list rather than adding a redundant single-station route. Dropped:
// an active/inactive toggle (no such field on `Station`; removal is `DELETE /stations/:id`,
// a soft delete) and every fabricated stat (orders/month, supplied volume, spending,
// average delivery time, a recent-orders log) — none of these have a data source.
export function StationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { data: allStations, isLoading, isError } = useAllStations();
  const station = useMemo(() => allStations?.find((s) => s._id === id), [allStations, id]);
  const { data: owner } = useOwnerDetail(station?.clientId);
  const updateStation = useUpdateStation(station?.clientId);
  const removeStation = useRemoveStation(station?.clientId);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [regionCode, setRegionCode] = useState<RegionCode>(RegionCode.RIYADH);
  const [governorateCode, setGovernorateCode] = useState<GovernorateCode>(REGION_GOVERNORATES[RegionCode.RIYADH][0]!);
  const [addressText, setAddressText] = useState('');

  function openEditing() {
    if (!station) return;
    setName(station.name ?? '');
    setRegionCode(station.regionCode);
    setGovernorateCode(station.governorateCode);
    setAddressText(station.addressText);
    setIsEditing(true);
  }

  async function handleSave() {
    if (!station) return;
    try {
      await updateStation.mutateAsync({
        id: station._id,
        input: { name: name.trim() || undefined, regionCode, governorateCode, addressText: addressText.trim() || undefined },
      });
      setIsEditing(false);
    } catch {
      toast.error(t('errors.generic'));
    }
  }

  async function handleRemove() {
    if (!station) return;
    if (!window.confirm(t('stations.removeConfirm'))) return;
    try {
      await removeStation.mutateAsync(station._id);
      toast.success(t('stations.removeSuccess'));
      navigate('/petrolCompany/stations');
    } catch {
      toast.error(t('errors.generic'));
    }
  }

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }
  if (isError || !station) {
    return <div className="p-6 text-center text-sm text-red-500">{t('stations.loadError')}</div>;
  }

  return (
    <div className="flex flex-col p-6 max-w-[1600px] mx-auto w-full gap-6">

      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" className="w-3 h-3 " alt="Back" />
        </button>
        <span className="text-sm font-bold text-slate-400">{t('stations.title')} / <span className="text-slate-900">{station.name || governorateLabel(station.governorateCode, i18n.language)}</span></span>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-600 shadow-sm flex items-center justify-center">
            <img src="/petrolCompany/station/station.svg" alt="Station" className="w-6 h-6 filter brightness-0 invert" />
          </div>
          <div className="flex flex-col text-right">
            <div className="flex items-center justify-start gap-3 mb-1">
              <span className="text-lg font-black text-slate-900">{station.name || governorateLabel(station.governorateCode, i18n.language)}</span>
              {station.isDefault && <span className="bg-blue-100/50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold">{t('stations.isDefault')}</span>}
              {station.isFavourite && <span className="bg-amber-100/50 text-amber-600 px-3 py-1 rounded-lg text-xs font-bold">{t('stations.isFavourite')}</span>}
            </div>
            <span className="text-xs font-bold text-slate-400">{station._id}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openEditing}
            className="flex items-center justify-center px-4 h-10 rounded-xl font-bold text-sm gap-2 border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors"
          >
            {t('common.edit')}
          </button>
          <button
            onClick={handleRemove}
            disabled={removeStation.isPending}
            className="flex items-center justify-center px-4 h-10 rounded-xl font-bold text-sm gap-2 border border-red-100 text-red-500 bg-white hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            {t('common.remove')}
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4" dir="rtl">
          <span className="font-black text-slate-900 text-lg">{t('common.edit')}</span>
          <div className="flex flex-col gap-2 text-right">
            <span className="text-xs font-bold text-slate-500">{t('stations.name')} ({t('common.optional')})</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right" dir="rtl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs font-bold text-slate-500">{t('stations.region')}</span>
              <select
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
                dir="rtl"
                value={regionCode}
                onChange={(e) => {
                  const code = e.target.value as RegionCode;
                  setRegionCode(code);
                  setGovernorateCode(REGION_GOVERNORATES[code][0]!);
                }}
              >
                {ALL_REGION_CODES.map((code) => (
                  <option key={code} value={code}>{regionLabel(code, i18n.language)}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs font-bold text-slate-500">{t('stations.governorate')}</span>
              <select
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
                dir="rtl"
                value={governorateCode}
                onChange={(e) => setGovernorateCode(e.target.value as GovernorateCode)}
              >
                {REGION_GOVERNORATES[regionCode].map((code) => (
                  <option key={code} value={code}>{governorateLabel(code, i18n.language)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <span className="text-xs font-bold text-slate-500">{t('stations.addressText')} ({t('common.optional')})</span>
            <input type="text" value={addressText} onChange={(e) => setAddressText(e.target.value)} className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right" dir="rtl" />
          </div>
          <div className="flex items-center justify-end gap-3">
            <button onClick={() => setIsEditing(false)} className="px-6 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-sm hover:bg-red-100">{t('common.cancel')}</button>
            <button onClick={handleSave} disabled={updateStation.isPending} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 disabled:opacity-60">{t('common.save')}</button>
          </div>
        </div>
      )}

      {/* Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right" dir="rtl">
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-slate-400 mb-2">{t('stations.region')}</span>
              <span className="text-base font-black text-slate-900">{regionLabel(station.regionCode, i18n.language)}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-slate-400 mb-2">{t('stations.governorate')}</span>
              <span className="text-base font-black text-slate-900">{governorateLabel(station.governorateCode, i18n.language)}</span>
            </div>
            <div className="flex flex-col items-start md:col-span-2">
              <span className="text-sm font-bold text-slate-400 mb-2">{t('stations.addressText')}</span>
              <span className="text-base font-black text-slate-900">{station.addressText || '—'}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-slate-400 mb-2">{t('stations.latitude')}</span>
              <span className="text-base font-black text-slate-900" dir="ltr">{station.location.coordinates[1]}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-bold text-slate-400 mb-2">{t('stations.longitude')}</span>
              <span className="text-base font-black text-slate-900" dir="ltr">{station.location.coordinates[0]}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center" dir="rtl">
          <div className="w-full flex items-center justify-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
              <img src="/petrolCompany/owner/user.svg" alt="" className="w-6 h-6" />
            </div>
            <span className="font-black text-slate-900 text-lg">{t('owners.title')}</span>
          </div>
          {owner ? (
            <button
              onClick={() => navigate(`/petrolCompany/stations/owners/${owner._id}`)}
              className={cn("w-full py-3 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors font-bold text-sm flex items-center justify-center gap-2")}
            >
              {owner.fullName}
            </button>
          ) : (
            <span className="text-sm font-bold text-slate-400">—</span>
          )}
        </div>
      </div>

    </div>
  );
}
