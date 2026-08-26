import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { CommissionTypeSelector } from './CommissionTypeSelector';

export function CashbackBanner() {
  const [isActive, setIsActive] = useState(true);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<'all' | 'specific'>('all');
  const [inputType, setInputType] = useState<'per_riyal' | 'percentage'>('per_riyal');

  return (
    <div className="bg-white border-r-4 border-[#8B3FE8] shadow-xl rounded-xl p-5 mb-4 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#8B5CF6] flex items-center justify-center shrink-0">
            <img src="/gift-icon.svg" alt="Gift" className="w-6 h-6 object-contain" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-black text-lg">كاش بالك</span>
              <span className="text-[#1E5FFF] font-black text-lg">0.05 %</span>
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-bold",
            isActive ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#EF4444]"
          )}>
            {isActive ? "مفعل" : "غير مفعل"}
          </div>
            </div>
            <span className="text-slate-400 text-xs font-medium mt-1">
              (0.0005 ر.س) استرداد نقدي علي كل فاتورة يتم دفعها
            </span>
          </div>
        </div>

        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Badge */}

          {/* Last Update */}
          <div className="flex flex-col items-end">
            <span className="text-slate-400 text-[10px]">آخر تحديث</span>
            <span className="text-slate-900 font-bold text-sm">منذ 3 أشهر</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center transition-colors",
                isActive ? "border-red-100 bg-white hover:bg-red-50 text-red-500" : "border-green-100 bg-white hover:bg-green-50 text-green-500"
              )}
            >
              {isActive ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              )}
            </button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="w-10 h-10 rounded-xl border border-purple-100 bg-white hover:bg-purple-50 text-purple-500 flex items-center justify-center transition-colors">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.4444 9.6875C18.4444 9.6875 21.4444 6.6875 19.4444 4.6875C17.4444 2.6875 14.4444 5.6875 14.4444 5.6875L5.446 14.6859C4.78735 15.3446 4.26731 16.1441 4.109 17.062C3.94915 17.9888 3.89595 19.139 4.44444 19.6875C4.99294 20.236 6.14311 20.1828 7.06993 20.0229C7.98784 19.8646 8.78735 19.3446 9.446 18.6859L18.4444 9.6875ZM14.4444 5.6875L18.4444 9.6875" stroke="#8B3FE8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] p-6 rounded-2xl">
                <div className="flex items-center justify-end gap-2 mb-6 text-[#162155]">
                  <h2 className="text-xl font-black">تعديل الكاش باك</h2>
                  <img src="/transportCompany/orderPage/orderDetails/edit.svg" alt="" />
                </div>

                <div className="flex flex-col gap-4">
                  {/* Current Value */}
                  <div className="flex items-center bg-[#F8FAFC] border border-[#E7E9EF] rounded-xl p-3 px-4">
                    <span className="flex-1 text-slate-400 text-sm font-medium">الكاش باك الحالي</span>
                    <span className="text-slate-900 font-bold">0.05 <span className="text-slate-400 text-xs font-normal">%</span></span>
                  </div>

                  {/* Input Value */}
                  <CommissionTypeSelector value={inputType} onChange={setInputType} />

                  {/* Apply Target */}
                  <div className="mt-2 ">
                    <h3 className="text-slate-700 text-sm font-bold mb-3 text-right">تطبيق الكاش باك ل</h3>
                    <div className="grid grid-cols-2 gap-4">
                     

                      {/* Specific Companies */}
                      <button
                        onClick={() => setTarget('specific')}
                        className={cn(
                          "relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-colors h-[110px]",
                          target === 'specific' ? "border-[#1E5FFF] bg-[#F4F8FF]" : "border-[#E7E9EF] bg-white hover:bg-slate-50"
                        )}
                      >
                        {target === 'specific' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#1E5FFF] rounded-full flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        )}
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", target === 'specific' ? "bg-[#1E5FFF]" : "bg-[#F1F5F9]")}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={target === 'specific' ? "white" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        </div>
                        <span className={cn("text-sm font-bold", target === 'specific' ? "text-[#1E5FFF]" : "text-slate-600")}>شركات محددة</span>
                      </button>

                       {/* All Companies */}
                      <button
                        onClick={() => setTarget('all')}
                        className={cn(
                          "relative p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-colors h-[110px]",
                          target === 'all' ? "border-[#1E5FFF] bg-[#F4F8FF]" : "border-[#E7E9EF] bg-white hover:bg-slate-50"
                        )}
                      >
                        {target === 'all' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#1E5FFF] rounded-full flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        )}
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", target === 'all' ? "bg-[#1E5FFF]" : "bg-[#F1F5F9]")}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={target === 'all' ? "white" : "#94A3B8"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        </div>
                        <span className={cn("text-sm font-bold", target === 'all' ? "text-[#1E5FFF]" : "text-slate-600")}>كل الشركات</span>
                      </button>
                    </div>
                  </div>
                      
                      
                  {/* Info Box */}
                  <div className="bg-[#F8FAFC] border border-dashed border-[#CBD5E1] rounded-xl p-3 text-center mt-2">
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
