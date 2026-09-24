import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface CursorPagerProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
  itemCount?: number;
  itemName?: string;
}

// The transport UI refresh uses the shared numbered `Pagination`, which needs a total. The
// platform pages this list by cursor with a fixed page size (`DEFAULT_PAGE_SIZE`), so no
// total exists and "jump to page 7" cannot be expressed. Same visual language, previous/next
// only.
export function CursorPager({ page, hasPrev, hasNext, onPrev, onNext, className, itemCount, itemName = 'عنصر' }: CursorPagerProps) {
  const { t } = useTranslation();
  if (!hasPrev && !hasNext) return null;

  const navButton =
    'w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className={cn('flex flex-col md:flex-row items-center justify-between px-4 py-3 gap-4', className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">من {itemCount ?? 0} {itemName}</span>
        <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-2 py-1">
          <button 
            disabled
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50 font-bold text-lg leading-none pb-1"
          >
            -
          </button>
          <span className="text-sm font-bold text-slate-700">8</span>
          <button 
            disabled
            className="text-slate-400 hover:text-slate-600 disabled:opacity-50 font-bold text-lg leading-none pb-1"
          >
            +
          </button>
        </div>
        <span className="text-sm font-bold text-slate-700 mr-2">عرض</span>
      </div>
      <div className="flex items-center justify-end gap-1">
        <button onClick={onPrev} disabled={!hasPrev} className={navButton} aria-label={t('common.previous')}>
          <img src="/petrolCompany/transporters/arrowRight.svg" className="w-3 h-3 opacity-80" alt="" />
        </button>
        <span className="w-8 h-8 flex items-center justify-center rounded-lg font-bold text-sm bg-blue-600 text-white shadow-sm">
          {page}
        </span>
        <button onClick={onNext} disabled={!hasNext} className={navButton} aria-label={t('common.next')}>
          <img src="/petrolCompany/transporters/arrowRight.svg" className="w-3 h-3 opacity-80" style={{ transform: 'scaleX(-1)' }} alt="" />
        </button>
      </div>
    </div>
  );
}
