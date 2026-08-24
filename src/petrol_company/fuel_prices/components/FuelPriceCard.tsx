import React from 'react';
import { cn } from '@/lib/utils';
import { FuelIcon } from '@/transport_company/tracking/components/FuelIcon';
import type { FuelData } from './FuelPricesPage';

interface FuelPriceCardProps {
  fuel: FuelData;
  onEdit: (fuel: FuelData) => void;
}

export function FuelPriceCard({ fuel, onEdit }: FuelPriceCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm border-t-4 p-5 flex flex-col justify-between h-full",
        fuel.colorClass
      )}
      style={{ boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)' }}
    >

      {/* Card Header */}
      <div className="flex justify-between items-start mb-6">

        {/* Right: Fuel Info */}
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", fuel.iconBgClass)}>
            <FuelIcon type={fuel.type} className="w-5 h-5" />
          </div>
          <span className="font-black text-slate-900 text-lg">{fuel.type}</span>
        </div>

        {/* Left: Edit Button */}
        <button
          onClick={() => onEdit(fuel)}
          className="w-8 h-8 rounded-lg border border-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
        >
          <img src="/petrolCompany/orderDetails/edit.svg" alt="" className='w-4 h-4' />
        </button>
      </div>

      {/* Price Content */}
      <div className="flex flex-col text-start mb-6">
        <div className="flex items-end justify-start gap-1 mb-2">
          <span className="text-3xl font-black text-[#162155] tracking-tight">{fuel.price}</span>
          <span className="text-[11px] font-bold text-slate-400 pb-1">{fuel.unit}</span>
        </div>

        {/* Change Indicator */}
        <div className="flex items-center justify-start gap-1.5">
     

          {fuel.changeType === 'up' && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9L17 14H7L12 9Z" fill="#12A150" stroke="#12A150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          )}
          {fuel.changeType === 'down' && (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L17 10H7L12 15Z" fill="#EF3F3F" stroke="#EF3F3F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          )}

               <span className={cn(
            "text-xs font-bold",
            fuel.changeType === 'up' ? "text-green-600 " :
              fuel.changeType === 'down' ? "text-red-500" :
                "text-slate-400 "
          )}>
            {fuel.changeText}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-start gap-2 w-full">
        <span className="text-[10px] font-bold text-slate-400">
          آخر تحديث: {fuel.lastUpdateDays}
        </span>
        <div className="bg-slate-100 rounded line-through text-slate-400 text-[10px] font-bold px-2 py-1">
          {fuel.lastPrice}
        </div>
      </div>

    </div>
  );
}
