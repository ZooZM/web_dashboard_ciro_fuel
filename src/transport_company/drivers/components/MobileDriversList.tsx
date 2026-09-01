import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { Driver } from '@/transport_company/drivers/types';

export function MobileDriversList({ drivers }: { drivers: Driver[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="lg:hidden flex flex-col gap-4 w-full">
      {drivers.map((driver) => (
        <div
          key={driver.id}
          onClick={() => {
            const basePath = window.location.pathname.startsWith('/admin') ? '/admin' : '/transport';
            navigate(`${basePath}/drivers/${driver.id}`);
          }}
          className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm hover:border-blue-300 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[#162155] font-black text-sm">{driver.fullName}</span>
              <span className="text-slate-400 font-bold text-xs" dir="ltr">{driver.email}</span>
            </div>
            <div
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full shrink-0 ${
                driver.isActive ? 'bg-[#DCFCE7]' : 'bg-slate-100'
              }`}
            >
              <span className={`text-xs font-bold ${driver.isActive ? 'text-[#16A34A]' : 'text-slate-500'}`}>
                {driver.isActive ? t('drivers.active') : t('drivers.inactive')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-right">
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[10px] font-bold">{t('companies.adminPhone')}</span>
              <span className="text-slate-800 font-bold text-xs" dir="ltr">{driver.phone}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-[10px] font-bold">{t('drivers.rating')}</span>
              {driver.ratingAverage != null ? (
                <div className="flex items-center gap-1">
                  <span className="text-[#162155] font-black text-xs">{driver.ratingAverage.toFixed(1)}</span>
                  <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                </div>
              ) : (
                <span className="text-slate-400 font-bold text-[11px]">{t('drivers.notYetRated')}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
