import { FaFacebook, FaTelegram, FaWhatsapp } from 'react-icons/fa';

export function QuickContactSection() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center  w-full gap-2">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <img src="/transportCompany/HelpPage/comment.svg" className="w-5 h-5 object-contain" alt="" />
        </div>
        <h3 className="text-[#162155] font-black text-lg">تواصل معنا فوراً</h3>
      </div>

      {/* Blue Call Box */}
      <div className="bg-[#EEF2FF] rounded-2xl p-4 sm:p-6 flex items-center gap-4 mt-2">
        
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm shrink-0">
          <img src="/transportCompany/HelpPage/phone.svg" className="w-5 h-5 object-contain text-blue-600" alt="" />
        </div>

        <div className="flex flex-col text-right gap-1 flex-1">
          <span className="text-blue-600 font-bold text-sm">اتصال مباشر</span>
          <span className="text-slate-500 font-bold text-xs" dir="rtl">
            خط الدعم الفني - <span dir="ltr">920-xxxxxx</span>
          </span>
        </div>

      </div>

      {/* Social Links */}
      <div className="flex items-center justify-center gap-4 mt-2 mb-2">
        <span className="text-slate-400 font-bold text-sm mx-2">أو من خلال</span>
        <a href="#" className="w-8 h-8 rounded-full text-emerald-600 flex items-center justify-center hover:bg-blue-50 transition-colors">
          <FaWhatsapp className="w-6 h-6 fill-current" />
        </a>
        <a href="#" className="w-8 h-8 rounded-full text-sky-500 flex items-center justify-center hover:bg-sky-50 transition-colors">
          <FaTelegram className="w-6 h-6 fill-current" />
        </a>
        <a href="#" className="w-8 h-8 rounded-full text-blue-500 flex items-center justify-center hover:bg-emerald-50 transition-colors">
          <FaFacebook className="w-6 h-6 fill-current" />
        </a>
      </div>

    </div>
  );
}
