import React from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  itemName?: string;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (items: number) => void;
  className?: string;
}

export function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  itemName = 'عنصر',
  onPageChange,
  onItemsPerPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const increaseItemsPerPage = () => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(itemsPerPage + 1);
    }
  };

  const decreaseItemsPerPage = () => {
    if (onItemsPerPageChange && itemsPerPage > 1) {
      onItemsPerPageChange(itemsPerPage - 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages.map((page, idx) => {
      if (page === '...') {
        let targetPage = 1;
        if (currentPage <= 3) {
          targetPage = 4;
        } else if (currentPage >= totalPages - 2) {
          targetPage = Math.max(1, totalPages - 3);
        } else {
          if (idx === 1) {
            targetPage = currentPage - 2;
          } else {
            targetPage = currentPage + 2;
          }
        }

        return (
          <button
            key={`ellipsis-${idx}`}
            onClick={() => onPageChange(targetPage)}
            className="w-8 h-8 relative flex items-center justify-center text-slate-400 font-bold text-sm hover:text-blue-600 hover:bg-slate-50 rounded-lg group transition-all"
            title={`الانتقال إلى صفحة ${targetPage}`}
          >
            <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-100 group-hover:opacity-0 tracking-[2px]">
              ...
            </span>
            <span className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 opacity-0 group-hover:opacity-100 text-[13px]">
              {targetPage}
            </span>
          </button>
        );
      }

      const isCurrent = page === currentPage;
      return (
        <button
          key={page}
          onClick={() => onPageChange(page as number)}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm transition-colors",
            isCurrent
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-700 hover:bg-slate-50 bg-white"
          )}
        >
          {page}
        </button>
      );
    });
  };

  if (totalItems === 0) return null;

  return (
    <div className={cn("flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-4", className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">من {totalItems} {itemName}</span>
        <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-2 py-1">
          <button 
            onClick={decreaseItemsPerPage}
            disabled={itemsPerPage <= 1}
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50 font-bold text-lg leading-none pb-1"
          >
            -
          </button>
          <span className="text-sm font-bold text-slate-700">{itemsPerPage}</span>
          <button 
            onClick={increaseItemsPerPage}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg leading-none pb-1"
          >
            +
          </button>
        </div>
        <span className="text-sm font-bold text-slate-700 mr-2">عرض</span>
      </div>
      <div className="flex items-center gap-1">
        <button 
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="/petrolCompany/transporters/arrowRight.svg" className="w-3 h-3 opacity-80" />
        </button>
        
        {renderPageNumbers()}
        
        <button 
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="/petrolCompany/transporters/arrowRight.svg" className="w-3 h-3 opacity-80" style={{ transform: 'scaleX(-1)' }} />
        </button>
      </div>
    </div>
  );
}
