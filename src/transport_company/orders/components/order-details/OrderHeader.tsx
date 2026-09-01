import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { isAssignableOrderStatus } from '@/constants/order-status';

/**
 * Feature 009 T033/FR-061/FR-070: "رفض" (reject) removed — that belongs to
 * FUEL_COMPANY_ADMIN, and this role receives 403 for it. "Accept & assign" is offered
 * only while the order is actually assignable (ROUTED_TO_TRANSPORT); FR-061 forbids
 * offering an action the role cannot perform regardless of the order's real state.
 */
export function OrderHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderId, order } = useOrderDetailContext();

  return (
    <>
      <div className="flex items-center text-slate-500 text-sm font-medium mb-4 gap-2">
        <div
          className="bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg cursor-pointer"
          onClick={() => navigate('/transport/orders')}
        >
          <ChevronRight className="w-5 h-5 font-bold" />
        </div>
        <span className="flex items-center gap-2 text-slate-400 cursor-pointer" onClick={() => navigate('/transport/orders')}>
          {t('orders.title')}
        </span>
        <span className="text-slate-400">/</span>
        <span className="text-[#162155] font-bold" dir="ltr">{orderId}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center mb-6">
        <div className="flex-1 w-full">
          <h1 className="text-2xl font-black text-slate-900" dir="ltr">
            {t('orders.detail')} – {orderId}
          </h1>
        </div>

        {order && isAssignableOrderStatus(order.status) && (
          <div className="w-full lg:w-auto shrink-0 flex items-center gap-3">
            <button
              onClick={() => navigate(`/transport/orders/${orderId}/assign`)}
              className="flex justify-center items-center gap-1.5 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm px-6"
            >
              {t('assign.title')}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
