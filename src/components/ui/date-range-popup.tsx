import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Calendar } from './calendar';
import type { DateRange } from 'react-day-picker';
import { format, parseISO, isValid } from 'date-fns';

interface DateRangePopupProps {
  initialFrom?: string;
  initialTo?: string;
  onApply?: (range: { from: string; to: string }) => void;
  className?: string;
  triggerClassName?: string;
}

export function DateRangePopup({
  initialFrom = '',
  initialTo = '',
  onApply,
  className,
  triggerClassName,
}: DateRangePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(() => {
    const from = initialFrom ? parseISO(initialFrom) : undefined;
    const to = initialTo ? parseISO(initialTo) : undefined;
    return (from && isValid(from)) || (to && isValid(to)) 
      ? { from: isValid(from) ? from : undefined, to: isValid(to) ? to : undefined } 
      : undefined;
  });
  const popupRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleApply = () => {
    setIsOpen(false);
    if (onApply) {
      onApply({ 
        from: date?.from ? format(date.from, 'yyyy-MM-dd') : '', 
        to: date?.to ? format(date.to, 'yyyy-MM-dd') : '' 
      });
    }
  };

  const handleReset = () => {
    setDate(undefined);
    if (onApply) {
      onApply({ from: '', to: '' });
    }
    setIsOpen(false);
  };

  const hasSelection = date?.from != null;
  const displayString = hasSelection
    ? `${date.from ? format(date.from, 'yyyy/MM/dd') : '---'} - ${date.to ? format(date.to, 'yyyy/MM/dd') : '---'}`
    : 'اختر الفترة الزمنية';

  return (
    <div className={cn("relative z-50", className)} ref={popupRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors h-[42px] w-full justify-between focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500",
          isOpen && "border-blue-500 ring-2 ring-blue-100",
          triggerClassName
        )}
      >
        <div className="flex items-center gap-3 w-full h-full">
          <img src="/filter/date.svg" className="w-4 h-4 shrink-0" alt="Date" />
          <span
            className={cn("text-[11px] font-bold truncate mt-0.5", hasSelection ? "text-slate-700 font-mono" : "text-slate-500")}
            dir={hasSelection ? "ltr" : "rtl"}
          >
            {displayString}
          </span>
        </div>
      </button>

      {/* Popup Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] left-0 w-[320px] bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden"
            dir="rtl"
          >
            <div className="p-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="font-black text-sm text-slate-800 px-2">تحديد الفترة الزمنية</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-white hover:bg-slate-100 rounded-full p-1.5 transition-colors border border-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2" dir="ltr">
              <Calendar
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
              />
            </div>

            <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={handleReset}
                className="text-xs font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
              >
                مسح
              </button>
              <button
                onClick={handleApply}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                تطبيق التصفية
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
