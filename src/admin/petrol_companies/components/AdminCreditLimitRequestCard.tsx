/**
 * Admin-only read-only version of CreditLimitRequestCard.
 * No action buttons – display only.
 */
export function AdminCreditLimitRequestCard() {
  const requestedLimit = 120000;

  return (
    <div className="bg-white border-r-4 border-orange-500 rounded-2xl px-5 py-3 shadow-lg mb-4" dir="rtl">
      <div className="flex items-center justify-between">
        {/* Title and Icon */}
        <div className="flex items-center gap-3">
          <div className="w-[54px] h-[54px] rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
            <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.625 33.25H28.5M49.6512 23.75H7.34882M49.6512 23.75C49.2519 19.5857 48.3759 16.4173 47.5 15.8333C46.3125 15.0417 38 14.25 28.5 14.25C19 14.25 10.6875 15.0417 9.5 15.8333C8.62406 16.4173 7.74815 19.5857 7.34882 23.75M49.6512 23.75C49.7933 25.2312 49.875 26.8383 49.875 28.5C49.875 34.8333 48.6875 40.375 47.5 41.1667C46.3125 41.9583 38 42.75 28.5 42.75C19 42.75 10.6875 41.9583 9.5 41.1667C8.3125 40.375 7.125 34.8333 7.125 28.5C7.125 26.8383 7.20678 25.2312 7.34882 23.75" stroke="#FEEEDF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="flex  gap-2">
            <div className="flex  gap-2 items-center">
              <span className="font-bold text-slate-900 text-lg">طلب حد إئتماني</span>
              <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold whitespace-nowrap">
                اليوم 10:20 ص
              </div>
            </div>
          </div>
        </div>
            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2 w-fit">
              <span className="text-xs font-bold text-slate-500">المطلوب</span>
              <span className="font-black text-orange-500 text-base" dir="ltr">{requestedLimit.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-[10px]">ر.س</span></span>
            </div>
      </div>
    </div>
  );
}
