import { ArrowRight, Info, Star } from 'lucide-react';

export function DriverRatingsCard() {
  const RATINGS = [
    { id: 1, orderText: 'ORD-2024-256 - محمد أحمد', rating: '4.1', comment: 'سائق ممتاز ونفذ المطلوب في تعليمات الطلب.' },
    { id: 2, orderText: 'ORD-2024-256 - محمد أحمد', rating: '4.1', comment: 'سائق ممتاز ونفذ المطلوب في تعليمات الطلب.' },
    { id: 3, orderText: 'ORD-2024-256 - محمد أحمد', rating: '4.1', comment: 'سائق ممتاز ونفذ المطلوب في تعليمات الطلب.' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6 w-full h-fit">
      {/* Header */}
      <div className="flex items-center w-full pb-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <Star className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <span className="text-[#162155] font-black text-lg">التقييمات</span>
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-4">
        {RATINGS.map((item) => (
          <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
            
            {/* Top row */}
            <div className="flex  items-center justify-between">
              
              {/* Right Side: Arrow & Title */}
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                </button>
                <span className="text-[#162155] font-black text-sm">{item.orderText}</span>
              </div>

              {/* Left Side: Rating */}
              <div className="flex items-center gap-1.5" dir="ltr">
                <span className="text-[#162155] font-black text-sm">{item.rating}</span>
                <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
              </div>

            </div>

            {/* Bottom Row: Comment */}
            <div className="bg-[#F8FAFC]  rounded-lg p-3 flex  items-center justify-start gap-2">
               <Info className="w-4 h-4 text-slate-400 shrink-0" />
               <span className="text-slate-400 font-normal text-xs">{item.comment}</span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
