export function TermCard({ 
  id, 
  number, 
  title, 
  content 
}: { 
  id: string; 
  number: string; 
  title: string; 
  content: string; 
}) {
  return (
    <div id={id} className="bg-[#F8FDF9] border border-emerald-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-start w-full gap-2">
        <div className="flex items-center justify-center px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 font-bold text-sm shrink-0">
          {number}
        </div>
        <h3 className="text-[#162155] font-bold text-lg">{title}</h3>
      </div>
      <p className="text-slate-500 font-bold text-sm text-right leading-relaxed">
        {content}
      </p>
    </div>
  );
}
