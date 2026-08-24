import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const TABS = ['الكل', 'في الطريق للتحميل', 'في الطريق للتوصيل'];

const MOCK_ORDERS = [
  { id: '1', orderNum: 'ORD-2024-246', company: 'شركة بترو أمان، جدة - الرحاب', status: 'في الطريق للتوصيل', quantity: '20,000', fuel: 'بنزين 98', icon: '/transportCompany/trackingPage/gasoline98.svg', isSelected: false },
  { id: '2', orderNum: 'ORD-2024-246', company: 'شركة بترو أمان، جدة - الرحاب', status: 'في الطريق للتحميل', quantity: '20,000', fuel: 'بنزين 98', icon: '/transportCompany/trackingPage/gasoline98.svg', isSelected: false },
  { id: '3', orderNum: 'ORD-2024-246', company: 'شركة بترو أمان، جدة - الرحاب', status: 'في الطريق للتوصيل', quantity: '20,000', fuel: 'بنزين 98', icon: '/transportCompany/trackingPage/gasoline98.svg', isSelected: true },
  { id: '4', orderNum: 'ORD-2024-246', company: 'شركة بترو أمان، جدة - الرحاب', status: 'في الطريق للتوصيل', quantity: '20,000', fuel: 'بنزين 98', icon: '/transportCompany/trackingPage/gasoline98.svg', isSelected: false },
  { id: '5', orderNum: 'ORD-2024-246', company: 'شركة بترو أمان، جدة - الرحاب', status: 'في الطريق للتحميل', quantity: '20,000', fuel: 'بنزين 98', icon: '/transportCompany/trackingPage/gasoline98.svg', isSelected: false },
  { id: '6', orderNum: 'ORD-2024-246', company: 'شركة بترو أمان، جدة - الرحاب', status: 'في الطريق للتوصيل', quantity: '20,000', fuel: 'بنزين 98', icon: '/transportCompany/trackingPage/gasoline98.svg', isSelected: false },
];

export function TrackingSidebar() {
  const [activeTab, setActiveTab] = useState('الكل');

  return (
    <div className="w-full lg:w-[380px] shrink-0 bg-white border border-slate-200 rounded-2xl flex flex-col  overflow-hidden shadow-sm">
      
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative">
          <input 
            type="text" 
            placeholder="ابحث بكود الطلب أو الشركة..." 
            className="w-full pr-10 pl-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400"
          />
          <img src="/transportCompany/trackingPage/search.svg" alt="search" className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 divide-x divide-x-reverse divide-slate-200">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-4 text-[11px] font-bold transition-colors relative text-center',
                isActive ? 'text-[#162155] bg-[#EEF2FF]' : 'text-slate-500 hover:bg-slate-50'
              )}
            >
              <span className="relative z-10">{tab}</span>
              {isActive && (
                <motion.div
                  layoutId="tracking-sidebar-tab"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
        {MOCK_ORDERS.map((order, idx) => (
          <div 
            key={idx} 
            className={cn(
              "p-4 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors shadow-sm",
              order.isSelected ? "border-blue-500 bg-[#F8FAFC]" : "border-slate-200 bg-white hover:bg-slate-50"
            )}
          >
            {/* Right Info */}
            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
              <span className="text-[#162155] font-black text-xs truncate">{order.orderNum}</span>
              <span className="text-slate-400 text-[10px] font-bold truncate">{order.company}</span>
            </div>

            {/* Middle Info (Quantity & Fuel) */}
            <div className="flex items-center gap-3 px-2 border-r border-l border-slate-100 shrink-0">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-slate-400 text-[9px] font-bold">الكمية</span>
                <span className="text-slate-800 font-black text-[11px]">{order.quantity}</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <img src={order.icon} alt={order.fuel} className="w-4 h-4 object-contain" />
                <span className="text-slate-500 font-bold text-[9px]">{order.fuel}</span>
              </div>
            </div>

            {/* Left Info (Status Pill) */}
            <div className="shrink-0 flex items-center justify-center min-w-[90px]">
              {order.status === 'في الطريق للتوصيل' ? (
                <span className="bg-[#DCFCE7] text-[#16A34A] px-2 py-1 rounded-full text-[9px] font-bold whitespace-nowrap w-full text-center">
                  في الطريق للتوصيل
                </span>
              ) : (
                <span className="bg-[#FFEDD5] text-[#EA580C] px-2 py-1 rounded-full text-[9px] font-bold whitespace-nowrap w-full text-center">
                  في الطريق للتحميل
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
