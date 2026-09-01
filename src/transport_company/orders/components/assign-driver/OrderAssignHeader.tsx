import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAssignment } from './AssignmentContext';

export function OrderAssignHeader() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { orderId } = useAssignment();

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
        <span className="text-slate-400 cursor-pointer" onClick={() => navigate(`/transport/orders/${orderId}`)}>
          {orderId}
        </span>
        <span className="text-slate-400">/</span>
        <span className="text-[#162155] font-bold">{t('assign.title')}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center mb-6">
        <div className="flex-1 w-full">
          <h1 className="text-2xl font-black text-slate-900">{t('assign.title')}</h1>
        </div>
      </div>
    </>
  );
}
