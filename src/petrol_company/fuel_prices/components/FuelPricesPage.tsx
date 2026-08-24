import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { FuelPriceCard } from './FuelPriceCard';
import { EditPriceModal } from './EditPriceModal';
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
  iconColorClass: string;
}

const FUEL_DATA: FuelData[] = [
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
    iconColorClass: 'text-[#1E5FFF]',
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
    iconColorClass: 'text-[#FF5810]',
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
    iconColorClass: 'text-[#12A150]',
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
    iconColorClass: 'text-[#EF3F3F]',
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
    iconColorClass: 'text-[#8B3FE8]',
  },
];


export function FuelPricesPage() {
  const [editingFuel, setEditingFuel] = useState<FuelData | null>(null);

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
              <path d="M10.6673 10.1337V11.2587L11.2673 11.9337M10.0007 1.66699V4.33366M6.00065 1.66699V4.33366M6.00065 7.66699H2.34554M2.34554 7.66699C2.33773 7.88088 2.33398 8.10302 2.33398 8.33366C2.33398 11.6066 3.09461 13.1681 5.33398 13.7364M2.34554 7.66699C2.48439 3.86217 3.89795 2.66699 8.00065 2.66699C11.5792 2.66699 13.1119 3.57632 13.5372 6.33366M13.6673 11.3337C13.6673 12.9905 12.3242 14.3337 10.6673 14.3337C9.01046 14.3337 7.66732 12.9905 7.66732 11.3337C7.66732 9.6768 9.01046 8.33366 10.6673 8.33366C12.3242 8.33366 13.6673 9.6768 13.6673 11.3337Z" stroke="#162155" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span className="text-xs font-bold text-slate-600">آخر تحديث: اليوم 08:30 ص</span>
          </div>

        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6">
          {FUEL_DATA.map((fuel) => (
            <FuelPriceCard
              key={fuel.id}
              fuel={fuel}
              onEdit={setEditingFuel}
            />
          ))}
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
