import { cn } from '@/lib/utils';

interface ActionCardProps {
  title: string;
  subtitle: string;
  icon: string;
  bgClass: string;
  // Feature 013 T116/FR-051: optional so every pre-existing caller keeps its previous
  // (inert) behavior — only a caller that passes a real destination gets a working button.
  onClick?: () => void;
}

export function ActionCard({ title, subtitle, icon, bgClass, onClick }: ActionCardProps) {
  return (
    <button onClick={onClick} className="flex-1 bg-white border border-slate-200 rounded-2xl p-2 flex items-center justify-start shadow-sm hover:shadow-md transition-shadow group text-right">
      <div className={cn('w-10 h-10 shrink-0 flex items-center justify-center rounded-xl', bgClass)}>
        <img src={icon} className="w-5 h-5 object-contain transition-transform group-hover:scale-110" />
      </div>
      <div className="flex  flex-col gap-y-2 mr-3">
        <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{title}</span>
        <span className="text-[9px] font-medium text-slate-400 mt-0.5">{subtitle}</span>
      </div>
    </button>
  );
}
