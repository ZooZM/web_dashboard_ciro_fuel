import { Star } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

export function DesktopDriversTable({ drivers }: { drivers: any[] }) {
  const navigate = useNavigate();
  return (
    <div className="hidden lg:block overflow-hidden w-[100%]">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#f8f9fa] hover:bg-[#f8f9fa] w-full">
            <TableHead className="font-bold text-slate-700 text-[12px] text-right py-3 pr-4 pl-2">السائق</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">رقم الجوال</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">الشاحنة</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">السعة (لتر)</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">التقييم</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">رحلات الشهر</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">آخر شحنة</TableHead>
            <TableHead className="font-bold text-slate-700 text-[12px] text-center py-3 px-2">الحالة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((driver, idx) => (
            <TableRow 
              key={idx}
              onClick={() => navigate(`/transport/drivers/${driver.id}`)}
              className="hover:bg-slate-50 border-b border-slate-100 last:border-0 cursor-pointer transition-colors"
            >
              {/* Driver */}
              <TableCell className="align-middle py-3 pr-4 pl-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                    <img src={driver.avatar} alt={driver.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[#162155] font-black text-[13px] whitespace-nowrap">{driver.name}</span>
                    <span className="text-slate-400 font-bold text-[10px]">{driver.id}</span>
                  </div>
                </div>
              </TableCell>

              {/* Phone */}
              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-500 font-bold text-[12px]">{driver.phone}</span>
              </TableCell>

              {/* Truck */}
              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-500 font-bold text-[12px]">{driver.truck}</span>
              </TableCell>

              {/* Capacity */}
              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-[#162155] font-black text-[12px]">{driver.capacity}</span>
              </TableCell>

              {/* Rating */}
              <TableCell className="align-middle text-center py-3 px-2">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[#162155] font-black text-[12px]">{driver.rating}</span>
                  <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                </div>
              </TableCell>

              {/* Trips */}
              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-500 font-bold text-[12px]">{driver.tripsMonth}</span>
              </TableCell>

              {/* Last Shipment */}
              <TableCell className="align-middle text-center py-3 px-2">
                <span className="text-slate-500 font-bold text-[11px] whitespace-nowrap">{driver.lastShipment}</span>
              </TableCell>

              {/* Status */}
              <TableCell className="align-middle text-center py-3 px-2">
                <div className="inline-flex items-center justify-center gap-1.5 bg-[#DCFCE7] px-3 py-1 rounded-full">
                  <span className="text-[#16A34A] text-[10px] font-bold whitespace-nowrap">{driver.status}</span>
                </div>
              </TableCell>

    
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
