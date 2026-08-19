import { cn } from '@/lib/utils';

export function MobileInvoicesList({ invoices }: { invoices: any[] }) {
  return (
    <div className="flex flex-col gap-4 lg:hidden w-full">
      {invoices.map((invoice, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
          
          {/* Header: Status & Invoice Num */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-slate-500 font-bold text-sm">{invoice.invoiceNum}</span>
            {invoice.status === 'مدفوع' ? (
              <span className="bg-[#DCFCE7] text-[#16A34A] px-3 py-1 rounded-full text-[11px] font-bold">مدفوع</span>
            ) : (
              <span className="bg-[#FFEDD5] text-[#EA580C] px-3 py-1 rounded-full text-[11px] font-bold">مستحق</span>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-[10px] font-bold">الطلب</span>
              <span className="text-[#162155] font-bold text-xs">{invoice.orderNum}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-[10px] font-bold">الشركة</span>
              <span className="text-[#162155] font-bold text-xs">{invoice.company}</span>
            </div>
            
            <div className="flex flex-col gap-1 text-right col-span-2">
              <span className="text-slate-400 text-[10px] font-bold">المحطة</span>
              <span className="text-[#162155] font-bold text-xs">{invoice.station} - {invoice.owner}</span>
            </div>

            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-[10px] font-bold">أجرة التوصيل (ر.س)</span>
              <span className="text-[#162155] font-black text-sm">{invoice.deliveryFee}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-slate-400 text-[10px] font-bold">المبلغ (ر.س)</span>
              <span className="text-[#162155] font-black text-sm">{invoice.amount}</span>
            </div>

            <div className="flex flex-col gap-1 text-right col-span-2">
              <span className="text-slate-400 text-[10px] font-bold">تاريخ الإصدار</span>
              <div className="flex items-center gap-1.5" dir="ltr">
                 <span className="text-slate-600 font-bold text-xs">{invoice.issueDate}</span>
                 <span className="text-slate-600 font-bold text-xs">{invoice.issueTime}</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end pt-3 border-t border-slate-100 mt-1">
            <button className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
              <img src="/invoicePage/blueDownload.svg" alt="تصدير" className="w-4 h-4" />
              تصدير
            </button>
          </div>
          
        </div>
      ))}
    </div>
  );
}
