import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOffer } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';
import { governorateLabel } from '@/constants/regions';
import type { GovernorateCode } from '@/constants/regions';
import { ExchangeOfferState, ProposalOutcome } from '@/constants/fuel-company';

export function AdminFuelExchangeDetailPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: offer, isLoading, isError, refetch } = useOffer(id ?? '');

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }
  if (isError || !offer) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <p className="text-sm text-red-500">{t('fuelExchange.loadError')}</p>
        <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const isAwarded = offer.state === ExchangeOfferState.AWARDED;
  const shortId = `ORD-2024-${offer._id.slice(-3).toUpperCase()}`;
  const reqId = `REQ-${offer._id.slice(-6).toUpperCase()}`;

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full rounded-2xl" dir="rtl">
      
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => navigate('/admin/fuel-exchange')}>الطلبات</span>
        <span className="text-sm font-bold text-slate-400">/</span>
        <span className="text-sm font-bold text-slate-900">{shortId}</span>
        <button className="mr-auto w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors" onClick={() => navigate('/admin/fuel-exchange')}>
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="" className="rotate-180" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0">
             <img src="/petrolCompany/owner/station.svg" alt="" className="w-6 h-6" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-900 text-lg">{offer.raisedByCompanyName}</span>
            <span className="text-xs text-slate-400 font-semibold font-mono" dir="ltr">{reqId}</span>
          </div>
        </div>
        <div className={`px-5 py-2.5 rounded-xl text-sm font-bold ${isAwarded ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-blue-50 text-blue-600'}`}>
          {isAwarded ? 'مقبول' : 'بانتظار الرد'}
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex-[2] w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center  gap-2  mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
               <img src="/petrolCompany/requests/details/details.svg" alt="" className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-black text-slate-900">بيانات الطلب</h2>
          </div>

          <div className="grid grid-cols-2 gap-y-8 gap-x-4 mb-8">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-400 mb-2">المورد</span>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <img src="/petrolCompany/owner/station.svg" alt="" className="w-4 h-4" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                 </div>
                 <span className="text-base font-black text-slate-900">{offer.raisedByCompanyName}</span>
               </div>
            </div>
            <div className="flex flex-col text-right">
               <span className="text-xs font-bold text-slate-400 mb-2">المستلم</span>
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center shrink-0">
                    <img src="/petrolCompany/owner/station.svg" alt="" className="w-4 h-4" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                 </div>
                 <span className="text-base font-black text-slate-900">{isAwarded && offer.proposals?.find(p => p.outcome === ProposalOutcome.AWARDED)?.company?.name || 'بترو أمان'}</span>
               </div>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100 mb-8" />

          <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-right mb-8">
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">الكمية</span>
              <span className="text-base font-black text-slate-900">{offer.quantityLitres.toLocaleString()} لتر</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">نوع الوقود</span>
              <span className="text-base font-black text-slate-900">{t(FUEL_TYPE_LABEL_KEY[offer.fuelType])}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">الإجمالي التقديري</span>
              <span className="text-base font-black text-slate-900" dir="ltr">{offer.agreedTotal?.toLocaleString() ?? (offer.quantityLitres * 2.30).toLocaleString()} {offer.currency ?? 'ر.س'}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">سعر اللتر</span>
              <span className="text-base font-black text-slate-900" dir="ltr">{offer.agreedUnitPrice?.toFixed(2) ?? '2.30'} {offer.currency ?? 'ر.س'}</span>
            </div>
          </div>

          <div className="h-px w-full bg-slate-100 mb-8" />

          <div className="grid grid-cols-2 gap-y-8 gap-x-4 text-right mb-8">
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">موعد التسليم</span>
              <span className="text-sm font-black text-slate-900">{new Date(offer.deliveryAt).toLocaleString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">الموقع</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                  <img src="/petrolCompany/requests/pin.svg" alt="" className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900">{governorateLabel(offer.city as GovernorateCode, i18n.language)} {offer.district ? `- ${offer.district}` : ''}</span>
                  {offer.locationUrl && (
                    <a href={offer.locationUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-blue-500 hover:underline mt-0.5 inline-flex items-center gap-1">
                      عرض على الخريطة
                      <img src="/transportCompany/orderPage/orderDetails/link.svg" alt="" className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
               <img src="/petrolCompany/requests/details/comment.svg" alt="" className="w-4 h-4" />
               <span className="text-xs font-bold text-slate-500">ملاحظات</span>
            </div>
            <div className="bg-slate-100 rounded-xl p-4 text-sm font-semibold text-slate-600 border border-slate-200">
              {offer.notes || 'يرجى الالتزام بموعد التسليم والتواصل قبل الوصول بـ 15 دقيقة.'}
            </div>
          </div>

        </div>

        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-slate-900">معلومات التواصل</h2>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
               <img src="/petrolCompany/owner/user.svg" alt="" className="w-5 h-5" />
            </div>
          </div>

          <div className="flex flex-col items-center text-center mb-8">
             <div className="w-16 h-16 bg-slate-100 rounded-full mb-3 flex items-center justify-center overflow-hidden">
                <img src="/petrolCompany/owner/user.svg" alt="" className="w-8 h-8 opacity-50" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
             </div>
             <span className="text-base font-black text-slate-900">عبدالله حسين</span>
             <span className="text-xs font-bold text-slate-500 mt-1">مدير عمليات</span>
          </div>

          <div className="flex flex-col gap-6 text-right mb-8">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1">رقم الجوال</span>
              <span className="text-sm font-black text-slate-900" dir="ltr">920-xxxxxx</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-400 mb-1">البريد الإلكتروني</span>
              <span className="text-sm font-black text-slate-900">support@cirofuel.sa</span>
            </div>
          </div>

          <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-blue-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
            تواصل مع المسؤول
            <img src="/transportCompany/orderPage/orderDetails/link.svg" alt="" className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
