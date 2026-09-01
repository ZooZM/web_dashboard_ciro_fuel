import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDriver } from '@/transport_company/drivers/hooks/useDrivers';

/**
 * Feature 009 T090/SC-005: previously showed a fixed "محمد إبراهيم" plus an Iqama number,
 * city, region and notes field — none of which the platform records for a DRIVER account
 * (`User` schema has no such fields; `UpdateUserDto` whitelists only fullName/phone).
 * Replaced with the driver's real, platform-held identity fields only.
 */
export function DriverInfoCard() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: driver, isLoading } = useDriver(id ?? '');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-8 w-full">
      <div className="flex items-center justify-start w-full">
        <span className="text-[#162155] font-black text-lg">{t('drivers.title')}</span>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400">{t('common.loading')}</p>
      ) : !driver ? (
        <p className="text-sm text-slate-400">{t('errors.notFound')}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
          <div className="flex flex-col gap-2 text-right">
            <span className="text-slate-500 font-bold text-sm">{t('common.fullName')}</span>
            <span className="text-[#162155] font-black text-lg">{driver.fullName}</span>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <span className="text-slate-500 font-bold text-sm">{t('auth.login.email')}</span>
            <span className="text-[#162155] font-black text-sm" dir="ltr">{driver.email}</span>
          </div>
          <div className="flex flex-col gap-2 text-right">
            <span className="text-slate-500 font-bold text-sm">{t('companies.adminPhone')}</span>
            <span className="text-[#162155] font-black text-lg" dir="ltr">{driver.phone}</span>
          </div>
        </div>
      )}
    </div>
  );
}
