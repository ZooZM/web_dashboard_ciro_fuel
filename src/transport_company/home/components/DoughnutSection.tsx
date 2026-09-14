import { useNavigate } from 'react-router-dom';

interface LegendItem {
  label: string;
  value: string;
  /** A Tailwind background class, e.g. `bg-[#10B981]`. */
  color: string;
  /**
   * spec 017 T034 — a raw CSS colour, taking precedence over `color` when
   * given. The operator dashboard drives its ring and its legend from ONE
   * colour map, so the two cannot disagree about which slice is which; a
   * Tailwind class cannot be derived from that map at runtime, because Tailwind
   * only emits classes it can see literally in the source.
   */
  swatchColor?: string;
}

interface DoughnutSectionProps {
  title: string;
  total: string;
  label: string;
  gradient: string;
  legend?: LegendItem[];
  href?: string;
}

export function DoughnutSection({ title, total, label, gradient, legend, href }: DoughnutSectionProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-full items-center">

      {/* Header */}
      <div className="flex items-center justify-between w-full mb-6">
        <h2 className="text-sm font-black text-slate-800">{title}</h2>
        <button 
          onClick={() => href && navigate(href)}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
        >
          عرض الكل
        </button>
      </div>

      {/* Doughnut */}
      <div className="relative w-44 h-44 flex items-center justify-center mt-2 mb-8">
        <div
          className="absolute inset-0 rounded-full shadow-sm"
          style={{ background: gradient }}
        />
        <div className="absolute inset-[18px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <span className="text-[10px] font-bold text-slate-500 mb-0.5">{label}</span>
          <span className="text-3xl font-black text-slate-800">{total}</span>
        </div>
      </div>

      {/* Legend */}
      {legend && (
        <div className="w-full mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3.5">
          {legend.map((item, index) => (
            <div key={index} className="flex items-center justify-between w-full">
              <div className='gap-2 flex items-center'>
                <div
                  className={`w-2.5 h-2.5 rounded-full ${item.swatchColor ? '' : item.color}`}
                  style={item.swatchColor ? { backgroundColor: item.swatchColor } : undefined}
                />
                <span className="text-[11px] font-medium text-slate-500">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-600">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
