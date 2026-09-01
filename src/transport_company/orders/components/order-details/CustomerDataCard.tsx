import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';

/**
 * Feature 009 T033/SC-005: `clientSummary` is snapshotted only once a driver is assigned
 * (the same transaction as `driverSummary`) — before that, the platform gives this role no
 * customer contact at all, which is a real constraint, not a bug. This card reflects that
 * honestly rather than showing a placeholder name.
 */
export function CustomerDataCard() {
  const { t } = useTranslation();
  const { order } = useOrderDetailContext();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center relative">
      <div className="w-full flex items-center gap-3 mb-8">
        <h2 className="text-xl font-black text-[#162155]">{t('assign.customerData')}</h2>
      </div>

      {order?.clientSummary ? (
        <>
          <span className="text-[#162155] font-black text-xl mb-1">{order.clientSummary.fullName}</span>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-bold mb-2">
            <span dir="ltr">{order.clientSummary.phone}</span>
          </div>
        </>
      ) : (
        <p className="text-sm text-slate-400 py-4">{t('assign.customerUnavailable')}</p>
      )}
    </div>
  );
}
