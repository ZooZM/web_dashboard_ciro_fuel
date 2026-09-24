import { useNavigate } from 'react-router-dom';

interface MonthlyData {
  label: string;
  paid: number;
  due: number;
}

interface InvoicesSectionProps {
  dueTotal?: number;
  paidTotal?: number;
  overallTotal?: number;
  monthlyData?: MonthlyData[];
}

const DEFAULT_CHART_DATA: MonthlyData[] = [
  { label: 'يناير', paid: 60, due: 70 },
  { label: 'فبراير', paid: 50, due: 60 },
  { label: 'مارس', paid: 75, due: 85 },
  { label: 'أبريل', paid: 65, due: 68 },
  { label: 'مايو', paid: 85, due: 90 },
  { label: 'يونيو', paid: 55, due: 65 },
  { label: 'يوليو', paid: 95, due: 98 },
  { label: 'أغسطس', paid: 70, due: 75 },
  { label: 'سبتمبر', paid: 85, due: 88 },
  { label: 'أكتوبر', paid: 60, due: 65 },
  { label: 'نوفمبر', paid: 85, due: 90 },
  { label: 'ديسمبر', paid: 95, due: 100 },
];

export function InvoicesSection({
  dueTotal = 62160,
  paidTotal = 62160,
  overallTotal = 62160,
  monthlyData = DEFAULT_CHART_DATA,
}: InvoicesSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black text-slate-800">الفواتير و المدفوعات</h2>
        <button 
          onClick={() => navigate('/transport/invoices')}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
        >
          عرض الكل
        </button>
      </div>

      {/* Due / Paid / Total summary blocks */}
      <div className="flex gap-3 w-full mb-6">
        <div className="flex-1 bg-[#FEE2E2]/60 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium text-slate-500 mb-0.5">المستحق</span>
          <span className="text-[13px] font-black text-[#EF4444]">{dueTotal.toLocaleString()} <span className="font-bold text-[10px]">ر.س</span></span>
        </div>
        <div className="flex-1 bg-[#D1FAE5]/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium text-slate-500 mb-0.5">المسدد</span>
          <span className="text-[13px] font-black text-[#12A150]">{paidTotal.toLocaleString()} <span className="font-bold text-[10px]">ر.س</span></span>
        </div>
        <div className="flex-1 bg-slate-100 rounded-xl p-3 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium text-slate-500 mb-0.5">إجمالي الفواتير</span>
          <span className="text-[13px] font-black text-[#1e293b]">{overallTotal.toLocaleString()} <span className="font-bold text-[10px]">ر.س</span></span>
        </div>
      </div>

      {/* Legend + Filter */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[3px] bg-[#FCA5A5]" /> مستحقة</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-[3px] bg-[#A78BFA]" /> مسددة</div>
        </div>
        <div className="flex items-center gap-2 bg-slate-100/80 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors">
          <span className="text-[11px] font-bold text-blue-600">آخر سنة</span>
          <img src="/transportCompany/home/chevronDown.svg" className="w-3 h-3 opacity-80" style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(87%) saturate(2250%) hue-rotate(209deg) brightness(97%) contrast(93%)' }} />
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 flex mt-auto min-h-[144px] h-[144px] relative w-full">
        
        {/* Y Axis (Fixed on right) */}
        <div className="absolute right-0 top-0 bottom-6 w-8 flex flex-col justify-between text-[9px] font-semibold text-slate-500 text-right pr-2 bg-white z-20">
          <span>2.4 م</span>
          <span>1.6 م</span>
          <span>0.8 م</span>
          <span>0</span>
        </div>

        {/* Scrollable Chart Area */}
        <div className="flex-1 h-full mr-8 overflow-x-auto overflow-y-hidden relative scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
           <div className="min-w-[400px] w-full h-[144px] relative">
              
              {/* Grid lines */}
              <div className="absolute left-0 right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-dashed border-slate-200" />
                <div className="w-full border-t border-slate-200" />
              </div>

              {/* Bars */}
              <div className="absolute left-0 right-0 top-0 bottom-0 flex items-end justify-between px-2">
                {monthlyData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 h-full justify-end w-full max-w-[20px] group cursor-pointer shrink-0">
                    <div className="flex items-end gap-[1px] h-[calc(100%-24px)] w-full relative z-10">
                      <div className="flex-1 bg-[#A78BFA] rounded-t-sm transition-all group-hover:opacity-80" style={{ height: `${data.paid}%` }} />
                      <div className="flex-1 bg-[#FCA5A5] rounded-t-sm transition-all group-hover:opacity-80" style={{ height: `${data.due}%` }} />
                    </div>
                    <span className="text-[8px] font-bold text-slate-500 -rotate-45 -ml-1 whitespace-nowrap h-4">{data.label}</span>
                  </div>
                ))}
              </div>
              
           </div>
        </div>
      </div>

      {/* Footer Button */}
      <button 
        onClick={() => navigate('/transport/invoices')}
        className="w-full mt-6 py-3 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:bg-slate-50 transition-colors"
      >
        <span className="text-[11px]">إدارة الفواتير</span>
        <img src="/transportCompany/home/invoice.svg" className="w-4 h-4" style={{ filter: 'brightness(0) saturate(100%) invert(32%) sepia(87%) saturate(2250%) hue-rotate(209deg) brightness(97%) contrast(93%)' }} />
      </button>

    </div>
  );
}
