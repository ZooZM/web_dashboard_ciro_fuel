import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: string;
  trend: string;
  trendUp?: boolean;
  valueColor?: string;
  iconBgClass?: string;
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  trendUp = true,
  valueColor = 'text-[#1e293b]',
  iconBgClass = 'bg-slate-50',
}: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col min-h-[130px] h-auto shadow-sm hover:shadow-md transition-shadow">

      {/* Top row: Icon left, Title right */}
      <div className="flex items-center justify-between mb-2">
        <div className={cn('w-9 h-9 shrink-0 flex items-center justify-center rounded-full', iconBgClass)}>
          <img src={icon} alt="" className="w-5 h-5 object-contain" />
        </div>
        <span className="text-[12px] font-semibold text-[#64748b] text-right">{title}</span>
      </div>

      {/* Value */}
      <div className="flex items-baseline justify-end gap-1" dir="rtl">
        <span className={cn('text-[20px] font-black leading-tight', valueColor)}>{value}</span>
        {unit && <span className="text-[11px] font-bold text-[#64748b]">{unit}</span>}
      </div>

      {/* Bottom: trend + label */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <div className={cn('flex items-center gap-1 text-[11px] font-bold', trendUp ? 'text-[#12A150]' : 'text-[#EF4444]')}>
          <img src={trendUp ? '/home/chevronTop.svg' : '/home/chevronDown.svg'} className="w-3 h-3" alt="Trend" />
          <span dir="ltr">{trend}</span>
        </div>
        <span className="text-[10px] text-[#94a3b8]">من الأسبوع الماضي</span>
      </div>

    </div>
  );
}
