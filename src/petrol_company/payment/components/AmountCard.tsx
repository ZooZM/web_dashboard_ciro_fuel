import { cn } from '@/lib/utils';
import { Plus, Minus } from 'lucide-react';

interface AmountCardProps {
  amountType: 'full' | 'partial';
  setAmountType: (type: 'full' | 'partial') => void;
  partialAmount: number;
  setPartialAmount: React.Dispatch<React.SetStateAction<number>>;
  totalAmount: number;
}

export function AmountCard({ 
  amountType, 
  setAmountType, 
  partialAmount, 
  setPartialAmount, 
  totalAmount 
}: AmountCardProps) {
  return (
    <div className="bg-white border border-[#E7E9EF] rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-3 w-full">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
           <img src="/petrolCompany/invoice/dollar.svg" alt="" className="w-4 h-4 object-contain" />
        </div>
        <span className="text-[#162155] font-black text-lg">المبلغ المطلوب</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[#858C95] font-bold text-sm">المبلغ المستحق</span>
        <div className="flex items-center gap-1" dir="ltr">
           <span className="font-black text-[28px] text-[#162155] tracking-tight">
             {amountType === 'full' 
                ? totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                : partialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
           </span>
           <span className="font-bold text-sm text-[#858C95] mt-1.5" dir="rtl">ر.س</span>
        </div>
      </div>

      <div className="w-full bg-[#F8FAFC] rounded-2xl p-1 flex items-center relative border border-[#E7E9EF]">
        <button 
          onClick={() => setAmountType('full')}
          className={cn("flex-1 py-3 text-sm font-bold rounded-xl transition-all z-10", amountType === 'full' ? "bg-white shadow-sm text-[#162155] border border-[#E7E9EF]" : "text-[#858C95] hover:text-[#162155] border border-transparent")}
        >
          دفع المستحق كامل
        </button>
        <button 
          onClick={() => setAmountType('partial')}
          className={cn("flex-1 py-3 text-sm font-bold rounded-xl transition-all z-10", amountType === 'partial' ? "bg-white shadow-sm text-[#162155] border border-[#E7E9EF]" : "text-[#858C95] hover:text-[#162155] border border-transparent")}
        >
          دفع جزء من المبلغ
        </button>
      </div>

      {amountType === 'partial' && (
        <div className="flex flex-col gap-4 mt-2 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between border border-[#E7E9EF] rounded-xl p-2 h-14">
            <button 
              onClick={() => setPartialAmount(prev => Math.max(0, prev - 1000))}
              className="w-10 h-10 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#858C95] hover:bg-slate-100 transition-colors shrink-0"
            >
              <Minus className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center flex-1">
              <span className="font-black text-sm text-[#162155] leading-tight" dir="ltr">
                {partialAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[#858C95] text-[10px] font-bold">ر.س</span>
            </div>

            <button 
              onClick={() => setPartialAmount(prev => Math.min(totalAmount, prev + 1000))}
              className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shrink-0"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-[#FFF8F3] border border-orange-300 border-dashed rounded-xl p-4 flex items-center justify-between">
            <span className="text-[#858C95] font-bold text-sm">سيتبقى بعد هذه الدفعة</span>
            <div className="flex items-center gap-1" dir="ltr">
              <span className="text-orange-500 font-black text-sm">
                {(totalAmount - partialAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-[#858C95] font-bold text-xs mt-0.5" dir="rtl">ر.س</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
