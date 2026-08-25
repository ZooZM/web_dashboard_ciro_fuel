import { useNavigate, useParams } from 'react-router-dom';
import { FuelExchangeRequestData } from '@/petrol_company/fuel_exchange/components/FuelExchangeRequestData';
import { FuelExchangeContactInfo } from '@/petrol_company/fuel_exchange/components/FuelExchangeContactInfo';
import { MOCK_REQUESTS } from './AdminFuelExchangePage';

export function AdminFuelExchangeDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const request = MOCK_REQUESTS.find(r => r.id === id) || MOCK_REQUESTS[0];
  
  if (!request) {
    return null;
  }

  const isAccepted = request.status === 'accepted';

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/admin/fuel-exchange')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          الطلبات / {request.code}
        </span>
      </div>

      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm flex items-center justify-between">

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 p-1 shrink-0 bg-white">
            <img src={request.logo} alt={request.companyName} className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900">{request.companyName}</span>
            <span className="text-sm font-bold text-slate-400 mt-0.5">{request.code}</span>
          </div>
        </div>

        <div>
          {isAccepted ? (
            <span className="px-5 py-2.5 bg-[#DCFCE7] text-[#16A34A] rounded-xl text-sm font-bold flex items-center gap-2">
              مقبول
            </span>
          ) : (
            <span className="px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold flex items-center gap-2">
               بانتظار الرد
            </span>
          )}
        </div>

      </div>

      {/* Main Grid */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Right Column (Wider) - Request Data */}
        <div className="flex-1 w-full flex flex-col gap-6">
          <FuelExchangeRequestData isAccepted={isAccepted} />
        </div>

        {/* Left Column (Narrower) - Contact Info */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 self-start">
          <FuelExchangeContactInfo />
        </div>

      </div>
    </div>
  );
}
