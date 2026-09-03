import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { useOwnerDetail } from '@/petrol_company/stations/hooks/useOwners';

// Feature 013 T054/FR-020: the fabricated name/phone are gone. `clientSummary` on the
// order is only snapshotted once a driver is assigned (feature 007's own boundary), so
// this looks the owner up directly via `clientId` — always present — instead of waiting
// for that snapshot.
export function CustomerDataCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();
  const { data: owner, isLoading } = useOwnerDetail(order?.clientId);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center relative">
      <div className="w-full flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
          <img src="/transportCompany/orderPage/orderDetails/user.svg" alt="" className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-black text-[#162155]">{t('clients.title')}</h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-400 mb-8">{t('common.loading')}</p>
      ) : owner ? (
        <>
          <div className="w-10 h-10 rounded-full bg-slate-100 mb-4 flex items-center justify-center text-slate-500 font-black">
            {owner.fullName.charAt(0)}
          </div>
          <span className="text-[#162155] font-black text-xl mb-1">{owner.fullName}</span>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-4" dir="ltr">
            {owner.phone}
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-400 mb-8">{t('errors.notFound')}</p>
      )}
    </div>
  );
}
