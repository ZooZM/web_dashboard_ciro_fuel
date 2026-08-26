import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CommissionTypeSelector } from './CommissionTypeSelector';

export function PlatformCommissionBanner() {
  const [open, setOpen] = useState(false);
  const [inputType, setInputType] = useState<'per_riyal' | 'percentage'>('per_riyal');

  return (
    <div className="bg-white shadow-xl border-r-4 border-r-[#F97316] rounded-xl p-5 mb-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#F97316] flex items-center justify-center shrink-0">
            <img src="/white-percentage-icon.svg" alt="Percentage" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-black text-lg">عمولة المنصة</span>
              <span className="text-[#1E5FFF] font-black text-lg">0.07 %</span>
            </div>
            <span className="text-slate-400 text-xs font-medium mt-1">
              (0.0007 ر.س) من قيمة كل فاتورة نقل تتم عبر المنصة
            </span>
          </div>
        </div>

        {/* Left Section */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-[10px]">آخر تحديث</span>
            <span className="text-slate-900 font-bold text-sm">منذ 3 أشهر</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="w-10 h-10 rounded-xl border border-orange-100 bg-white hover:bg-orange-50 text-orange-500 flex items-center justify-center transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.4444 9.6875C18.4444 9.6875 21.4444 6.6875 19.4444 4.6875C17.4444 2.6875 14.4444 5.6875 14.4444 5.6875L5.446 14.6859C4.78735 15.3446 4.26731 16.1441 4.109 17.062C3.94915 17.9888 3.89595 19.139 4.44444 19.6875C4.99294 20.236 6.14311 20.1828 7.06993 20.0229C7.98784 19.8646 8.78735 19.3446 9.446 18.6859L18.4444 9.6875ZM14.4444 5.6875L18.4444 9.6875" stroke="#FF5810" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl">
                <div className="flex items-center justify-end gap-2 mb-6 text-[#162155]">
                  <h2 className="text-xl font-black">تعديل العمولة</h2>
                  <img src="/transportCompany/orderPage/orderDetails/edit.svg" alt="" />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Current Value */}
                  <div className="flex items-center bg-[#F8FAFC] border border-[#E7E9EF] rounded-xl p-3 px-4">
                    <span className="flex-1 text-slate-400 text-sm font-medium">العمولة الحالي</span>
                    <span className="text-slate-900 font-bold">0.07 <span className="text-slate-400 text-xs font-normal">%</span></span>
                  </div>

                  {/* Input Value */}
                  <CommissionTypeSelector value={inputType} onChange={setInputType} percentageLabel="النسبة من كل فاتورة" perRiyalLabel="كام ريال لكل ريال سعودي" />

                  {/* Info Box */}
                  <div className="bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl p-3 text-center mt-4">
                    <span className="text-slate-400 text-xs font-bold">سيتم تطبيق النسبة الجديدة على كل الطلبات فور تطبيقها</span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => setOpen(false)}
                      className="bg-[#1E5FFF] text-white rounded-xl py-3 text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                      تطبيق النسبة
                    </button>
                    <button
                      onClick={() => setOpen(false)}
                      className="bg-white border border-[#E7E9EF] text-slate-700 rounded-xl py-3 text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
