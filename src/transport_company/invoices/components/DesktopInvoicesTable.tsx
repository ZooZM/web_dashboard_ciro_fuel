import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DesktopInvoicesTable({ invoices }: { invoices: any[] }) {
  return (
    <div className="hidden lg:block overflow-hidden w-[100%]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full border-b border-slate-100">
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-4 pr-6 pl-2 min-w-[100px]">رقم الفاتورة</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-4 px-2 min-w-[100px]">الطلب</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-4 px-2 min-w-[120px]">الشركة</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2 min-w-[160px]">المحطة</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2 min-w-[100px]">أجرة التوصيل<br/><span className="text-[10px] text-slate-400 font-normal">(ر.س)</span></TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2 min-w-[100px]">المبلغ<br/><span className="text-[10px] text-slate-400 font-normal">(ر.س)</span></TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2 min-w-[120px]">تاريخ الإصدار</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 px-2 min-w-[100px]">حالة</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-4 pl-6 pr-2 min-w-[80px]">تصدير</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, idx) => (
            <TableRow 
              key={idx} 
              className="hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
            >
              {/* رقم الفاتورة */}
              <TableCell className="align-middle py-4 pr-6 pl-2">
                <span className="text-slate-500 font-medium text-[12px] whitespace-nowrap">{invoice.invoiceNum}</span>
              </TableCell>
              
              {/* الطلب */}
              <TableCell className="align-middle py-4 px-2 text-right">
                <span className="text-slate-500 font-medium text-[12px] whitespace-nowrap">{invoice.orderNum}</span>
              </TableCell>
              
              {/* الشركة */}
              <TableCell className="align-middle py-4 px-2 text-right">
                <span className="text-slate-800 font-bold text-[12px] whitespace-nowrap">{invoice.company}</span>
              </TableCell>

              {/* المحطة */}
              <TableCell className="align-middle py-4 px-2 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-slate-400 text-[11px] text-center max-w-[140px] leading-tight">{invoice.station}</span>
                  <span className="text-slate-800 font-bold text-[12px] mt-0.5 text-center leading-tight">{invoice.owner}</span>
                </div>
              </TableCell>

              {/* أجرة التوصيل */}
              <TableCell className="align-middle text-center py-4 px-2">
                <span className="text-[#162155] font-black text-[13px]">{invoice.deliveryFee}</span>
              </TableCell>

              {/* المبلغ */}
              <TableCell className="align-middle text-center py-4 px-2">
                <span className="text-[#162155] font-black text-[13px]">{invoice.amount}</span>
              </TableCell>

              {/* تاريخ الإصدار */}
              <TableCell className="align-middle text-center py-4 px-2">
                <div className="flex items-center justify-center gap-1.5" dir="ltr">
                  <span className="text-slate-500 text-[11px] whitespace-nowrap">{invoice.issueDate}</span>
                  <span className="text-slate-500 text-[11px] whitespace-nowrap">{invoice.issueTime}</span>
                </div>
              </TableCell>

              {/* حالة */}
              <TableCell className="align-middle text-center py-4 px-2">
                <div className="flex justify-center">
                  {invoice.status === 'مدفوع' ? (
                    <span className="bg-[#DCFCE7] text-[#16A34A] px-4 py-1 rounded-full text-[11px] font-bold whitespace-nowrap">
                      مدفوع
                    </span>
                  ) : (
                    <span className="bg-[#FFEDD5] text-[#EA580C] px-4 py-1 rounded-full text-[11px] font-bold whitespace-nowrap">
                      مستحق
                    </span>
                  )}
                </div>
              </TableCell>

              {/* تصدير */}
              <TableCell className="align-middle text-center py-4 pl-6 pr-2">
                <button className="p-1 hover:bg-slate-100 rounded-md transition-colors">
                  <img src="/transportCompany/invoicePage/blueDownload.svg" alt="تصدير" className="w-5 h-5" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
