import { ChevronRight, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export function OrderHeader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center text-slate-500 text-sm font-medium mb-4 gap-2">
        <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg cursor-pointer" onClick={() => window.history.back()}>
          <ChevronRight className="w-5 h-5 font-bold" />
        </div>
        <span className="flex items-center gap-2 text-slate-400 cursor-pointer" onClick={() => window.history.back()}>الطلبات</span>
        <span className="text-slate-400">/</span>
        <span className="text-[#162155] font-bold">ORD-2024-256</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center mb-6">
        <div className="flex-1 w-full">
           <h1 className="text-2xl font-black text-slate-900">تفاصيل الطلب – ORD-2024-256</h1>
        </div>
        
        <div className="w-full lg:w-[350px] shrink-0 flex items-center gap-3">
          <button className="flex-1 flex justify-center items-center gap-1.5 bg-[#FEE2E2] text-red-600 py-2.5 rounded-xl text-sm font-bold hover:bg-red-200 transition-colors" onClick={() => window.history.back()}>
            <X className="w-4 h-4 shrink-0" />
            رفض
          </button>
          <button 
            onClick={() => navigate(`/transport/orders/${id}/edit`)}
            className="flex-1 flex justify-center items-center gap-1.5 bg-white border border-slate-200 text-blue-600 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
          >
            <img src="/transportCompany/orderPage/orderDetails/edit.svg" alt="" className="w-4 h-4 shrink-0" />
            تعديل
          </button>
          <button 
            onClick={() => navigate(`/transport/orders/${id}/assign`)}
            className="flex-[1.8] flex justify-center items-center gap-1.5 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm px-2"
          >
            <img src="/transportCompany/orderPage/orderDetails/whiteRightCheck.svg" alt="" className="w-5 h-5 shrink-0" />
            <span className="">قبول و إسناد سائق</span>
          </button>
        </div>
      </div>
    </>
  );
}
