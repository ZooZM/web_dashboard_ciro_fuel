import React from 'react';
import { cn } from '@/lib/utils';
import { FuelIcon } from '@/transport_company/tracking/components/FuelIcon';
import type { FuelData } from './FuelPricesPage';

interface FuelPriceCardProps {
  fuel: FuelData;
  onEdit: (fuel: FuelData) => void;
  onToggleActive?: (id: number) => void;
}

export function FuelPriceCard({ fuel, onEdit, onToggleActive }: FuelPriceCardProps) {
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

        {/* Left: Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Status Toggle Button */}
          <button 
            onClick={() => onToggleActive && onToggleActive(fuel.id)}
            className={cn("w-8 h-8 rounded-lg border flex items-center justify-center transition-colors", fuel.isActive ? "border-red-100 text-red-500 hover:bg-red-50" : "border-green-100 text-green-500 hover:bg-green-50")}
          >
            {fuel.isActive ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 6C15 6 15.5 9 15.5 12C15.5 15 15 18 15 18M9 6C9 6 8.5 9 8.5 12C8.5 15 9 18 9 18" stroke="#EF3F3F" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 6C7.5 6 7 8 7 12C7 16 7.5 18 7.5 18C7.5 18 9.5 17.5 13 15.5C16.5 13.5 17.5 12 17.5 12C17.5 12 16.5 10.5 13 8.5C9.5 6.5 7.5 6 7.5 6Z" stroke="#12A150" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            )}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(fuel)}
            className="w-8 h-8 rounded-lg border border-blue-100 flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-colors"
          >
            <img src="/petrolCompany/orderDetails/edit.svg" alt="" className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Price Content & Status */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col text-start gap-2">
          {/* Price */}
          <div className="flex items-end justify-start gap-1">
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

        {/* Status Badge */}
        <div className={cn("px-2.5 py-1 rounded text-[10px] font-bold", fuel.isActive ? "bg-green-100/50 text-green-600" : "bg-red-50 text-red-500")}>
          {fuel.isActive ? 'متاح' : 'غير متاح'}
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 w-full">
        {fuel.scheduledUpdate ? (
          <>
            <div className="flex items-center gap-1.5 justify-start">
              <div className="w-2 h-2 rounded-full bg-[#12A150] animate-pulse"></div>
              <span className="text-[9px] font-bold text-slate-400">
                {fuel.scheduledUpdate.split('|')[0]}
                <span className="text-slate-500 font-black mr-1" dir="ltr">{fuel.scheduledUpdate.split('|')[1]}</span>
              </span>
            </div>
            <div className="bg-[#12A150] rounded-xl text-white text-[10px] font-bold px-2 py-1 flex-shrink-0">
              {fuel.lastPrice}
            </div>
          </>
        ) : (
          <>
            <span className="text-[10px] font-bold text-slate-400">
              آخر تحديث: {fuel.lastUpdateDays}
            </span>
            <div className="bg-slate-100 rounded line-through text-slate-400 text-[10px] font-bold px-2 py-1 flex-shrink-0">
              {fuel.lastPrice}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
