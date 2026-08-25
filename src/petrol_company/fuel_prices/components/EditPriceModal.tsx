import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import type { FuelData } from './FuelPricesPage';

interface EditPriceModalProps {
  fuel: FuelData;
  onClose: () => void;
}

export function EditPriceModal({ fuel, onClose }: EditPriceModalProps) {
  const [newPrice, setNewPrice] = useState(parseFloat(fuel.price));
  const [scheduleType, setScheduleType] = useState<'immediate' | 'scheduled'>('immediate');

  const handleDecrease = () => setNewPrice(prev => Math.max(0, parseFloat((prev - 0.01).toFixed(2))));
  const handleIncrease = () => setNewPrice(prev => parseFloat((prev + 0.01).toFixed(2)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[24px] w-full max-w-[360px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200" dir="rtl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <img src="/petrolCompany/orderDetails/edit.svg" className='w-4 h-4 object-contain' alt="" />
            <span className="font-bold text-[#162155] text-base">تعديل سعر {fuel.type}</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-5">
          {/* Current Price */}
          <div className="bg-[#F1F5F9] rounded-xl p-3 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">السعر الحالي</span>
            <div className="flex items-center gap-2">
              <span className="font-black text-[#162155] text-lg">{fuel.price}</span>
              <span className="text-sm font-medium text-slate-500">{fuel.unit}</span>
            </div>
          </div>

          {/* New Price */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-500">السعر الجديد</span>
            <div className="border border-slate-200 rounded-2xl p-1.5 flex items-center justify-between">
              <button onClick={handleDecrease} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F1F5F9] text-[#1E5FFF] hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              
              <div className="flex flex-col items-center gap-1">
                <span className="text-xl font-black text-[#162155] leading-none">{newPrice.toFixed(2)}</span>
                <span className="text-[12px] font-medium text-slate-400 leading-none">ر.س</span>
              </div>

              <button onClick={handleIncrease} className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#F1F5F9] text-[#1E5FFF] hover:bg-blue-50 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

          {/* Effective Date */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-500">موعد السريان</span>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setScheduleType('immediate')}
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl border transition-colors",
                  scheduleType === 'immediate' 
                    ? "border-[#1E5FFF] bg-blue-50/30" 
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="font-bold text-sm text-[#162155]">فوري (الآن)</span>
                  <span className="text-[11px] font-medium text-slate-400">تحديث بمجرد التأكيد</span>
                </div>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.1038 3.90466C13.2133 3.63097 13.0117 3.33325 12.717 3.33325H7.79936C7.62002 3.33325 7.46079 3.44801 7.40408 3.61816L5.18186 10.2848C5.09192 10.5546 5.29274 10.8333 5.57714 10.8333H7.79872C8.0698 10.8333 8.2687 11.088 8.20295 11.351L7.03056 16.0405C6.92807 16.4505 7.4306 16.735 7.72942 16.4362L15.1211 9.04455C15.3836 8.78206 15.1977 8.33325 14.8265 8.33325H11.9478C11.653 8.33325 11.4515 8.03553 11.5609 7.76184L13.1038 3.90466Z" stroke={scheduleType === 'immediate' ? "#1E5FFF" : "#94A3B8"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              <button 
                onClick={() => setScheduleType('scheduled')}
                className={cn(
                  "flex items-center justify-between p-3 rounded-2xl border transition-colors",
                  scheduleType === 'scheduled' 
                    ? "border-[#1E5FFF] bg-blue-50/30" 
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="font-bold text-sm text-[#162155]">جدولة لوقت لاحق</span>
                  <span className="text-[11px] font-medium text-slate-400">تحديد اليوم و الوقت</span>
                </div>
                {scheduleType === 'scheduled' ? (
                  <img src="/petrolCompany/requests/date.svg" alt="" className="w-[18px] h-[18px] object-contain" style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(99%) saturate(3082%) hue-rotate(212deg) brightness(101%) contrast(104%)' }} />
                ) : (
                  <img src="/petrolCompany/requests/date.svg" alt="" className="w-[18px] h-[18px] object-contain" />
                )}
              </button>
            </div>

            {scheduleType === 'scheduled' && (
              <div className="flex flex-col gap-2 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
                <span className="text-[13px] font-medium text-slate-500">تاريخ ووقت السريان</span>
                <div className="border border-slate-200 rounded-2xl p-3 flex items-center relative bg-white cursor-text hover:border-blue-200 transition-colors">
                  <span className="text-slate-400 font-medium text-sm w-full text-center">التاريخ و الوقت</span>
                  <img src="/petrolCompany/requests/date.svg" alt="" className="w-4 h-4 object-contain absolute left-4" style={{ filter: 'brightness(0) saturate(100%) invert(31%) sepia(99%) saturate(3082%) hue-rotate(212deg) brightness(101%) contrast(104%)' }} />
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-[#F8FAFC] border border-dashed border-slate-300 rounded-xl p-3 text-center border border-[#E7E9EF] rounded-2xl">
            <p className="text-[12px] font-medium text-slate-400 leading-relaxed">
              سيتم تطبيق السعر الجديد على كل الطلبات الواردة من محطاتك فور سريانه.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 pt-0 flex items-center gap-3">
           <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-[#1E5FFF] text-white font-bold hover:bg-blue-700 transition-colors text-sm">
             تحديث السعر
           </button>
           <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[#1E5FFF] font-bold hover:bg-slate-50 transition-colors bg-white text-sm">
             إلغاء
           </button>
        </div>
      </div>
    </div>
  );
}
