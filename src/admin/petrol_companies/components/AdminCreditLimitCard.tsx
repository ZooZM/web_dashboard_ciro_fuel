/**
 * Admin-only read-only version of CreditLimitCard.
 * No action buttons – display only.
 */
export function AdminCreditLimitCard() {
  const creditLimit = 200000;
  const usedCredit = 80000;
  const availableCredit = creditLimit - usedCredit;
  const usagePercentage = creditLimit > 0 ? (usedCredit / creditLimit) * 100 : 0;

  const formatCurrency = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white border-t-4 border-orange-500 rounded-2xl p-6 shadow-lg mb-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 14H12M20.9058 10H3.09424M20.9058 10C20.7376 8.24663 20.3688 6.91254 20 6.66667C19.5 6.33333 16 6 12 6C8 6 4.5 6.33333 4 6.66667C3.63118 6.91254 3.26238 8.24663 3.09424 10M20.9058 10C20.9656 10.6237 21 11.3004 21 12C21 14.6667 20.5 17 20 17.3333C19.5 17.6667 16 18 12 18C8 18 4.5 17.6667 4 17.3333C3.5 17 3 14.6667 3 12C3 11.3004 3.03443 10.6237 3.09424 10" stroke="#FF5810" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-black text-slate-900 text-lg">الحد الإئتماني</span>
        </div>
        <div className="px-4 py-1.5 rounded-lg text-xs font-bold bg-green-50 text-green-600">نشط</div>
      </div>

      {/* Amount Info */}
      <div className="flex items-end justify-between mb-2 text-right">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-slate-400 mb-0.5">المتاح للدفع الآن</span>
          <span className="font-black text-lg text-slate-900">{formatCurrency(availableCredit)} <span className="text-[10px] text-slate-400 font-bold">ر.س</span></span>
        </div>
        <span className="text-xs font-bold text-slate-400 mb-1">من {formatCurrency(creditLimit)} ر.س</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2 flex">
        <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${usagePercentage}%` }}></div>
        <div className="h-full bg-slate-200 transition-all duration-300" style={{ width: `${100 - usagePercentage}%` }}></div>
      </div>

      <div className="flex justify-start mb-8">
        <span className="text-[10px] font-bold text-slate-400">مستخدم {formatCurrency(usedCredit)} ر.س ({usagePercentage.toFixed(1)}%)</span>
      </div>

      {/* Dates */}
      <div className="flex xl:flex-row md:flex-col justify-between gap-5">
        <div className="flex items-center justify-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 15.2V16.8875L16.9 17.9M15 2.5V6.5M9 2.5V6.5M9 11.5H3.51733M3.51733 11.5C3.50563 11.8208 3.5 12.154 3.5 12.5C3.5 17.4094 4.64094 19.7517 8 20.6041M3.51733 11.5C3.7256 5.79277 5.84596 4 12 4C17.3679 4 19.6668 5.36399 20.3048 9.5M20.5 17C20.5 19.4853 18.4853 21.5 16 21.5C13.5147 21.5 11.5 19.4853 11.5 17C11.5 14.5147 13.5147 12.5 16 12.5C18.4853 12.5 20.5 14.5147 20.5 17Z" stroke="#12A150" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 mb-0.5">صالح حتى</span>
            <span className="font-bold text-sm text-slate-900" dir="ltr">11/12/2026, 08:00 ص</span>
          </div>
        </div>

        <div className="flex items-center justify-start gap-4 mx-auto">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/notification/date.svg" className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 mb-0.5">تاريخ التفعيل</span>
            <span className="font-bold text-sm text-slate-900" dir="ltr">12/12/2025, 08:00 ص</span>
          </div>
        </div>
      </div>
    </div>
  );
}
