import { OrderDetailProvider, useOrderDetailContext } from './order-details/OrderDetailContext';
import { OrderHeader } from './order-details/OrderHeader';
import { OrderDataCard } from './order-details/OrderDataCard';
import { TrackingTimelineCard } from './order-details/TrackingTimelineCard';
import { CustomerDataCard } from './order-details/CustomerDataCard';
import { MapCard } from './order-details/MapCard';
import { AssignedDriverCard } from './order-details/AssignedDriverCard';
import { StalledDeliveryCard } from './order-details/StalledDeliveryCard';
import { StopAlertCard } from './order-details/StopAlertCard';
import { useTranslation } from 'react-i18next';

/**
 * Feature 009 T033/SC-005: UrgentNotificationCard ("driver stopped moving") and
 * LinkedInvoicesCard (a fabricated invoice/tax/fuel-line breakdown) are dropped from this
 * composition — neither has a real data source. "Driver stopped" needs geofencing/movement-
 * timeout detection the platform does not have; a genuine per-order invoice view is real
 * but non-trivial (a DEFERRED invoice lookup) and out of this feature's scope as planned.
 * Both are left as fabricated-value risks rather than shipped with invented numbers.
 */
function OrderDetailContent() {
  const { t } = useTranslation();
  const { order, isLoading } = useOrderDetailContext();

  if (isLoading) return <p className="p-6 text-sm text-slate-400">{t('common.loading')}</p>;
  if (!order) return <p className="p-6 text-sm text-slate-400">{t('errors.notFound')}</p>;

  return (
    <>
      <OrderHeader />
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 w-full flex flex-col gap-6">
          {/* spec 011 T054: above everything else, including the order's own
              details. An active stop alert is the one thing on this page that
              might need acting on right now; anything above it is something
              the administrator has to scroll past to find out. Renders
              nothing at all when there are no stop events (FR-013). */}
          <StopAlertCard />
          <OrderDataCard />
          <StalledDeliveryCard />
          <TrackingTimelineCard />
        </div>
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <CustomerDataCard />
          <MapCard />
          <AssignedDriverCard />
        </div>
      </div>
    </>
  );
}

export function OrderDetailPage() {
  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full" dir="rtl">
      <OrderDetailProvider>
        <OrderDetailContent />
      </OrderDetailProvider>
    </div>
  );
}
