import { useNavigate } from 'react-router-dom';

export function MobileOrderTrackingList({ orders }: { orders: any[] }) {
  const navigate = useNavigate();

  return (
    <div className="lg:hidden flex flex-col gap-4 mt-4">
      {orders.map((order) => (
        <div 
          key={`mobile-${order.id}`} 
          className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-4"
        >
          {/* Header: Order Num & Status */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="text-slate-800 font-bold text-sm">{order.id}</span>
            <div className="inline-flex items-center gap-1.5 bg-[#E6F4EA] px-2.5 py-1 rounded-full">
              <div className="relative flex h-1.5 w-1.5 shrink-0">
                {order.status === 'جديد' && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                )}
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16A34A]"></span>
              </div>
              <span className="text-[#16A34A] text-[10px] font-bold">{order.status}</span>
            </div>
          </div>
          
          {/* Company, Owner & Fuel Info */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={order.companyLogo} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-slate-900 font-black text-[13px]">{order.companyName}</span>
                <span className="text-slate-500 text-[11px] font-medium">{order.station}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="bg-[#FFF3E0] text-[#E65100] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                {order.fuelType}
              </span>
              <span className="text-slate-600 font-bold text-[11px]">{order.fuelQuantity}</span>
            </div>
          </div>
          
          {/* Locations (From -> To) */}
          <div className="flex flex-col bg-[#F8FAFC] border border-slate-100 rounded-xl p-3 gap-2 border border-[#E7E9EF] rounded-2xl">
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
              <span className="text-slate-700 text-[12px] font-semibold leading-tight">{order.loadLocation}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
              <span className="text-slate-700 text-[12px] font-semibold leading-tight">{order.deliveryLocation}</span>
            </div>
          </div>
          
          {/* Driver, Date & Prices Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2 border-t border-slate-100">
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] mb-1">الناقل</span>
              <span className="text-slate-800 font-bold text-[12px]">{order.transporter}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400 text-[10px] mb-1">موعد التسليم</span>
              <span className="text-slate-800 font-bold text-[12px]">{order.deliveryTimeDay}</span>
              <span className="text-slate-500 text-[11px] mt-0.5">{order.deliveryTimeHour}</span>
            </div>
            {/* Commission and Invoice */}
            <div className="flex flex-col col-span-2 gap-2">
              <div className="flex items-center justify-between bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                <span className="text-slate-500 text-[11px]">عمولة المنصة</span>
                <span className="text-blue-600 font-black text-[13px]">{order.commission} ر.س</span>
              </div>
              <div className="flex items-center justify-between bg-green-50/50 p-2 rounded-lg border border-green-100/50">
                <span className="text-slate-500 text-[11px]">فاتورة الوقود</span>
                <span className="text-green-600 font-black text-[13px]">{order.invoice} ر.س</span>
              </div>
            </div>
          </div>
          
        </div>
      ))}
    </div>
  );
}
