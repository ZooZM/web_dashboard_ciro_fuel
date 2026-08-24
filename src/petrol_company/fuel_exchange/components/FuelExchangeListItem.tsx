import { useNavigate } from 'react-router-dom';

interface FuelRequest {
  id: string;
  category: string;
  code: string;
  companyName: string;
  logo: string;
  fuelType: string;
  volume: string;
  price: string;
  total: string;
  time: string;
  clock: string;
  status: string;
}

interface FuelExchangeListItemProps {
  request: FuelRequest;
}

export function FuelExchangeListItem({ request }: FuelExchangeListItemProps) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/petrolCompany/fuel-exchange/${request.id}`)}
      className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-4 border border-slate-200 rounded-2xl hover:border-blue-200 hover:shadow-sm transition-all bg-white cursor-pointer"
    >

      {/* Logo & Info */}
      <div className="flex items-center gap-4 w-full xl:w-auto xl:min-w-[200px]">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 bg-white">
          <img src={request.logo} alt={request.companyName} className="w-full h-full object-contain p-1" />
        </div>
        <div className="flex flex-col">
          <span className="font-black text-slate-900">{request.companyName}</span>
          <span className="text-xs text-slate-500 font-bold mt-0.5">{request.code}</span>
        </div>
      </div>

      {/* Data Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full xl:w-auto bg-slate-50/50 rounded-xl p-3 border border-slate-100">
        <div className="flex flex-col items-center justify-center">
          <span className="text-sm font-black text-slate-900">{request.fuelType}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">نوع الوقود</span>
        </div>
        <div className="flex flex-col items-center justify-center md:border-r border-slate-200">
          <span className="text-sm font-black text-slate-900">{request.volume}</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">لتر</span>
        </div>
        <div className="flex flex-col items-center justify-center border-t md:border-t-0 md:border-r border-slate-200 pt-3 md:pt-0">
          <span className="text-sm font-black text-slate-900">{request.price} ر.س</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">سعر اللتر</span>
        </div>
        <div className="flex flex-col items-center justify-center md:border-r border-slate-200 border-t md:border-t-0 pt-3 md:pt-0">
          <span className="text-sm font-black text-slate-900">{request.total} ر.س</span>
          <span className="text-xs text-slate-500 mt-1 font-semibold">الإجمالي</span>
        </div>
      </div>

      {/* Date & Action */}
      <div className="flex items-center justify-between w-full xl:w-auto gap-8 xl:min-w-[200px]">
        <div className="flex flex-col items-start xl:items-end">
          <span className="text-sm font-bold text-slate-600">{request.time}</span>
          <span className="text-xs text-slate-400 font-bold mt-0.5">{request.clock}</span>
        </div>

        <div className="min-w-[110px] flex justify-end">
          {request.status === 'awaiting_response' && (
            <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold whitespace-nowrap">بانتظار الرد</span>
          )}
          {request.status === 'accepted' && (
            <span className="px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold whitespace-nowrap">مقبول</span>
          )}
          {request.status === 'accept_request' && (
            <button className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors whitespace-nowrap">
              <img src="/petrolCompany/requests/rightCheck.svg" alt="" className="w-4 h-4" />
              قبول الطلب
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
