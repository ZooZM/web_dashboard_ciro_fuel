import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, Download, X, ChevronDown, Clock, CircleDollarSign, Fuel, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePopup } from '@/components/ui/date-range-popup';

export interface FilterOptionDef {
  id: string;
  label: string;
  options: { value: string; label: string }[];
}

export interface SortOptionDef {
  id: string;
  label: string;
  direction: 'asc' | 'desc';
  group: 'date' | 'price' | 'quantity';
}

interface FilterToolbarProps {
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  onExport?: () => void;
  filters?: FilterOptionDef[];
  hasDateRange?: boolean;
  initialSearchTerm?: string;
  onApplyFilters?: (filters: Record<string, string>, dateRange: { from: string; to: string }) => void;
}

export function FilterToolbar({
  searchPlaceholder = 'ابحث...',
  onSearch,
  onExport,
  filters = [],
  hasDateRange = false,
  initialSearchTerm = '',
  onApplyFilters
}: FilterToolbarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  
  // Sync if initialSearchTerm changes externally
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);
  
  // Local state for the filter panel
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  
  // Active applied filters
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sortRef]);

  const handleApply = () => {
    setActiveFilters(localFilters);
    setIsFilterOpen(false);
    if (onApplyFilters) {
      onApplyFilters(localFilters, { from: dateFrom, to: dateTo });
    }
  };

  const handleReset = () => {
    setLocalFilters({});
    setDateFrom('');
    setDateTo('');
  };

  const handleClearAll = () => {
    setActiveFilters({});
    handleReset();
    if (onApplyFilters) {
      onApplyFilters({}, { from: '', to: '' });
    }
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...activeFilters };
    delete newFilters[key];
    setActiveFilters(newFilters);
    setLocalFilters(newFilters);
    if (onApplyFilters) {
      onApplyFilters(newFilters, { from: dateFrom, to: dateTo });
    }
  };

  const sortGroups = [
    {
      id: 'date',
      icon: <img src="/filter/schedule.svg" alt="schedule" className='w-5 h-5' />,
      items: [
        { id: 'date_desc', label: 'الأحدث أولاً', direction: 'desc' },
        { id: 'date_asc', label: 'الأقدم أولاً', direction: 'asc' },
      ]
    },
    {
      id: 'price',
      icon: <CircleDollarSign className="w-5 h-5 text-blue-600" />,
      items: [
        { id: 'price_desc', label: 'الأعلى سعراً', direction: 'desc' },
        { id: 'price_asc', label: 'الأقل سعراً', direction: 'asc' },
      ]
    },
    {
      id: 'qty',
      icon: <img src="/filter/gunStation.svg" alt="fuel" className='w-5 h-5' />,
      items: [
        { id: 'qty_desc', label: 'الأعلى كمية', direction: 'desc' },
        { id: 'qty_asc', label: 'الأقل كمية', direction: 'asc' },
      ]
    }
  ];

  return (
    <div className="flex flex-col w-full bg-white  overflow-visible mb-6 z-20 relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 flex-wrap gap-4">
        {/* Right side (Search & Buttons) in RTL */}
        <div className="flex items-center gap-4 flex-1">
      
          {/* Search Input */}
          <div className="relative w-full max-w-[300px]">
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              className="w-full pr-11 pl-4 py-2.5 bg-white border border-slate-200 rounded-3xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400"
            />
            <img src="/petrolCompany/station/search.svg" className='w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400' alt="" />
            
          </div>
        </div>

        {/* Left side (Export) */}
        {onExport && (
          <button 
            onClick={onExport}
            className="flex justify-center items-center gap-2 bg-[#F0FDF4] border border-[#BBF7D0] text-[#16A34A] px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#DCFCE7] transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            تصدير
          </button>
        )}
      </div>

      {/* Active Filters Row */}
      {Object.keys(activeFilters).length > 0 && !isFilterOpen && (
        <div className="flex items-center gap-3 px-4 pb-4 border-t border-slate-50 pt-4 flex-wrap">
          <button onClick={handleClearAll} className="text-red-500 text-sm font-bold ml-2">مسح الكل</button>
          {Object.entries(activeFilters).map(([key, val]) => {
            const filterDef = filters.find(f => f.id === key);
            const label = filterDef ? `${filterDef.label}: ${val}` : val;
            return (
              <div key={key} className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100">
                <span>{label}</span>
                <button onClick={() => removeFilter(key)} className="hover:bg-blue-100 rounded-full p-0.5 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Expanded Filter Panel */}
      {isFilterOpen && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
          <div className="flex flex-wrap gap-6 mb-6">
            
            {/* Custom Dropdowns */}
            {filters.map(filter => (
              <div key={filter.id} className="flex flex-col gap-2 flex-1 min-w-[150px]">
                <span className="text-xs font-bold text-slate-700">{filter.label}</span>
                <div className="relative">
                  <Select 
                    value={localFilters[filter.id] || ''} 
                    onValueChange={(val) => setLocalFilters({...localFilters, [filter.id]: val === 'all' ? '' : val})}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={`كل ${filter.label}`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل {filter.label}</SelectItem>
                      {filter.options.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            {/* Date Range */}
            {hasDateRange && (
              <div className="flex flex-col gap-2 flex-[2] min-w-[220px]">
                <span className="text-xs font-bold text-slate-700">الفترة</span>
                <DateRangePopup 
                  initialFrom={dateFrom} 
                  initialTo={dateTo} 
                  onApply={(range) => {
                    setDateFrom(range.from);
                    setDateTo(range.to);
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-start gap-4">
            <button 
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              تطبيق التصفية
            </button>
            <button 
              onClick={handleReset}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors"
            >
              إعادة التعيين
              <img src="/filter/reload.svg" alt="Reload" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
