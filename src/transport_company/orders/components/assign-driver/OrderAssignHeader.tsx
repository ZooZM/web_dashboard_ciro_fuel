import { ChevronRight } from 'lucide-react';

export function OrderAssignHeader() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center text-slate-500 text-sm font-medium mb-4 gap-2">
        <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center shadow-lg cursor-pointer" onClick={() => window.history.back()}>
          <ChevronRight className="w-5 h-5 font-bold" />
        </div>
        <span className="flex items-center gap-2 text-slate-400 cursor-pointer" onClick={() => window.history.back()}>الطلبات</span>
        <span className="text-slate-400">/</span>
        <span className="text-slate-400 cursor-pointer" onClick={() => window.history.back()}>ORD-2024-256</span>
        <span className="text-slate-400">/</span>
        <span className="text-[#162155] font-bold">إسناد السائق</span>
      </div>

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center mb-6">
        <div className="flex-1 w-full">
           <h1 className="text-2xl font-black text-slate-900">إسناد الطلب – ORD-2024-256</h1>
        </div>
      </div>
    </>
  );
}
