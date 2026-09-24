import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import { ExchangeOfferState } from '@/constants/fuel-company';
import type { OfferListItem } from '@/petrol_company/fuel_exchange/api/fuel-exchange.api';

interface AdminFuelExchangeListItemProps {
  offer: OfferListItem;
}

export function AdminFuelExchangeListItem({ offer }: AdminFuelExchangeListItemProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const created = new Date(offer.createdAt);

  const isAwarded = offer.state === ExchangeOfferState.AWARDED;

  return (
    <div
      onClick={() => navigate(`/admin/fuel-exchange/${offer._id}`)}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border border-slate-200 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all bg-white cursor-pointer"
    >
      <div className="flex items-center gap-3 w-full xl:w-auto xl:min-w-[200px]">
        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0">
          <img src="/petrolCompany/owner/station.svg" alt="" className="w-6 h-6" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-slate-900 text-sm">{offer.raisedByCompanyName}</span>
          <span className="text-xs text-slate-400 font-semibold mt-0.5 font-mono" dir="ltr">REQ-{offer._id.slice(-6).toUpperCase()}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full xl:w-auto bg-slate-50/50 rounded-xl p-3 border border-slate-100">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-black text-slate-900">{t(FUEL_TYPE_LABEL_KEY[offer.fuelType])}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">نوع الوقود</span>
        </div>
        <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-slate-200 pt-3 md:pt-0">
          <span className="text-sm font-black text-slate-900">{offer.quantityLitres.toLocaleString()}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">لتر</span>
        </div>
        <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-slate-200 pt-3 md:pt-0">
          <span className="text-sm font-black text-slate-900" dir="ltr">
            {offer.agreedUnitPrice?.toFixed(2) ?? '2.30'} {offer.currency ?? 'ر.س'}
          </span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">سعر اللتر</span>
        </div>
        <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-slate-200 pt-3 md:pt-0">
          <span className="text-sm font-black text-slate-900" dir="ltr">
            {offer.agreedTotal?.toLocaleString() ?? (offer.quantityLitres * 2.30).toLocaleString()} {offer.currency ?? 'ر.س'}
          </span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">الإجمالي</span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-6 w-full xl:w-auto xl:min-w-[180px]">
        <div className="flex flex-col items-end">
          <span className="text-xs font-black text-slate-500">{created.toLocaleDateString(i18n.language, { weekday: 'long' })}</span>
          <span className="text-xs font-bold text-slate-400 mt-0.5">{created.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className={`px-4 py-2 rounded-lg text-xs font-bold shrink-0 ${isAwarded ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-blue-50 text-blue-600'}`}>
          {isAwarded ? 'مقبول' : 'بانتظار الرد'}
        </div>
      </div>
    </div>
  );
}
