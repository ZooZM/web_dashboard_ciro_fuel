export function TermsSidebar({ 
  sections 
}: { 
  sections: { id: string; title: string; num: number }[] 
}) {
  
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for a fixed header if any, else simple scrollIntoView
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <h3 className="text-[#162155] font-black text-xl text-center">المحتوي</h3>
      <div className="flex flex-col gap-5">
        {sections.map((section) => (
          <a 
            key={section.id} 
            onClick={() => handleScroll(section.id)}
            href={`#${section.id}`}
            className="flex items-center gap-2 text-right hover:text-blue-600 transition-colors group"
          >
            <span className="text-[#162155] group-hover:text-blue-600 font-black text-sm">{section.num}.</span>
            <span className="text-[#162155] group-hover:text-blue-600 font-black text-sm">{section.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
