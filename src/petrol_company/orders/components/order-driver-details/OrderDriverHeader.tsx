import { ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function OrderDriverHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Breadcrumb row */}
      <div className="flex items-center justify-start w-full">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
          <span className="text-slate-500 font-bold text-sm cursor-pointer" onClick={() => navigate(-1)}>الطلبات / ORD-2024-256 / <span className="text-slate-800">السائق</span></span>
        </div>
      </div>
    </div>
  );
}
