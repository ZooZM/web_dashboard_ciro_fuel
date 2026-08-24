import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function DesktopOrdersTable({ orders }: { orders: any[] }) {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block overflow-hidden w-[100%]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full">
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 pr-4 pl-2 min-w-[90px]">رقم الطلب</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 px-2 min-w-[120px]">المالك</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 px-2 min-w-[100px]">المحطة</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[100px]">الوقود / الكمية</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[140px]">موقع التحميل &larr; التسليم</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[100px]">الناقل</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[100px]">موعد التسليم</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[80px]">الحالة</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2 min-w-[90px]">إجمالي العمولة (ر.س)</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 pl-4 pr-2 min-w-[100px]">فاتورة الوقود (ر.س)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow 
              key={order.id} 
              onClick={() => navigate(`/petrolCompany/orders/${order.id}`)}
              className="hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer transition-colors"
            >
              {/* رقم الطلب */}
              <TableCell className="align-middle py-3 pr-4 pl-2">
                <span className="text-slate-800 font-bold text-[12px] whitespace-nowrap">{order.num}</span>
              </TableCell>
              
              {/* المالك */}
              <TableCell className="align-middle py-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img src="/transportCompany/orderPage/orderDetails/profile.png" alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-slate-900 font-bold text-[12px] whitespace-nowrap">{order.owner}</span>
                </div>
              </TableCell>
              
              {/* المحطة */}
              <TableCell className="align-middle py-3 px-2">
                <span className="text-slate-800 font-bold text-[12px] whitespace-nowrap">{order.station}</span>
              </TableCell>
              
              {/* الوقود / الكمية */}
              <TableCell className="align-middle text-center py-3 px-2">
                <div className="flex flex-col items-center gap-1">
                  <span className="bg-[#FFEDD5] text-[#EA580C] px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap">
                    {order.fuel}
                  </span>
                  <span className="text-slate-600 font-bold text-[11px] whitespace-nowrap">{order.fuelLiters}</span>
                </div>
              </TableCell>

              {/* موقع التحميل <- التسليم */}
              <TableCell className="align-middle text-center py-3 px-2">
                <div className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-[11px] text-center max-w-[120px] leading-tight">{order.locationFrom}</span>
                  <img src="/transportCompany/orderPage/arrowDown.svg" alt="" className="w-3 h-3 my-0.5 opacity-60" />
                  <span className="text-slate-400 text-[10px] text-center max-w-[120px] leading-tight">{order.locationTo}</span>
                </div>
              </TableCell>

              {/* الناقل */}
              <TableCell className="align-middle text-center py-3 px-2">
                <div className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-[11px] text-center leading-tight max-w-[80px]">{order.transporter}</span>
                </div>
              </TableCell>

              {/* موعد التسليم */}
              <TableCell className="align-middle text-center py-3 px-2">
                <div className="flex flex-col items-center">
                  <span className="text-slate-800 font-bold text-[11px] whitespace-nowrap">{order.timeDate}</span>
                  <span className="text-slate-400 text-[10px] mt-0.5 whitespace-nowrap">{order.timeAmPm}</span>
                </div>
              </TableCell>

              {/* الحالة */}
              <TableCell className="align-middle text-center py-3 px-2">
                <div className="inline-flex items-center justify-center gap-1.5 bg-[#DCFCE7] px-2 py-1 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></div>
                  <span className="text-[#16A34A] text-[10px] font-bold whitespace-nowrap">{order.status}</span>
                </div>
              </TableCell>

              {/* إجمالي العمولة */}
              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-[#2563EB] font-black text-[12px]">{order.commission}</span>
              </TableCell>

              {/* فاتورة الوقود */}
              <TableCell className="align-middle text-center py-3 pl-4 pr-2">
                <span className="text-[#16A34A] font-black text-[12px]">{order.fuelInvoice}</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
