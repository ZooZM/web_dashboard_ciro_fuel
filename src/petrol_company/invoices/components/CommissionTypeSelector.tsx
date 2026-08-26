import { cn } from '@/lib/utils';

interface CommissionTypeSelectorProps {
  value: 'per_riyal' | 'percentage';
  onChange: (value: 'per_riyal' | 'percentage') => void;
  percentageLabel?: string;
  perRiyalLabel?: string;
}

export function CommissionTypeSelector({ 
  value, 
  onChange,
  percentageLabel = 'النسبة من كل فاتورة',
  perRiyalLabel = 'كام ريال لكل ريال سعودي'
}: CommissionTypeSelectorProps) {
  return (
    // إضافة dir="rtl" لضمان بقاء القسم الأول على اليمين دائمًا
    <div dir="rtl" className="flex items-center justify-between border border-[#E7E9EF] rounded-xl p-2 px-4 mt-2">
      
      {/* القسم الأول: النص والأيقونة */}
      <div className="flex items-center gap-3 flex-1">
        {/* تم نقل النص ليكون قبل الأيقونة ليظهر على أقصى اليمين */}
        {value === 'percentage' ? (
          <img src="/blue-percentage-icon.svg" alt="" className="w-6 h-6 object-contain" />
        ) : (
          <img src="/petrolCompany/invoice/dollar.svg" alt="" className="w-6 h-6 object-contain" />
        )}
        <span className="text-sm font-medium text-slate-500">
          {value === 'percentage' ? percentageLabel : perRiyalLabel}
        </span>

      </div>

      {/* القسم الثاني: أزرار التبديل */}
      <div className="flex items-center gap-1 bg-[#F8FAFC] rounded-lg p-1 border border-[#E7E9EF]">
        <button
          onClick={() => onChange('percentage')}
          className={cn("px-4 py-1.5 rounded-md text-xs flex items-center gap-1.5 font-bold transition-colors", value === 'percentage' ? "bg-[#1E5FFF] text-white shadow-sm" : "bg-white text-slate-500 hover:text-slate-700")}
        >
          <img src={value === 'percentage' ? "/white-percentage-icon.svg" : "/blue-percentage-icon.svg"} alt="" className="w-4 h-4 object-contain" />
          نسبة
        </button>
        <button
          onClick={() => onChange('per_riyal')}
          className={cn("px-4 py-1.5 rounded-md text-xs flex items-center gap-1.5 font-bold transition-colors", value === 'per_riyal' ? "bg-[#1E5FFF] text-white shadow-sm" : "bg-white text-slate-500 hover:text-slate-700")}
        >
          {value === 'per_riyal' ? (
            <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8H6.5C6.83333 8 7.5 7.8 7.5 7C7.5 6.2 6.83333 6 6.5 6H5.5C5.16667 6 4.5 5.8 4.5 5C4.5 4.2 5.16667 4 5.5 4H6M6 8H4.5M6 8V9M7.5 4H6M6 4V3M10.5 6C10.5 8.48528 8.48528 10.5 6 10.5C3.51472 10.5 1.5 8.48528 1.5 6C1.5 3.51472 3.51472 1.5 6 1.5C8.48528 1.5 10.5 3.51472 10.5 6Z" stroke="#E7EEFF" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <img src="/petrolCompany/invoice/dollar.svg" alt="" className="w-4 h-4 object-contain" />
          )}
          لكل ريال
        </button>
      </div>
      
    </div>
  );
} 