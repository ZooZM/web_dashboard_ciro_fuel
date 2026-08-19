import { FaqAccordionItem } from './FaqAccordionItem';

export function FaqSection() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex items-center gap-2 w-full">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
          <img src="/HelpPage/questionMark.svg" className="w-5 h-5 object-contain" alt="" />
        </div>
        <h3 className="text-[#162155] font-black text-lg">أكثر المواضيع بحثاً</h3>
      </div>

      {/* Accordions */}
      <div className="flex flex-col gap-4">
        
        <FaqAccordionItem  title="طلبيات الوقود" icon="/HelpPage/station.svg">
          {/* Question 1 */}
          <div className="flex flex-col gap-2 text-right">
            <h4 className="text-[#162155] font-black text-base">هل ممكن أطلب و أدفع مرة أخري ؟</h4>
            <p className="text-slate-500 font-bold text-sm">نعم, تقدر تطلب شحنتك و فاتورة سداد تأجل للشحنة القادمة.</p>
          </div>
          
          {/* Divider */}
          <div className="border-t border-dashed border-orange-300 w-full" />
          
          {/* Question 2 */}
          <div className="flex flex-col gap-2 text-right">
            <h4 className="text-[#162155] font-black text-base">هل ممكن أطلب و أدفع مرة أخري ؟</h4>
            <p className="text-slate-500 font-bold text-sm">نعم, تقدر تطلب شحنتك و فاتورة سداد تأجل للشحنة القادمة.</p>
          </div>
        </FaqAccordionItem>

        <FaqAccordionItem title="تأخير التوصيل" icon="/HelpPage/truck.svg">
          <div className="flex flex-col gap-2 text-right">
            <h4 className="text-[#162155] font-black text-base">ماذا أفعل عند تأخير التوصيل؟</h4>
            <p className="text-slate-500 font-bold text-sm">يرجى التواصل مع الدعم الفني وتزويدنا برقم الطلب للتحقق من حالة الشحنة.</p>
          </div>
        </FaqAccordionItem>

        <FaqAccordionItem title="طرق الدفع" icon="/HelpPage/payment.svg">
          <div className="flex flex-col gap-2 text-right">
            <h4 className="text-[#162155] font-black text-base">ما هي طرق الدفع المتاحة؟</h4>
            <p className="text-slate-500 font-bold text-sm">نقبل الدفع عبر التحويل البنكي، بطاقات الائتمان، والدفع عند الاستلام للعملاء المعتمدين.</p>
          </div>
        </FaqAccordionItem>

        <FaqAccordionItem title="الحساب و تسجيل الدخول" icon="/HelpPage/user.svg">
          <div className="flex flex-col gap-2 text-right">
            <h4 className="text-[#162155] font-black text-base">نسيت كلمة المرور الخاصة بي؟</h4>
            <p className="text-slate-500 font-bold text-sm">يمكنك إعادة تعيين كلمة المرور من خلال صفحة الدخول بالضغط على "نسيت كلمة المرور".</p>
          </div>
        </FaqAccordionItem>

      </div>

    </div>
  );
}
