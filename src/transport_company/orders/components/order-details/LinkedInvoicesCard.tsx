import { useState } from 'react';
import { Download, Check } from 'lucide-react';

export function LinkedInvoicesCard() {
  const [isPendingExpanded, setIsPendingExpanded] = useState(false);
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
          <img src="/transportCompany/orderPage/orderDetails/greenInvoice.svg" alt="" className="w-5 h-5 text-green-600" />
        </div>
        <h2 className="text-xl font-black text-[#162155]">الفواتير المرتبطة</h2>
      </div>

      {/* Breakdown Section */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Date pills */}
        <div className="flex flex-col md:flex-row gap-4 w-full">
          {/* تاريخ الإنشاء */}
          <div className="flex-1 bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-200 shadow-sm">
            <div className="flex flex-col text-right">
              <span className="text-slate-400 text-[11px] font-bold mb-1">تاريخ الإنشاء</span>
              <span className="text-[#162155] font-black text-xs" dir="ltr">06/06/2026 - 06:35 ص</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 border border-slate-200 shadow-sm">
              <img src="/transportCompany/home/schedule.svg" alt="" className="w-4 h-4 opacity-70 grayscale" />
            </div>
          </div>
          {/* تاريخ السداد */}
          <div className="flex-1 bg-[#DCFCE7] rounded-xl p-4 flex items-center justify-between border border-[#86efac] shadow-sm">
            <div className="flex flex-col text-right">
              <span className="text-emerald-700 text-[11px] font-bold mb-1">تاريخ السداد</span>
              <span className="text-[#162155] font-black text-xs" dir="ltr">06/06/2026 - 06:35 ص</span>
            </div>
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm">
              <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
            </div>
          </div>
        </div>

        {/* Invoice breakdown table */}
        <div className="flex flex-col bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Rows */}
          <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
            <span className="text-slate-500 text-[11px] font-bold flex-1 text-right">الوقود (20,000 لتر × بنزين 98)</span>
            <div className="flex items-center gap-3">
               <span className="bg-[#DCFCE7] text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold">2.33 ر.س / لتر</span>
               <div className="flex items-center gap-1 w-24 justify-end">
                 <span className="text-[#162155] font-black text-xs">46,600.00</span>
                 <span className="text-slate-400 text-[9px] font-bold">ر.س</span>
               </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
            <span className="text-slate-500 text-[11px] font-bold flex-1 text-right">الضريبة (15%)</span>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1 w-24 justify-end">
                 <span className="text-[#162155] font-black text-xs">6,990.00</span>
                 <span className="text-slate-400 text-[9px] font-bold">ر.س</span>
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
            <span className="text-slate-500 text-[11px] font-bold flex-1 text-right">العمولة</span>
            <div className="flex items-center gap-3">
               <span className="bg-[#DCFCE7] text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold">0.13 ر.س / لتر</span>
               <div className="flex items-center gap-1 w-24 justify-end">
                 <span className="text-[#162155] font-black text-xs">2,600.00</span>
                 <span className="text-slate-400 text-[9px] font-bold">ر.س</span>
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50">
            <span className="text-slate-500 text-[11px] font-bold flex-1 text-right">الإجمالي</span>
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-1 w-24 justify-end">
                 <span className="text-[#162155] font-black text-xs">56,190.00</span>
                 <span className="text-slate-400 text-[9px] font-bold">ر.س</span>
               </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50">
            <span className="text-slate-500 text-[11px] font-bold flex-1 text-right">أجرة النقل</span>
            <div className="flex items-center gap-3">
               <span className="bg-[#DCFCE7] text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold">0.02 ر.س / لتر</span>
               <div className="flex items-center gap-1 w-24 justify-end">
                 <span className="text-[#162155] font-black text-xs">400.00</span>
                 <span className="text-slate-400 text-[9px] font-bold">ر.س</span>
               </div>
            </div>
          </div>

          {/* Total Row */}
          <div className="flex items-center justify-between p-4 bg-[#EFF6FF] border-t border-[#BFDBFE]">
            <span className="text-[#2563EB] text-sm font-black">الإجمالي النهائي</span>
            <div className="flex items-center gap-1">
               <span className="text-[#2563EB] font-black text-base">56,590.00</span>
               <span className="text-[#2563EB] text-[10px] font-bold opacity-70">ر.س</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Pending Invoice (Toggleable) */}
        <div className="flex flex-col p-3 border border-slate-100 rounded-xl bg-white shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsPendingExpanded(!isPendingExpanded)}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                <img src="/transportCompany/orderPage/orderDetails/pending.png" alt="" className="w-7 h-7 object-contain" />
              </div>
              <div className="flex flex-col text-right gap-1">
                <span className="text-[#162155] font-black text-sm">INV-2024-158</span>
                <span className="text-slate-400 text-[11px] ">صدرت 16/07/2026</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1.5">
                <span className="text-[#162155] font-black text-sm">650 <span className="text-xs">ر.س</span></span>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-[10px] font-bold">مستحقة</span>
              </div>
              <button className="text-blue-600 hover:bg-slate-50 p-1 rounded-md transition-colors shrink-0">
                <img src="/transportCompany/orderPage/orderDetails/chevronRight.svg" alt="" className={`w-5 h-5 transition-transform duration-300 ${isPendingExpanded ? '-rotate-90 ' : 'rotate-90'}`} />
              </button>
            </div>
          </div>

          {/* Expanded Content */}
          {isPendingExpanded && (
            <div className="bg-[#FFF8F3] border border-[#FFD9C0] rounded-xl p-5 mt-4 flex flex-col gap-5 relative overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  <img src="/transportCompany/orderPage/orderDetails/Sadaad.png" alt="Sadaat" className="h-8 object-contain" />
                  <div className="flex flex-col text-right">
                    <span className="text-[#162155] font-black text-sm">بيانات الفاتورة</span>
                    <span className="text-slate-400 text-[10px] font-bold">INV-2024-158</span>
                  </div>
                </div>

                <div className="bg-white px-3 py-1.5 rounded-full flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                  <span className="text-orange-500 text-[11px] font-bold">صالحة حتى 10/10/2026 - 06:30 ص</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 z-10">
                <span className="text-slate-400 text-[10px] font-bold text-right">رقم الفاتورة</span>
                <div className="bg-white rounded-lg p-3 flex items-center border border-[#FFD9C0]">
                  <div className='flex flex-1 justify-center items-center'>
                  <span className="text-[#162155] font-black text-sm tracking-widest" dir="ltr">40521889241035</span>
                  </div>
                  <button className="text-blue-600 shrink-0 hover:bg-slate-50 p-1 rounded-md transition-colors" onClick={(e) => e.stopPropagation()}>
                    <img src="/transportCompany/orderPage/orderDetails/copy.svg" alt="copy" className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="text-left z-10">
                <span className="text-slate-400 text-[10px] ">تاريخ الإنشاء 08/08/2026 - 06:30 ص</span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Paid */}
        <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
              <img src="/transportCompany/orderPage/orderDetails/rightCheck.png" alt="" className="w-7 h-7 object-contain" />
            </div>
            <div className="flex flex-col text-right gap-1">
              <span className="text-[#162155] font-black text-sm">INV-2024-158</span>
              <span className="text-slate-400 text-[11px] ">صدرت 16/07/2026</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-[#162155] font-black text-sm">650 <span className="text-xs">ر.س</span></span>
              <span className="bg-green-50 text-green-600 px-3 py-1 rounded-md text-[10px] font-bold">مسددة</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors shrink-0">
              <Download className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* 4. Aramco */}
        <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl p-1 flex items-center justify-center shrink-0">
              <img src="/transportCompany/orderPage/orderDetails/invoiceIcon.svg" alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col text-right gap-1">
              <span className="text-[#162155] font-black text-sm">فاتورة أرامكو</span>
              <span className="text-slate-400 text-[11px] ">صدرت 16/07/2026</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-50 w-28 h-10 rounded-2xl flex items-center justify-center">
              <img src="/transportCompany/orderPage/orderDetails/Aramco.svg" alt="Aramco" className="h-5 object-contain" />
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors shrink-0">
              <Download className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* 5. Sadaat */}
        <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex p-1 items-center justify-center shrink-0">
              <img src="/transportCompany/orderPage/orderDetails/invoiceIcon.svg" alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col text-right gap-1">
              <span className="text-[#162155] font-black text-sm">فاتورة سداد</span>
              <span className="text-slate-400 text-[11px] ">صدرت 16/07/2026</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-slate-50 w-28 h-10 rounded-2xl flex items-center justify-center">
              <img src="/transportCompany/orderPage/orderDetails/Sadaad.png" alt="Sadaat" className="h-5 object-contain" />
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors shrink-0">
              <Download className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>

        {/* 6. Generic */}
        <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 p-1 rounded-2xl flex items-center justify-center shrink-0">
              <img src="/transportCompany/orderPage/orderDetails/invoiceIcon.svg" alt="" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <div className="flex flex-col text-right gap-1">
              <span className="text-[#162155] font-black text-sm">فاتورة سداد</span>
              <span className="text-slate-400 text-[11px] ">صدرت 16/07/2026</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative bg-[#EDF2FF] w-28 h-10 rounded-2xl flex items-center justify-center gap-1.5">
              <img src="/transportCompany/orderPage/orderDetails/invoiceButton.svg" alt="" className="w-10 h-full shrink-0 object-contain -mr-1 absolute right-0" />
              <span className="text-[#6B7280] font-bold mr-2 text-sm whitespace-nowrap">فاتورة</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors shrink-0">
              <Download className="w-5 h-5 text-blue-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
