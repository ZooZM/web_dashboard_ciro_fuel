import { useState, type ReactNode } from 'react';
import { Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqAccordionItemProps {
  title: string;
  icon: string;
  children: ReactNode;
}

export function FaqAccordionItem({ title, icon, children }: FaqAccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300",
      isExpanded ? "bg-[#FFF7ED]" : "bg-white" // Orange-50 equivalent
    )}>
      
      {/* Header (Clickable) */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-full flex items-center justify-start p-6 bg-slate-50 transition-colors"
      >
        <div className="absolute left-6">
          {isExpanded ? (
            <Minus className="w-6 h-6 text-[#F97316]" strokeWidth={2.5} />
          ) : (
            <Plus className="w-6 h-6 text-slate-400" strokeWidth={2.5} />
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0 bg-orange-100/50 p-2 rounded-xl">
          <img src={icon} className="w-6 h-6 object-contain" alt="" />
        </div>
        <div className="flex items-center justify-start flex-1 gap-4 mr-4 text-right">
          <h3 className="text-[#162155] font-black text-base">{title}</h3>
        </div>
        
        
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 py-6 animate-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-6">
            {children}
          </div>
        </div>
      )}

    </div>
  );
}
