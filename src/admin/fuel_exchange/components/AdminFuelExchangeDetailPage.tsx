import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useExchangeRequestDetail } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { useFuelCompaniesList } from '@/admin/petrol_companies/hooks/useFuelCompanies';
import { ExchangeRequestState } from '@/constants/fuel-company';
import { FUEL_TYPE_LABEL_KEY } from '@/constants/order-status';

// Feature 013 T242/FR-089: real `GET /fuel-exchange/requests/:id`. No accept/decline/
// withdraw here — those are `FUEL_COMPANY_ADMIN`-only, recipient/raiser-respectively
// (T224/T225's own `@Roles`), and FR-091 requires operator-only screens to show no
// control a fuel company admin doesn't also have reason to see, which cuts both ways:
// this operator screen shows no action a company's own admin would have to perform
// instead. Companies are resolved from `GET /companies?type=FUEL` directly rather than
// the endpoint's own `counterparty` field, which assumes a caller WITH a company (see
// this file's sibling `AdminFuelExchangeListItem.tsx` and the backend controller's own
// comment for why that field means something different — always "the recipient" — for a
// `SUPER_ADMIN` caller, who has no side of their own to be counter to).
export function AdminFuelExchangeDetailPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { data: request, isLoading, isError, refetch } = useExchangeRequestDetail(id ?? '');
  const { data: companies } = useFuelCompaniesList();

  if (isLoading) {
    return <div className="p-6 text-center text-sm text-slate-400">{t('common.loading')}</div>;
  }
  if (isError || !request) {
    return (
      <div className="p-6 flex flex-col items-center gap-3">
        <p className="text-sm text-red-500">{t('fuelExchange.loadError')}</p>
        <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  const raiser = companies?.find((c) => c._id === request.raisedByCompanyId);
  const recipient = companies?.find((c) => c._id === request.recipientCompanyId);
  const total = request.quantityLitres * request.unitPrice;

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/admin/fuel-exchange')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">{t('fuelExchange.title')}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-between">
        <span className="text-lg font-black text-slate-900">
          {raiser?.name ?? '—'} → {recipient?.name ?? '—'}
        </span>
        <span
          className={
            request.state === ExchangeRequestState.ACCEPTED
              ? 'px-5 py-2.5 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-sm font-bold'
              : 'px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold'
          }
        >
          {t(`fuelExchange.state.${request.state}`)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-900 mb-6">{t('fuelExchange.requestData')}</h2>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-right">
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.supplier')}</span>
              <span className="text-base font-black text-slate-900">{recipient?.name ?? '—'}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.receiver')}</span>
              <span className="text-base font-black text-slate-900">{raiser?.name ?? '—'}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.quantity')}</span>
              <span className="text-base font-black text-slate-900">{request.quantityLitres.toLocaleString()} {t('fuelExchange.litres')}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.fuelType')}</span>
              <span className="text-base font-black text-slate-900">{t(FUEL_TYPE_LABEL_KEY[request.fuelType])}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.unitPrice')}</span>
              <span className="text-base font-black text-slate-900">{request.unitPrice.toFixed(2)} {request.currency}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.estimatedTotal')}</span>
              <span className="text-base font-black text-slate-900">{total.toLocaleString()} {request.currency}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.deliveryPlace')}</span>
              <span className="text-sm font-black text-slate-900">{request.deliveryPlaceText}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.deliveryDate')}</span>
              <span className="text-sm font-black text-slate-900">{new Date(request.deliveryAt).toLocaleString(i18n.language)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
