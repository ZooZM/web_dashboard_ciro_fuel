import { ChevronLeft } from 'lucide-react';
import { SupportTeamCard } from './SupportTeamCard';
import { ContactInfoCard } from './ContactInfoCard';
import { QuickContactSection } from './QuickContactSection';
import { OrderProblemSection } from './OrderProblemSection';
import { FaqSection } from './FaqSection';

export function HelpPage() {
  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* Breadcrumb / Back Button */}
        <div className="flex items-center justify-start gap-3 px-2">
          <button className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <span className="text-[#162155] font-bold text-sm">الدعم والمساعدة</span>
        </div>

        {/* Header Title */}
        <div className="flex flex-col gap-1 px-2 text-right">
          <h1 className="text-2xl font-black text-[#162155]">الدعم والمساعدة</h1>
          <p className="text-slate-500 font-bold text-sm">
            نحن هنا لمساعدتك - تواصل معنا مباشرة أو تصفح الأسئلة الأكثر شيوعاً
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content (2 Columns) */}
          <div className="lg:col-span-2 flex flex-col gap-6 mb-2">
            <QuickContactSection />
            <OrderProblemSection />
            <FaqSection />
          </div>

          {/* Left Sidebar (1 Column) */}
          <div className="lg:col-span-1 flex flex-col gap-6 ">
            <SupportTeamCard />
            <ContactInfoCard />
          </div>

        </div>
        
      </div>
    </div>
  );
}
