import { useState } from 'react';
import { Check } from 'lucide-react';

interface TransportCompanyCardProps {
  onEdit?: () => void;
}

export function TransportCompanyCard({ onEdit }: TransportCompanyCardProps) {
  const [selectedTanks, setSelectedTanks] = useState<string[]>([]);

  const toggleTank = (tank: string) => {
    if (!selectedTanks.includes(tank)) {
      setSelectedTanks([tank]);
    }
    else{
      setSelectedTanks([]);
    }
  };

  return (
    <div className="bg-white border-t-4 border-[#2563EB] rounded-[24px] p-6 shadow-sm relative">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <img src="/petrolCompany/orderDetails/truck.svg" alt="" className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-[#162155]">الشركة الناقلة</h2>
        </div>
        <button 
          onClick={onEdit}
          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors" 
        > 
          <img src="/petrolCompany/orderDetails/edit.svg" alt="" className="w-5 h-5" />
        </button>
      </div>

      {/* Company Info */}
      <div className="flex flex-col items-center justify-center gap-2 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#2563EB] flex items-center justify-center shadow-sm">
          <img src="/transportCompany/orderPage/orderDetails/truck.svg" alt="" className="w-6 h-6 brightness-0 invert" />
        </div>
        <h3 className="text-lg font-black text-[#162155] mt-1">شركة النقل المتحدة</h3>
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 text-sm font-semibold">رقم الجوال</span>
          <span className="text-[#2563EB] text-sm font-bold" dir="ltr">05xxxxxxxx</span>
        </div>
      </div>

      <div className="w-full h-px bg-slate-100 mb-6"></div>

      {/* Tank Type */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center gap-1 mb-4">
          <h4 className="text-[15px] font-black text-[#162155]">نوع التانك المطلوب</h4>
          <span className="text-red-500 font-bold">*</span>
        </div>
        
        <div className="flex w-full gap-4">
          <div 
            onClick={() => toggleTank('aluminum')}
            className={`relative flex-1 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              selectedTanks.includes('aluminum')
                ? 'border border-[#2563EB] bg-[#EFF6FF]' 
                : 'border border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            {selectedTanks.includes('aluminum') && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              selectedTanks.includes('aluminum') ? 'bg-[#2563EB]' : 'bg-slate-100'
            }`}>
              <img src="/petrolCompany/orderDetails/aluminum.svg" alt="" className={`w-7 h-7 object-contain transition-all` } />
            </div>
            <span className={'text-sm font-bold transition-colors'}>ألومنيوم</span>
          </div>
          
          <div 
            onClick={() => toggleTank('iron')}
            className={`relative flex-1 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              selectedTanks.includes('iron')
                ? 'border border-[#2563EB] bg-[#EFF6FF]' 
                : 'border border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            {selectedTanks.includes('iron') && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-[#2563EB] rounded-full flex items-center justify-center shadow-sm">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
            )}
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${
              selectedTanks.includes('iron') ? 'bg-[#2563EB]' : 'bg-slate-100'
            }`}>
              <img src="/petrolCompany/orderDetails/iron.svg" alt="" className={`w-7 h-7 object-contain transition-all`} />
            </div>
            <span className={`text-sm font-bold transition-colors`}>حديد</span>
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-slate-100 mb-6"></div>

      {/* Operations Manager */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
            <img src="/petrolCompany/orderDetails/profile.jpg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[#162155] font-black text-base">أحمد السبيعي</span>
            <span className="text-slate-500 text-[11px] font-bold mt-0.5">مدير العمليات</span>
          </div>
        </div>
        <button className="w-12 h-12 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
          <img src="/transportCompany/orderPage/orderDetails/phone.svg" alt="" className="w-5 h-5 text-[#2563EB]" />
        </button>
      </div>

      <div className="w-full h-px bg-slate-100 mb-6"></div>

      {/* Financials */}
      <div className="flex items-center justify-between px-2 pb-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-400 text-xs font-bold mb-1">الكمية</span>
          <span className="text-[#162155] font-black text-[22px] leading-none">20,000</span>
          <span className="text-[#2563EB] text-[11px] font-bold mt-1">لتر</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-400 text-xs font-bold mb-1">أجرة النقل / لتر</span>
          <span className="text-[#162155] font-black text-[22px] leading-none">0.02</span>
          <span className="text-[#2563EB] text-[11px] font-bold mt-1">ر.س / لتر</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-slate-400 text-xs font-bold mb-1">أجرة النقل</span>
          <span className="text-[#162155] font-black text-[22px] leading-none">400</span>
          <span className="text-[#2563EB] text-[11px] font-bold mt-1">ر.س</span>
        </div>
      </div>

    </div>
  );
}
