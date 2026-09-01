import { cn } from '@/lib/utils';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: string | React.ReactNode;
  // Feature 009: no period-over-period trend is computed by the platform's summary
  // endpoint (it would need a second, prior-period query) — optional, so a real figure
  // with nothing to compare against renders without a fabricated percentage.
  trend?: string;
  trendUp?: boolean;
  valueColor?: string;
  iconBgClass?: string;
  date?: string;
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
  date,
}: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col min-h-[100px] h-auto shadow-sm hover:shadow-md transition-shadow">
      
      {/* Top row: Icon left, Title right */}
      <div className="flex items-start justify-start gap-4 ">
        <div className={cn('w-9 h-9 shrink-0 flex items-center justify-center rounded-full', iconBgClass)}>
          {typeof icon === 'string' ? (
            <img src={icon} alt="" className="w-7 h-7 object-contain" />
          ) : (
            icon
          )}
      </div>
        {/* Value - centered */}

        <div className='flex flex-col'>
        <span className="text-[12px] font-semibold text-[#64748b] text-right">{title}</span>
          <div className=" items-baseline justify-start gap-1 flex-1" dir="rtl">
            <span className={cn('text-[22px] font-black leading-tight', valueColor)}>{value}</span>
            {unit && <span className="text-[11px] font-bold text-[#64748b]">{unit}</span>}
      </div>

          {/* Bottom: date + trend */}
          <div className="flex flex-col items-center justify-start w-full gap-0.5">
      {date && (
              <span className="text-[10px] text-[#94a3b8]">{date}</span>
      )}

      {/* Trend — only when the caller actually has one to show */}
      {trend && (
        <div dir="ltr" className={cn('flex items-center justify-start gap-1.5 text-[10px] font-medium mt-0.5', trendUp ? 'text-[#12A150]' : 'text-[#EF4444]')}>
          <span>{trend}</span>
          <svg viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4", trendUp ? "rotate-180" : "")}>
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      )}

    </div>
    </div>
    </div>
    </div>
  );
}
