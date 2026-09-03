import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { isAssignableOrderStatus, OrderStatus } from '@/constants/order-status';
import { ApproveOrderDialog } from '../ApproveOrderDialog';
import { RejectOrderDialog } from '../RejectOrderDialog';
import { RouteOrderDialog } from '../RouteOrderDialog';
import { ForceCompleteDialog } from '../ForceCompleteDialog';

// Feature 013 T052/FR-018: every action is gated on the order's CURRENT stage — an
// action that does not apply is not offered at all, never shown-and-disabled. FR-017:
// nothing here belongs to another role (no driver verification, loading confirmation,
// vehicle reassignment, override, stop resolution, assignment or cancellation).
export function OrderHeader() {
  const { t } = useTranslation();
  const { order, orderId } = useOrderDetailContext();

  const canApproveOrReject = order?.status === OrderStatus.PENDING_APPROVAL;
  const canRoute = order ? isAssignableOrderStatus(order.status) : false;
  const canForceComplete =
    order &&
    order.status !== OrderStatus.DELIVERED &&
    order.status !== OrderStatus.REJECTED &&
    order.status !== OrderStatus.CANCELLED &&
    order.status !== OrderStatus.PENDING_APPROVAL;

  return (
    <>
      <div className="flex items-center text-slate-500 text-sm font-medium mb-4 gap-2">
        <div
          className="bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ChevronRight className="w-5 h-5 font-bold" />
        </div>
        <span className="flex items-center gap-2 text-slate-400 cursor-pointer" onClick={() => window.history.back()}>
          {t('orders.title')}
        </span>
        <span className="text-slate-400">/</span>
        <span className="text-[#162155] font-bold" dir="ltr">
          {orderId.slice(-8).toUpperCase()}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center mb-6">
        <div className="flex-1 w-full">
          <h1 className="text-2xl font-black text-slate-900">
            {t('orders.detail')} – <span dir="ltr">{orderId.slice(-8).toUpperCase()}</span>
          </h1>
        </div>

        <div className="w-full lg:w-auto shrink-0 flex flex-wrap items-center gap-3">
          {canApproveOrReject && (
            <>
              <RejectOrderDialog orderId={orderId} />
              <ApproveOrderDialog orderId={orderId} estimatedPrice={order?.estimatedPrice ?? 0} />
            </>
          )}
          {canRoute && <RouteOrderDialog orderId={orderId} />}
          {canForceComplete && <ForceCompleteDialog orderId={orderId} />}
        </div>
      </div>
    </>
  );
}
