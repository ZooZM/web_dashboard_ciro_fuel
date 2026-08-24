import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, SendHorizonal } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OrderProblemSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "border border-emerald-200 rounded-2xl overflow-hidden transition-all duration-300",
      isExpanded ? "bg-white" : "bg-emerald-50"
    )}>
      
      {/* Header (Clickable) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-full flex items-center p-6 bg-emerald-100/50 transition-colors"
      >
        <div className="flex items-center gap-4 shrink-0">
          <img src="/transportCompany/HelpPage/gunStation.svg" className="w-8 h-8 object-contain" alt="" />
        </div>
        <div className="flex items-center justify-start flex-1 gap-4 mr-4 text-right">
          <div className="flex flex-col gap-1">
            <h3 className="text-[#162155] font-black text-lg">عندك مشكلة في طلب ؟</h3>
            <span className="text-slate-400 font-bold text-xs">
              اختر الطلب و بلغ عنه و سيقوم الدعم بالتواصل معك في أقرب وقت
            </span>
          </div>
        </div>
        
        
        {/* Absolute position for the chevron on the left */}
        <div className="absolute left-3">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-green-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-green-600" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 pt-2 border-t border-emerald-100 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="flex flex-col gap-2 text-right">
              <label className="text-slate-500 font-bold text-sm">اختر الطلب</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-right text-slate-700 font-bold text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" dir="rtl">
                  <option value="ORD-2024-256">ORD-2024-256</option>
                  <option value="ORD-2024-257">ORD-2024-257</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-right">
              <label className="text-slate-500 font-bold text-sm">نوع المشكلة</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-3 pr-10 text-right text-slate-700 font-bold text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" dir="rtl">
                  <option value="other">أخري</option>
                  <option value="delay">تأخير التوصيل</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
          </div>

          <div className="flex flex-col gap-1 text-right">
            <span className="text-[#162155] font-bold text-sm">الطلب غير موجود أو المشكلة في طلب غير حالي ؟</span>
            <span className="text-emerald-500 font-bold text-xs">إرسل كود الطلب مع المشكلة</span>
          </div>

          <div className="flex flex-col gap-2 text-right">
            <label className="text-slate-500 font-bold text-sm">تفاصيل المشكلة</label>
            <textarea 
              className="w-full min-h-[120px] bg-white border border-slate-200 rounded-xl p-4 text-right text-slate-700 font-bold text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-y"
              placeholder="أكتب المشكلة بالتفصيل..."
              dir="rtl"
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-slate-500">
              <img src="/transportCompany/HelpPage/hour.svg" alt="" className="w-4 h-4" />
              <span className="font-bold text-xs">سيتم الرد خلال 4 دقائق تقريباً</span>
            </div>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 transition-colors font-bold text-sm">
              <img src="/transportCompany/HelpPage/share.svg" alt="" className="w-4 h-4" />
              إرسال البلاغ
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
