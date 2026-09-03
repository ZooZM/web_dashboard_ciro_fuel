import { OrderDetailProvider, useOrderDetailContext } from './order-details/OrderDetailContext';
import { OrderHeader } from './order-details/OrderHeader';
import { CustomerDataCard } from './order-details/CustomerDataCard';
import { MapCard } from './order-details/MapCard';
import { AssignedDriverCard } from './order-details/AssignedDriverCard';
import { TransportCompanyCard } from './order-details/TransportCompanyCard';
import { OrderDataCard } from './order-details/OrderDataCard';
import { TrackingTimelineCard } from './order-details/TrackingTimelineCard';
import { LinkedInvoicesCard } from './order-details/LinkedInvoicesCard';
import { SupplierInvoiceCard } from './order-details/SupplierInvoiceCard';
import { AvailableBalanceCard } from './order-details/AvailableBalanceCard';
import { useTranslation } from 'react-i18next';

// Feature 013 T054/FR-018/FR-092/FR-093: real data via OrderDetailProvider — the
// isEditingTransport toggle and its EditTransportDetailsCard are removed outright: the
// platform has no capability to reassign an already-routed order's transporter (FR-017
// forbids offering an action with no real destination, FR-051), only `redispatch` for
// one no transporter accepted (wired in OrderHeader). LimitCard (credit limit) is
// deferred to Phase 6's own scope. SupplierInvoiceCard/AvailableBalanceCard are Phase 14
// (US11) — built once `LitreBalance`/`Order.supplierInvoices` existed to back them.
function OrderDetailContent() {
  const { t } = useTranslation();
  const { isLoading, isError, refetch } = useOrderDetailContext();

  if (isLoading) {
    return (
      <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full flex items-center justify-center">
        <p className="text-sm text-slate-400">{t('common.loading')}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-red-500">{t('orders.loadError')}</p>
        <button onClick={() => refetch()} className="text-sm font-bold text-blue-600 hover:underline">
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full" dir="rtl">
      <OrderHeader />
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full flex flex-col gap-6">
          <TransportCompanyCard />
          <OrderDataCard />
          <TrackingTimelineCard />
          <LinkedInvoicesCard />
          <SupplierInvoiceCard />
        </div>
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <CustomerDataCard />
          <MapCard />
          <AssignedDriverCard />
          <AvailableBalanceCard />
        </div>
      </div>
    </div>
  );
}

export function OrderDetailPage() {
  return (
    <OrderDetailProvider>
      <OrderDetailContent />
    </OrderDetailProvider>
  );
}
