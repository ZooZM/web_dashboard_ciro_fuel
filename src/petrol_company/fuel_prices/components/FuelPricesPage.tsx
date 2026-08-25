import React, { useState } from 'react';
import { RefreshCw, FileText, BarChart3, DollarSign, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { FuelPriceCard } from './FuelPriceCard';
import { EditPriceModal } from './EditPriceModal';
import { cn } from '@/lib/utils';
import { FuelIcon } from '@/transport_company/tracking/components/FuelIcon';

export interface FuelData {
  id: number;
  type: string;
  price: string;
  unit: string;
  changeType: 'up' | 'down' | 'neutral';
  changeText: string;
  lastUpdateDays: string;
  lastPrice: string;
  colorClass: string;
  iconBgClass: string;
  isActive: boolean;
  scheduledUpdate?: string;
}

export const FUEL_DATA: FuelData[] = [
  {
    id: 1,
    type: 'كيروسين',
    price: '2.10',
    unit: 'ر.س / لتر',
    changeType: 'down',
    changeText: '16.30% عن آخر تحديث',
    lastUpdateDays: 'منذ 5 أيام',
    lastPrice: '2.05',
    colorClass: 'border-[#1E5FFF]',
    iconBgClass: 'bg-[#1E5FFF]/10',
    isActive: false,
  },
  {
    id: 2,
    type: 'ديزل',
    price: '2.10',
    unit: 'ر.س / لتر',
    changeType: 'down',
    changeText: '16.30% عن آخر تحديث',
    lastUpdateDays: 'منذ 5 أيام',
    lastPrice: '2.05',
    colorClass: 'border-[#FF5810]',
    iconBgClass: 'bg-[#FF5810]/10',
    isActive: true,
  },
  {
    id: 3,
    type: 'بنزين 91',
    price: '2.10',
    unit: 'ر.س / لتر',
    changeType: 'down',
    changeText: '16.30% عن آخر تحديث',
    lastUpdateDays: 'منذ 5 أيام',
    lastPrice: '2.05',
    colorClass: 'border-[#12A150]',
    iconBgClass: 'bg-[#12A150]/10',
    isActive: true,
    scheduledUpdate: 'تحديث مجدول: 26/08/2026 -|06:00 ص',
  },
  {
    id: 4,
    type: 'بنزين 95',
    price: '2.10',
    unit: 'ر.س / لتر',
    changeType: 'up',
    changeText: '16.30% عن آخر تحديث',
    lastUpdateDays: 'منذ 5 أيام',
    lastPrice: '2.05',
    colorClass: 'border-[#EF3F3F]',
    iconBgClass: 'bg-[#EF3F3F]/10',
    isActive: true,
  },
  {
    id: 5,
    type: 'بنزين 98',
    price: '2.10',
    unit: 'ر.س / لتر',
    changeType: 'neutral',
    changeText: '- لم يتغير',
    lastUpdateDays: 'منذ 5 أيام',
    lastPrice: '2.05',
    colorClass: 'border-[#8B3FE8]',
    iconBgClass: 'bg-[#8B3FE8]/10',
    isActive: true,
  },
];

const COMPARISON_DATA = [
  { type: 'بنزين 98', current: '3.95', old: '3.93', diff: '+ 0.02', percent: '0.5%', isUp: true, color: 'text-[#8B3FE8]', bg: 'bg-[#8B3FE8]/10' },
  { type: 'بنزين 95', current: '2.50', old: '2.33', diff: '+ 0.02', percent: '0.5%', isUp: true, color: 'text-[#EF3F3F]', bg: 'bg-[#EF3F3F]/10' },
  { type: 'بنزين 91', current: '2.15', old: '2.18', diff: '- 0.03', percent: '0.5%', isUp: false, color: 'text-[#12A150]', bg: 'bg-[#12A150]/10' },
  { type: 'ديزل', current: '1.79', old: '1.80', diff: '- 0.01', percent: '0.5%', isUp: false, color: 'text-[#FF5810]', bg: 'bg-[#FF5810]/10' },
  { type: 'كيروسين', current: '1.75', old: '1.67', diff: '+ 0.08', percent: '0.5%', isUp: true, color: 'text-[#1E5FFF]', bg: 'bg-[#1E5FFF]/10' },
];

export function FuelPricesPage() {
  const [editingFuel, setEditingFuel] = useState<FuelData | null>(null);
  const [fuelData, setFuelData] = useState<FuelData[]>(FUEL_DATA);

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-[calc(100vh-6rem)] font-sans" dir="rtl">
      <div className="flex flex-col gap-8 max-w-[1600px] mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">

          {/* Titles */}
          <div className="flex flex-col gap-1 text-right">
            <h1 className="text-2xl font-black text-[#162155]">أسعار الوقود</h1>
            <p className="text-slate-500 font-bold text-sm">
              أسعار البيع المعتمدة لكل أنواع الوقود عبر شبكة محطاتك - تظهر فوراً بمجرد التحديث
            </p>
          </div>

          {/* Last Update Badge */}
          <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 shrink-0 self-start md:self-auto">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.6673 10.1337V11.2587L11.2673 11.9337M10.0007 1.66699V4.33366M6.00065 1.66699V4.33366M6.00065 7.66699H2.34554M2.34554 7.66699C2.33773 7.88088 2.33398 8.10302 2.33398 8.33366C2.33398 11.6066 3.09461 13.1681 5.33398 13.7364M2.34554 7.66699C2.48439 3.86217 3.89795 2.66699 8.00065 2.66699C11.5792 2.66699 13.1119 3.57632 13.5372 6.33366M13.6673 11.3337C13.6673 12.9905 12.3242 14.3337 10.6673 14.3337C9.01046 14.3337 7.66732 12.9905 7.66732 11.3337C7.66732 9.6768 9.01046 8.33366 10.6673 8.33366C12.3242 8.33366 13.6673 9.6768 13.6673 11.3337Z" stroke="#162155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <span className="text-xs font-bold text-slate-600">آخر تحديث: اليوم 08:30 ص</span>
          </div>

        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          {fuelData.map((fuel) => (
            <FuelPriceCard
              key={fuel.id}
              fuel={fuel}
              onEdit={setEditingFuel}
              onToggleActive={(id) => setFuelData(prev => prev.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f))}
            />
          ))}
        </div>

        {/* Prices Summary */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100/50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 8H16M8 12H16M12 16H16M3.5 12C3.5 5.5 5.5 3.5 12 3.5C18.5 3.5 20.5 5.5 20.5 12C20.5 18.5 18.5 20.5 12 20.5C5.5 20.5 3.5 18.5 3.5 12Z" stroke="#1E5FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h2 className="text-lg font-black text-[#162155]">ملخص الأسعار</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x sm:divide-x-reverse divide-slate-100">

              {/* Average Price */}
              <div className="flex items-center justify-start sm:justify-start sm:gap-6 pt-4 sm:pt-0 pl-0 sm:pl-8">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 21.3333H17.3333C18.2222 21.3333 20 20.8 20 18.6667C20 16.5333 18.2222 16 17.3333 16H14.6667C13.7778 16 12 15.4667 12 13.3333C12 11.2 13.7778 10.6667 14.6667 10.6667H16M16 21.3333H12M16 21.3333V24M20 10.6667H16M16 10.6667V8M28 16C28 22.6274 22.6274 28 16 28C9.37258 28 4 22.6274 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" stroke="#1E5FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs font-bold text-slate-500">متوسط الأسعار</span>
                  <div className="flex items-center gap-1 justify-start">
                    <span className="text-xl font-black text-[#162155]">2.10</span>
                  </div>
                  <span className="text-[10px] text-slate-400">ر.س / لتر</span>
                </div>
              </div>

              {/* Highest Price */}
              <div className="flex items-center justify-bstartsetween sm:justify-start sm:gap-6 pt-4 sm:pt-0 px-0 sm:px-8">
                <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                  <ArrowUp className="w-6 h-6 text-orange-500" />
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs font-bold text-slate-500">أعلى سعر</span>
                  <div className="flex items-center gap-1 justify-start">
                    <span className="text-xl font-black text-[#162155]">3.95</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-start">
                    <div className="w-2 h-2 rounded-full bg-[#8B3FE8]"></div>
                    <span className="text-[10px] text-slate-400">بنزين 98</span>
                  </div>
                </div>
              </div>

              {/* Lowest Price */}
              <div className="flex items-center justify-between sm:justify-start sm:gap-6 pt-4 sm:pt-0 px-0 sm:px-8">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <ArrowDown className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs font-bold text-slate-500">أقل سعر</span>
                  <div className="flex items-center gap-1 justify-start">
                    <span className="text-xl font-black text-[#162155]">1.75</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-start">
                    <div className="w-2 h-2 rounded-full bg-[#12A150]"></div>
                    <span className="text-[10px] text-slate-400">بنزين 91</span>
                  </div>
                </div>
              </div>

              {/* Average Change */}
              <div className="flex items-center justify-between sm:justify-start sm:gap-6 pt-4 sm:pt-0 pr-0 sm:pr-8">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-xs font-bold text-slate-500">متوسط نسبة التغيير</span>
                  <div className="flex items-center gap-1 justify-start">
                    <span className="text-xl font-black text-[#EF3F3F]" dir="ltr">+16.30%</span>
                  </div>
                  <span className="text-[10px] text-slate-400">عن آخر تحديث</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Prices Comparison */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 rounded-lg bg-blue-100/50 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 16V12M12 16V8M8 16V14M3.5 12C3.5 5.5 5.5 3.5 12 3.5C18.5 3.5 20.5 5.5 20.5 12C20.5 18.5 18.5 20.5 12 20.5C5.5 20.5 3.5 18.5 3.5 12Z" stroke="#1E5FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <h2 className="text-lg font-black text-[#162155]">مقارنة الأسعار</h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">المنتج</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">السعر الحالي</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">السعر السابق</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap text-center">الفرق</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap text-center">نسبة التغيير</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {COMPARISON_DATA.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0")}>
                            <FuelIcon type={item.type} className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-bold text-[#162155]">{item.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-[#162155]">{item.current}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-500">{item.old}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5" dir="ltr">
                          <span className={cn("text-xs font-bold", item.isUp ? "text-[#22C55E]" : "text-[#EF4444]")}>{item.diff}</span>
                          <svg className={cn("w-3 h-3", item.isUp ? "text-[#22C55E]" : "text-[#EF4444] rotate-180")} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 4L20 14H4L12 4Z" />
                          </svg>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <span className={cn("text-xs font-bold", item.isUp ? "text-[#22C55E]" : "text-[#EF4444]")} dir="ltr">{item.percent}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {editingFuel && (
        <EditPriceModal
          fuel={editingFuel}
          onClose={() => setEditingFuel(null)}
        />
      )}
    </div>
  );
}
