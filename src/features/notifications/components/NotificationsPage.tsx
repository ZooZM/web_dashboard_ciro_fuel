/* eslint-disable i18next/no-literal-string */
import { useState } from 'react';
import { cn } from '@/lib/utils';

type NotificationType = 'success' | 'warning' | 'info' | 'system' | 'error';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  orderId?: string;
  description: string;
  time: string;
  elapsed: string;
  icon: string;
  date: string;
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'تم تحصيل الفاتورة',
    orderId: 'ORD-2024-256',
    description: 'لديك فاتورة مستحقة الدفع بقيمة 12,450 ريال. يرجى السداد قبل نهاية الشهر.',
    time: '06:26 م',
    elapsed: 'قبل 5 دقائق',
    icon: '/notification/invoice.svg',
    date: 'الثلاثاء 10 أغسطس 2026',
    isRead: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'تم حل العطل',
    orderId: 'ORD-2024-256',
    description: 'يمكنك الآن مواصلة تتبع شحناتك لحظة بلحظة. نرجو ان تقوم بإبلاغ الدعم في حال وجود أي أعطال أو مشاكل.',
    time: '06:26 م',
    elapsed: 'قبل 5 دقائق',
    icon: '/notification/about.svg',
    date: 'الثلاثاء 10 أغسطس 2026',
    isRead: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'تم تسليم الطلب',
    orderId: 'ORD-2024-256',
    description: 'تم قبول طلب الوقود ORD-2024-256 وجاري تحضير الشحنة الآن.',
    time: '06:26 م',
    elapsed: 'قبل 5 دقائق',
    icon: '/notification/notification.svg',
    date: 'الثلاثاء 10 أغسطس 2026',
    isRead: false,
  },
  {
    id: '4',
    type: 'success',
    title: 'تم تحصيل الفاتورة',
    orderId: 'ORD-2024-256',
    description: 'لديك فاتورة مستحقة الدفع بقيمة 12,450 ريال. يرجى السداد قبل نهاية الشهر.',
    time: '06:26 م',
    elapsed: 'قبل 5 دقائق',
    icon: '/notification/invoice.svg',
    date: 'الثلاثاء 10 أغسطس 2026',
    isRead: false,
  },
  {
    id: '5',
    type: 'info',
    title: 'تم تسليم الطلب',
    orderId: 'ORD-2024-256',
    description: 'تم قبول طلب الوقود ORD-2024-256 وجاري تحضير الشحنة الآن.',
    time: '06:26 م',
    elapsed: 'قبل 5 دقائق',
    icon: '/notification/notification.svg',
    date: 'الاثنين 09 أغسطس 2026',
    isRead: false,
  },
  {
    id: '6',
    type: 'system',
    title: 'تحديث النظام',
    description: 'تم تحديث التطبيق إلى الإصدار الجديد مع تحسينات في الأداء والاستقرار.',
    time: '06:26 م',
    elapsed: 'قبل 5 دقائق',
    icon: '/notification/setting.svg',
    date: 'الاثنين 09 أغسطس 2026',
    isRead: false,
  },
  {
    id: '7',
    type: 'error',
    title: 'توقف السائق في الطريق',
    orderId: 'ORD-2024-256',
    description: 'توقف السائق محمد إبراهيم عن الحركة لأكثر من 10 دقائق أثناء تنفيذ طلب نقل الوقود.',
    time: '06:26 م',
    elapsed: 'قبل 5 دقائق',
    icon: '/notification/about.svg',
    date: 'الاثنين 09 أغسطس 2026',
    isRead: false,
  },
  {
    id: '8',
    type: 'info',
    title: 'تم تسليم الطلب',
    orderId: 'ORD-2024-256',
    description: 'تم قبول طلب الوقود ORD-2024-256 وجاري تحضير الشحنة الآن.',
    time: '06:26 م',
    elapsed: 'قبل 5 دقائق',
    icon: '/notification/notification.svg',
    date: 'الاثنين 09 أغسطس 2026',
    isRead: false,
  },
];

const getTypeStyles = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return { card: 'bg-[#EAF5EC] border-[#D1EBD5]', iconBg: 'bg-[#10B981]', dot: 'bg-[#10B981]' };
    case 'warning':
      return { card: 'bg-[#FEEFE6] border-[#FBD6C0]', iconBg: 'bg-[#F97316]', dot: 'bg-[#F97316]' };
    case 'info':
      return { card: 'bg-[#EBF2FE] border-[#D1E0FB]', iconBg: 'bg-[#3B82F6]', dot: 'bg-[#3B82F6]' };
    case 'system':
      return { card: 'bg-[#F1F5F9] border-[#E2E8F0]', iconBg: 'bg-[#94A3B8]', dot: 'bg-[#94A3B8]' };
    case 'error':
      return { card: 'bg-[#FDECEC] border-[#F6D0D0]', iconBg: 'bg-[#EF4444]', dot: 'bg-[#EF4444]' };
    default:
      return { card: 'bg-[#F1F5F9] border-[#E2E8F0]', iconBg: 'bg-[#94A3B8]', dot: 'bg-[#94A3B8]' };
  }
};

export function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('الكل');
  const [isMuted, setIsMuted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filters = ['الكل', 'عاجل', 'الطلبات', 'الفواتير', 'تنبيه', 'النظام'];

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Group by date
  const groupedNotifications = notifications.reduce((acc, notif) => {
    const group = acc[notif.date] ?? [];
    group.push(notif);
    acc[notif.date] = group;
    return acc;
  }, {} as Record<string, Notification[]>);

  const dateEntries = Object.entries(groupedNotifications);


  return (
    <div className="flex flex-col flex-1 text-right font-sans bg-[#F3F4F6] -m-6 p-6" dir="rtl">

      {/* ── Breadcrumb ── */}
      <div className="pb-4 shrink-0 flex justify-start">
        <div className="inline-flex items-center gap-2 px-5 py-2.5text-[13.5px] text-slate-600 cursor-pointer">
          <div className="bg-white border border-slate-100 rounded-xl shadow-sm w-8 h-8 flex font-bold items-center justify-center" onClick={()=>window.history.back()}>
            <img src="/notification/chevronRight.svg" className="w-4 h-4" alt="" />
          </div>
          <span className="text-[20px] text-slate-900">الإشعارات</span>
        </div>
      </div>

      {/* ── Main White Card ── */}
      <div className="pb-6 flex-1">
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden">

          {/* Header: Title + Mute */}
          <div className="flex justify-between items-center px-8 pt-8 pb-6">
            <h1 className="text-[26px] font-bold text-slate-900">الإشعارات</h1>
            <div className='flex gap-2 items-center'>
              <span className='text-[13px] font-medium text-slate-500 '>
              {isMuted ? 'تفعيل الإشعارات' : 'كتم الإشعارات'}
              </span>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex bg-white items-center gap-2.5 px-2.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium text-slate-500 hover:bg-slate-50 transition-colors"
              >
              {isMuted ? (
                <img src="/notification/disabledNotification.svg" className="w-[20px] h-[20px] opacity-50" alt="" />
              ) : (
                <img src="/notification/notification.svg" className="w-[20px] h-[20px] " alt="" />
              )}
            </button>
              </div>
          </div>

          {/* Filters row */}
          <div className="px-8 pb-4 flex justify-start">
            <div className="flex gap-2.5">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "px-6 py-[7.5px] rounded-full text-[13.5px] font-bold transition-colors",
                    activeFilter === f
                      ? "bg-[#2563EB] text-white"
                      : "bg-[#F1F5F9] text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

     
        </div>


        <div className='mt-10'>
               {/* Mark as read action row */}
          <div className="px-8 pb-6 flex justify-end">
            <button className="flex items-center gap-2 text-[13px] text-[#2563EB] hover:text-blue-700 font-medium transition-colors">
              تحديد الكل / المحدد كمقروء
              <img src="/notification/seen.svg" className="w-[18px] h-[18px]" alt="" />
            </button>
          </div>

          {/* ── Cards Grouped by Date ── */}
          <div className="px-4 sm:px-8 pb-10">
            {dateEntries.map(([date, items], groupIndex) => {
              return (
                <div key={date} className={cn("flex flex-col md:block", groupIndex !== dateEntries.length - 1 ? "mb-10" : "")}>
                  
                  {/* MOBILE Date Header (hidden on desktop) */}
                  <div className="md:hidden flex items-center gap-3 relative z-10 mb-4 mr-1 sm:mr-0">
                    <div className="w-[34px] h-[34px] rounded-full border-[2px] border-[#10B981] bg-[#E4F7EC] flex items-center justify-center shrink-0">
                      <img src="/notification/date.svg" className="w-4 h-4" alt="" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-bold text-[#10B981] leading-tight whitespace-nowrap">
                        {date.replace(/ \d{4}$/, '')}
                      </span>
                      <span className="text-[13px] font-bold text-[#10B981] leading-tight">
                        {date.match(/\d{4}$/)?.[0] || ''}
                      </span>
                    </div>
                  </div>

                  {/* Cards List */}
                  <div className="flex flex-col md:block gap-3 sm:gap-4 pl-0 sm:pl-2 md:pl-0">
                    {items.map((notif, cardIndex) => {
                      const styles = getTypeStyles(notif.type);
                      return (
                        <div key={notif.id} className="group/item flex items-stretch mb-0 md:mb-4 md:last:mb-0">
                          
                          {/* ── DESKTOP Timeline column (hidden on mobile) ── */}
                          <div className="hidden md:flex relative w-[160px] shrink-0 items-center justify-start ml-6">
                            {/* Vertical line segment (extends through margin to connect with next card) */}
                            <div className="absolute right-[16px] top-0 bottom-[-16px] group-last/item:bottom-0 w-[2px] bg-[#10B981]" />

                            {/* Show date marker only on first card of the group */}
                            {cardIndex === 0 && (
                              <div className="flex items-center gap-3 relative z-10">
                                <div className="w-[34px] h-[34px] rounded-full border-[2px] border-[#10B981] bg-[#E4F7EC] flex items-center justify-center shrink-0">
                                  <img src="/notification/date.svg" className="w-4 h-4" alt="" />
                                </div>
                                <div className="flex flex-col items-start pr-2">
                                  <span className="text-[12px] font-bold text-[#10B981] leading-tight whitespace-nowrap">
                                    {date.replace(/ \d{4}$/, '')}
                                  </span>
                                  <span className="text-[11px] font-bold text-[#10B981] leading-tight mt-0.5">
                                    {date.match(/\d{4}$/)?.[0] || ''}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* ── Card Content ── */}
                          <div
                            className={cn(
                              "flex-1 min-w-0 flex items-center gap-4 px-3 sm:px-5 py-4 rounded-[14px] border transition-all hover:shadow-md cursor-pointer group",
                              styles.card
                            )}
                          >
                            {/* Right side: Checkmark + Time */}
                            <div className="flex items-center gap-3 shrink-0">
                              <div 
                                onClick={(e) => toggleSelection(notif.id, e)}
                                className={cn(
                                  "flex items-center justify-center w-[22px] h-[22px] rounded border cursor-pointer transition-colors",
                                  selectedIds.includes(notif.id) 
                                    ? "bg-[#2563EB] border-[#2563EB]" 
                                    : "bg-transparent border-slate-300 hover:border-[#2563EB]"
                                )}
                              >
                                <svg 
                                  className={cn("w-4 h-4 transition-colors", selectedIds.includes(notif.id) ? "text-white" : "text-[#2563EB] opacity-0")} 
                                  viewBox="0 0 20 20" fill="none"
                                >
                                  <path d="M16.6667 5L7.50001 14.1667L3.33334 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                              <span className="text-[12px] sm:text-[13px] font-bold text-slate-600 whitespace-nowrap">{notif.time}</span>
                            </div>

                            {/* Center: Title + Description */}
                            <div className="flex-1 min-w-0 text-right">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <h4 className="text-[13px] sm:text-[14px] font-bold text-slate-900">{notif.title}</h4>
                                {notif.orderId && (
                                  <span className="text-[11px] text-slate-400 font-medium">{notif.orderId}</span>
                                )}
                              </div>
                              <p className="text-[12px] sm:text-[12.5px] text-slate-500 mt-1 leading-relaxed truncate">
                                {notif.description}
                              </p>
                            </div>

                            {/* Left side: Elapsed + Icon + Chevron */}
                            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                              <div className="flex items-center gap-1.5 hidden sm:flex">
                                <span className={cn("w-[6px] h-[6px] rounded-full", styles.dot)} />
                                <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap">{notif.elapsed}</span>
                              </div>
                              <div className={cn("w-8 h-8 sm:w-9 sm:h-9 rounded-[10px] flex items-center justify-center", styles.iconBg)}>
                                <img src={notif.icon} className="w-4 h-4 sm:w-[18px] sm:h-[18px] brightness-0 invert" alt="" />
                              </div>
                              <img src="/notification/chevronRight.svg" className="w-4 h-4 opacity-30 rotate-180 hidden sm:block" alt="" />
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
