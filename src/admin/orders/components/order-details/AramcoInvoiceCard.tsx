import { useState } from 'react';
import { Download, ChevronDown, Check } from 'lucide-react';

export function AramcoInvoiceCard() {
  const [isAramcoExpanded, setIsAramcoExpanded] = useState(false);
  const [quantity] = useState(31501.10);
  const totalQuantity = 33000.00;
  const remaining = Math.max(0, totalQuantity - quantity).toFixed(2);

  return (
    <div className={`flex flex-col p-3 border border-slate-100 rounded-xl bg-white shadow-sm transition-all duration-300 ${isAramcoExpanded ? 'pb-4' : ''}`}>
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsAramcoExpanded(!isAramcoExpanded)}>
        {/* Right side (Invoice Icon and Text) */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl p-1 flex flex-col items-center justify-center shrink-0">
            <img src="/transportCompany/orderPage/orderDetails/invoiceIcon.svg" alt="" className="w-5 h-5 object-contain brightness-0 invert" />
            <ChevronDown className={`w-4 h-4 text-white transition-transform duration-300 ${isAramcoExpanded ? 'rotate-180' : ''}`} />
          </div>
          <div className="flex flex-col text-right gap-1">
            <span className="text-[#162155] font-black text-sm">فاتورة أرامكو</span>
            <span className="text-slate-400 text-[11px] ">صدرت 16/07/2026</span>
          </div>
        </div>

        {/* Left side (Aramco logo and Download Button) */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-50 w-28 h-10 rounded-2xl flex items-center justify-center">
            <img src="/transportCompany/orderPage/orderDetails/Aramco.svg" alt="Aramco" className="h-5 object-contain" />
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors shrink-0" onClick={(e) => e.stopPropagation()}>
            <Download className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isAramcoExpanded && (
        <div className="flex flex-col p-4 border border-slate-100 rounded-xl bg-slate-50 shadow-sm mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between gap-4 mb-4">
            
            {/* The Edit Box */}
            <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 text-center flex flex-col gap-1 items-center justify-center relative">
              <span className="text-slate-700 text-[11px] font-black">الكمية المطلوبة لهذا الطلب</span>
              <span className="text-[#ea580c] text-sm font-black mt-1">{quantity.toLocaleString('en-US', {minimumFractionDigits: 2})} <span className="text-[10px] text-slate-400">لتر</span></span>
            </div>

            {/* Remaining Box */}
            <div className="flex-1 bg-[#FFF7ED] border-[0.2px] border-orange-500 border-dashed p-4 rounded-xl text-center flex flex-col gap-1 items-center justify-center">
              <span className="text-slate-700 text-[11px] font-black">الكمية المتبقية</span>
              <span className="text-[#ea580c] text-sm font-black mt-1">{remaining} <span className="text-[10px] text-slate-400">لتر</span></span>
            </div>
            
          </div>

          <div className="flex items-center gap-2 mb-2 w-full">
            <div className="flex-1 bg-white rounded-full h-1.5 relative border border-slate-200 shadow-md overflow-hidden">
              <div className="bg-[#2563eb] h-full rounded-full absolute right-0" style={{ width: `${Math.min(100, (quantity / totalQuantity) * 100)}%` }}></div>
            </div>
            <span className="text-blue-600 text-[10px] font-bold whitespace-nowrap" dir="ltr">% {(Math.min(100, (quantity / totalQuantity) * 100)).toFixed(2)}</span>
          </div>
          <div className="text-center mb-4 text-slate-400 text-[10px] font-bold">
            تم تلبية {quantity.toLocaleString('en-US', {minimumFractionDigits: 2})} لتر من أصل {totalQuantity.toLocaleString('en-US', {minimumFractionDigits: 2})} لتر
          </div>

          <div className="bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-3 rounded-xl flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mr-4">
              <Check className="w-3 h-3" strokeWidth={3} />
            </div>
            <span className="text-blue-600 text-[10px] font-bold w-full text-right leading-tight">{remaining} لتر ستُضاف كرصيد مستحق، يمكن استخدام هذا الرصيد في طلبات التوريد القادمة تلقائياً</span>
          </div>
        </div>
      )}
    </div>
  );
}
