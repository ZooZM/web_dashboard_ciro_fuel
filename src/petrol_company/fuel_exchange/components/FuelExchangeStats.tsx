import { cn } from '@/lib/utils';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  iconBgClass: string;
  valueColor: string;
  titleColor: string;
}

interface FuelExchangeStatsProps {
  cards: StatCard[];
}

export function FuelExchangeStats({ cards }: FuelExchangeStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-start gap-4 shadow-sm">
          <div className={cn('w-10 h-10 flex items-center justify-center rounded-full shrink-0', card.iconBgClass)}>
            <img src={card.icon} alt="" className="w-5 h-5 object-contain" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <span className={cn('text-sm font-semibold', card.titleColor)}>{card.title}</span>
            <span className={cn('text-2xl font-black', card.valueColor)}>{card.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
