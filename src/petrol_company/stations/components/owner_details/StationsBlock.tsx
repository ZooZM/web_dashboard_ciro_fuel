import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { apiErrorMessage } from '@/lib/api/api-error';
import { cn } from '@/lib/utils';
import { ChevronDown, MapPin, Plus, X } from 'lucide-react';
import { LocationField } from '@/components/ui/LocationField';
import { isValidLatLng } from '@/lib/maps/maps-url';
import {
  useOwnerStations,
  useCreateStation,
  useRemoveStation,
} from '@/petrol_company/stations/hooks/useStations';
import {
  RegionCode,
  ALL_REGION_CODES,
  REGION_GOVERNORATES,
  regionLabel,
  governorateLabel,
} from '@/constants/regions';
import type { GovernorateCode } from '@/constants/regions';

// Feature 013 T075/FR-036/FR-036c: wired to `GET`/`POST /users/:id/stations` and
// `DELETE /stations/:id`. `Station` has no active/inactive status — the mock's toggle is
// replaced with a real removal (soft delete server-side; the station stays readable
// through any order that referenced it, just no longer listed here).
export function StationsBlock({ ownerId }: { ownerId: string }) {
  const { t, i18n } = useTranslation();
  const { data: stations, isLoading, isError } = useOwnerStations(ownerId);
  const createStation = useCreateStation(ownerId);
  const removeStation = useRemoveStation(ownerId);

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [regionCode, setRegionCode] = useState<RegionCode>(RegionCode.RIYADH);
  const [governorateCode, setGovernorateCode] = useState<GovernorateCode>(
    REGION_GOVERNORATES[RegionCode.RIYADH][0]!,
  );
  const [addressText, setAddressText] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  function onRegionChange(code: RegionCode) {
    setRegionCode(code);
    setGovernorateCode(REGION_GOVERNORATES[code][0]!);
  }

  async function handleAddStation() {
    setFormError(null);
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      setFormError(t('errors.generic'));
      return;
    }
    try {
      await createStation.mutateAsync({
        name: name.trim() || undefined,
        regionCode,
        governorateCode,
        latitude: lat,
        longitude: lng,
        addressText: addressText.trim() || undefined,
      });
      toast.success(t('stations.createSuccess'));
      setIsAdding(false);
      setName('');
      setAddressText('');
      setLatitude('');
      setLongitude('');
    } catch (err) {
      toast.error(apiErrorMessage(err, t('errors.generic')));
    }
  }

  async function handleRemove(id: string) {
    if (!window.confirm(t('stations.removeConfirm'))) return;
    try {
      await removeStation.mutateAsync(id);
      toast.success(t('stations.removeSuccess'));
    } catch (err) {
      toast.error(apiErrorMessage(err, t('errors.generic')));
    }
  }

  const items = stations ?? [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        {isAdding ? (
          <div className="flex items-center justify-end w-full">
            <div className="flex items-center gap-3">
              <div className="bg-slate-50 text-slate-500 px-3 py-1 rounded-xl text-xs font-bold border border-slate-200">
                {items.length} {t('owners.stationsCount')}
              </div>
              <span className="font-black text-slate-900 text-lg">{t('stations.title')}</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/owner/blueStation.svg" alt="" className="w-4 h-4" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/owner/blueStation.svg" alt="" className="w-5 h-5" />
              </div>
              <span className="font-black text-slate-900 text-lg">{t('stations.title')}</span>
              <div className="bg-slate-50 text-slate-500 px-3 py-1 rounded-xl text-xs font-bold border border-slate-200">
                {items.length} {t('owners.stationsCount')}
              </div>
            </div>
            <button onClick={() => setIsAdding(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
              <span className="text-lg leading-none mb-0.5">+</span>
              {t('stations.add')}
            </button>
          </>
        )}
      </div>

      {isAdding ? (
        <div className="border border-dashed border-slate-300 rounded-2xl p-6 flex flex-col gap-4 bg-[#F8FAFC]">
          <div className="flex flex-col gap-2 text-right">
            <span className="text-xs font-bold text-slate-500">{t('stations.name')} ({t('common.optional')})</span>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 pl-10 pr-3 outline-none text-sm font-bold text-right"
                value={name}
                onChange={(e) => setName(e.target.value)}
                dir="rtl"
              />
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs font-bold text-slate-500">{t('stations.region')}</span>
              <div className="relative">
                <select
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 pl-10 pr-3 outline-none text-sm font-bold appearance-none text-right"
                  dir="rtl"
                  value={regionCode}
                  onChange={(e) => onRegionChange(e.target.value as RegionCode)}
                >
                  {ALL_REGION_CODES.map((code) => (
                    <option key={code} value={code}>{regionLabel(code, i18n.language)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs font-bold text-slate-500">{t('stations.governorate')}</span>
              <div className="relative">
                <select
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 pl-10 pr-3 outline-none text-sm font-bold appearance-none text-right"
                  dir="rtl"
                  value={governorateCode}
                  onChange={(e) => setGovernorateCode(e.target.value as GovernorateCode)}
                >
                  {REGION_GOVERNORATES[regionCode].map((code) => (
                    <option key={code} value={code}>{governorateLabel(code, i18n.language)}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Same shared picker as the add-owner form and the fuel-exchange offer. */}
          <div className="text-right">
            <LocationField
              value={
                latitude.trim() !== '' &&
                longitude.trim() !== '' &&
                isValidLatLng({ lat: Number(latitude), lng: Number(longitude) })
                  ? { lat: Number(latitude), lng: Number(longitude) }
                  : null
              }
              onChange={(next) => {
                setLatitude(next ? String(next.lat.toFixed(6)) : '');
                setLongitude(next ? String(next.lng.toFixed(6)) : '');
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs font-bold text-slate-500">{t('stations.latitude')}</span>
              <input
                type="number"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-2 text-right">
              <span className="text-xs font-bold text-slate-500">{t('stations.longitude')}</span>
              <input
                type="number"
                className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 text-right">
            <span className="text-xs font-bold text-slate-500">{t('stations.addressText')} ({t('common.optional')})</span>
            <input
              type="text"
              className="w-full bg-white border border-slate-200 rounded-xl p-3 outline-none text-sm font-bold text-right"
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              dir="rtl"
            />
          </div>

          {formError && <p className="text-sm font-bold text-red-500">{formError}</p>}

          <div className="flex items-center justify-start gap-3 mt-2" dir="ltr">
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-red-50 text-red-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100">
              {t('common.cancel')}
              <X className="w-4 h-4" />
            </button>
            <button onClick={handleAddStation} disabled={createStation.isPending} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-60">
              {t('stations.add')}
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : isLoading ? (
        <p className="text-center text-sm text-slate-400 py-8">{t('common.loading')}</p>
      ) : isError ? (
        <p className="text-center text-sm text-red-500 py-8">{t('stations.loadError')}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((station) => (
            <div key={station._id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleRemove(station._id)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors shrink-0"
                  title={t('common.remove')}
                >
                  <X className="w-4 h-4" />
                </button>
                {station.isDefault && (
                  <div className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-blue-100">
                    {t('stations.isDefault')}
                  </div>
                )}
                {station.isFavourite && (
                  <div className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-amber-100">
                    {t('stations.isFavourite')}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-right">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 mb-1">{station.name || governorateLabel(station.governorateCode, i18n.language)}</span>
                  <span className="text-[10px] font-bold text-slate-400">{station.addressText || regionLabel(station.regionCode, i18n.language)}</span>
                </div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm bg-blue-600")}>
                  <img src="/petrolCompany/owner/station.svg" alt="" className="w-5 h-5 filter brightness-0 invert" />
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-sm font-bold bg-slate-50 rounded-xl border border-dashed border-slate-200">
              {t('stations.empty')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
