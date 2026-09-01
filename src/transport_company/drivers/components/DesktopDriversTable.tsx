import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import type { Driver } from '@/transport_company/drivers/types';

/**
 * Feature 009 T089/SC-005: truck/capacity/tripsMonth/lastShipment columns removed — none
 * has a real data source (a driver no longer carries a vehicle, and the platform exposes no
 * per-driver trip history to this dashboard). Rating shows "not yet rated" when
 * `ratingAverage` is absent, never zero (FR-077).
 */
export function DesktopDriversTable({ drivers }: { drivers: Driver[] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="hidden lg:block overflow-hidden w-[100%]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full">
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 pr-4 pl-2">{t('drivers.title')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">{t('companies.adminPhone')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">{t('drivers.rating')}</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">{t('orders.status')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver) => (
            <TableRow
              key={driver.id}
              onClick={() => {
                const basePath = window.location.pathname.startsWith('/admin') ? '/admin' : '/transport';
                navigate(`${basePath}/drivers/${driver.id}`);
              }}
              className="hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer transition-colors"
            >
              <TableCell className="align-middle py-3 pr-4 pl-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[#162155] font-black text-[13px] whitespace-nowrap">{driver.fullName}</span>
                  <span className="text-slate-400 font-bold text-[10px]">{driver.email}</span>
                </div>
              </TableCell>
              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-500 font-bold text-[12px]" dir="ltr">{driver.phone}</span>
              </TableCell>
              <TableCell className="align-middle text-center py-3 px-2">
                {driver.ratingAverage != null ? (
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[#162155] font-black text-[12px]">{driver.ratingAverage.toFixed(1)}</span>
                    <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                  </div>
                ) : (
                  <span className="text-slate-400 font-bold text-[11px]">{t('drivers.notYetRated')}</span>
                )}
              </TableCell>
              <TableCell className="align-middle text-center py-3 px-2">
                <div
                  className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full ${
                    driver.isActive ? 'bg-[#DCFCE7]' : 'bg-slate-100'
                  }`}
                >
                  <span className={`text-[10px] font-bold whitespace-nowrap ${driver.isActive ? 'text-[#16A34A]' : 'text-slate-500'}`}>
                    {driver.isActive ? t('drivers.active') : t('drivers.inactive')}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
