import { Check } from 'lucide-react';

export function AssignSelectionCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
      
      {/* Selected Items & Note (Right Side) */}
      <div className="flex flex-col flex-1 items-start gap-3 w-full">
        <div className="flex items-center flex-wrap justify-start gap-3 w-full">
          
          {/* Unselected Driver */}
          <div className="flex items-center justify-between gap-4 bg-white border border-slate-300 border-dashed rounded-xl px-4 py-3 min-w-[160px]">
            <img src="/transportCompany/orderPage/AssignPage/driver.svg" alt="" className="w-5 h-5 shrink-0" />
            <span className="text-[#162155] font-black text-sm">لم يتم الاختيار</span>
          </div>

          {/* Link Icon */}
          <div className="shrink-0 flex items-center justify-center">
            <img src="/transportCompany/orderPage/AssignPage/link.svg" alt="" className="w-5 h-5" />
          </div>

          {/* Selected Truck */}
          <div className="flex items-center justify-between gap-4 bg-[#EEF2FF] border border-blue-400 rounded-xl px-4 py-3 min-w-[140px]">
            <img src="/transportCompany/orderPage/AssignPage/truck.svg" alt="" className="w-5 h-5 shrink-0" />
            <span className="text-[#162155] font-black text-sm">ABC-1234</span>
          </div>

          {/* Link Icon */}
          <div className="shrink-0 flex items-center justify-center">
            <img src="/transportCompany/orderPage/AssignPage/link.svg" alt="" className="w-5 h-5" />
          </div>

          {/* Selected Tank */}
          <div className="flex items-center justify-between gap-4 bg-[#EEF2FF] border border-blue-400 rounded-xl px-4 py-3 min-w-[140px]">
            <img src="/transportCompany/orderPage/AssignPage/drop.svg" alt="" className="w-5 h-5 shrink-0" />
            <span className="text-[#162155] font-black text-sm">TNK-0231</span>
          </div>

        </div>

        <span className="text-slate-400 text-xs font-semibold text-right w-full mt-1">
          ملحوظة: عند اختيار سائق، يتم تحديد معه أخر شاحنة و تانك كانت معه، و يمكن اختيار غيرها في حال كانت غير متاحة
        </span>
      </div>

      {/* Action Button (Left Side) */}
      <div className="shrink-0">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
          <span>تأكيد الإسناد</span>
          <Check className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
