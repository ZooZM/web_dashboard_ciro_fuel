import { ChevronRight, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export function AdminOrderHeader() {
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
        <div className="flex-1 w-full flex items-center justify-between">
           <h1 className="text-2xl font-black text-slate-900">تفاصيل الطلب – ORD-2024-256</h1>
           <button className="flex justify-center items-center gap-2 bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">
            <X className="w-4 h-4 shrink-0" />
            إنهاء الطلب
          </button>
        </div>
      </div>
    </>
  );
}
