import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface CursorPagerProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

// The transport UI refresh uses the shared numbered `Pagination`, which needs a total. The
// platform pages this list by cursor with a fixed page size (`DEFAULT_PAGE_SIZE`), so no
// total exists and "jump to page 7" cannot be expressed. Same visual language, previous/next
// only.
export function CursorPager({ page, hasPrev, hasNext, onPrev, onNext, className }: CursorPagerProps) {
  const { t } = useTranslation();
  if (!hasPrev && !hasNext) return null;

  const navButton =
    'w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors bg-white disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className={cn('flex items-center justify-end px-4 py-3 gap-1', className)}>
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
  );
}
