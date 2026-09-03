import { useNavigate, useParams } from 'react-router-dom';
import { ExchangeRequestState } from '@/constants/fuel-company';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { FuelExchangeRequestData } from './FuelExchangeRequestData';
import { FuelExchangeContactInfo } from './FuelExchangeContactInfo';
import { useExchangeRequestDetail, useRespondToExchangeRequest, useWithdrawExchangeRequest } from '@/petrol_company/fuel_exchange/hooks/useFuelExchange';
import { useSessionStore } from '@/stores/session.store';
import { ApiError } from '@/lib/api/api-error';

// Feature 013 T233/FR-080/FR-081/FR-082/FR-086b: wired to `GET
// /fuel-exchange/requests/:id`. Accept/decline are recipient-only, withdraw is
// raiser-only — both are the platform's own role check (a 403/409 surfaces as the
// platform's own message, never guessed at client-side); a `409` on either action reads
// as "already resolved" (FR-082).
export function FuelExchangeDetailPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const user = useSessionStore((s) => s.user);
  const { data: request, isLoading, isError, refetch } = useExchangeRequestDetail(id ?? '');
  const respond = useRespondToExchangeRequest(id ?? '');
  const withdraw = useWithdrawExchangeRequest(id ?? '');

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

  const isRecipient = request.recipientCompanyId === user?.companyId;
  const isRaiser = request.raisedByCompanyId === user?.companyId;
  const canRespond = isRecipient && request.state === ExchangeRequestState.AWAITING_RESPONSE;
  const canWithdraw = isRaiser && request.state === ExchangeRequestState.AWAITING_RESPONSE;

  async function handleRespond(accept: boolean) {
    try {
      await respond.mutateAsync(accept);
      toast.success(accept ? t('fuelExchange.accepted') : t('fuelExchange.declined'));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  async function handleWithdraw() {
    try {
      await withdraw.mutateAsync();
      toast.success(t('fuelExchange.withdrawn'));
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : t('errors.generic'));
    }
  }

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/petrolCompany/fuel-exchange')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          {t('fuelExchange.title')}
        </span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-blue-600 font-black text-xl">
            {request.counterparty.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900">{request.counterparty.name}</span>
            <span className="text-sm font-bold text-slate-400 mt-0.5">
              {new Date(request.createdAt).toLocaleDateString(i18n.language)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canRespond ? (
            <>
              <button
                onClick={() => void handleRespond(true)}
                disabled={respond.isPending}
                className="px-5 py-2.5 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-sm font-bold hover:bg-green-200 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                <img src="/petrolCompany/requests/rightCheck.svg" alt="" className="w-4 h-4" />
                {t('fuelExchange.accept')}
              </button>
              <button
                onClick={() => void handleRespond(false)}
                disabled={respond.isPending}
                className="px-5 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                {t('fuelExchange.decline')}
              </button>
            </>
          ) : canWithdraw ? (
            <button
              onClick={() => void handleWithdraw()}
              disabled={withdraw.isPending}
              className="px-5 py-2.5 bg-red-50 text-red-500 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
            >
              {t('fuelExchange.withdraw')}
            </button>
          ) : (
            <span
              className={
                request.state === ExchangeRequestState.ACCEPTED
                  ? 'px-5 py-2.5 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-sm font-bold'
                  : 'px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold'
              }
            >
              {t(`fuelExchange.state.${request.state}`)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full flex flex-col gap-6">
          <FuelExchangeRequestData request={request} isRaiser={isRaiser} />
        </div>
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <FuelExchangeContactInfo counterparty={request.counterparty} />
        </div>
      </div>
    </div>
  );
}
