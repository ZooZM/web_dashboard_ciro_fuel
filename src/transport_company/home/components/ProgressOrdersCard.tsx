import { ProgressOrderRow } from './ProgressOrderRow';

// ---- Mock Data (easy to replace with real API data) ----
const PROGRESS_ORDERS = [
  { id: 'ORD-2024-246', branch: 'شركة بترو أمان، جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98', status: 'في الطريق',    statusClass: 'bg-[#E4F7EC] text-[#12A150]' },
  { id: 'ORD-2024-246', branch: 'شركة بترو أمان، جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98', status: 'تم التسليم',   statusClass: 'bg-[#E4F7EC] text-[#12A150]' },
  { id: 'ORD-2024-246', branch: 'شركة بترو أمان، جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98', status: 'جاري التحميل', statusClass: 'bg-[#E4F7EC] text-[#12A150]' },
  { id: 'ORD-2024-246', branch: 'شركة بترو أمان، جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98', status: 'جاري التحميل', statusClass: 'bg-[#E4F7EC] text-[#12A150]' },
  { id: 'ORD-2024-246', branch: 'شركة بترو أمان، جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98', status: 'جاري التحميل', statusClass: 'bg-[#E4F7EC] text-[#12A150]' },
  { id: 'ORD-2024-246', branch: 'شركة بترو أمان، جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98', status: 'تم التسليم',   statusClass: 'bg-[#E4F7EC] text-[#12A150]' },
  { id: 'ORD-2024-246', branch: 'شركة بترو أمان، جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98', status: 'تم التسليم',   statusClass: 'bg-[#E4F7EC] text-[#12A150]' },
  { id: 'ORD-2024-246', branch: 'شركة بترو أمان، جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98', status: 'تم التسليم',   statusClass: 'bg-[#E4F7EC] text-[#12A150]' },
];

interface ProgressOrdersCardProps {
  onViewAllClick?: () => void;
}

import { useNavigate } from 'react-router-dom';

export function ProgressOrdersCard({ onViewAllClick }: ProgressOrdersCardProps = {}) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col h-[420px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-[#12A150] text-white text-[11px] font-black w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-sm">
            {PROGRESS_ORDERS.length}
          </span>
          <h2 className="text-[17px] font-black text-[#1e293b]">الطلبات قيد التنفيذ</h2>
        </div>
        <button 
          onClick={onViewAllClick || (() => navigate('/transport/order-tracking'))}
          className="text-[14px] font-bold text-[#2563eb] hover:text-blue-700"
        >
          عرض الكل
        </button>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {PROGRESS_ORDERS.map((order, i) => (
          <ProgressOrderRow key={i} order={order} />
        ))}
      </div>

    </div>
  );
}
