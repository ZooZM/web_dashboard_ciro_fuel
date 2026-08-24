import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TermCard } from './TermCard';
import { TermsSidebar } from './TermsSidebar';

const TERMS_DATA = [
  {
    id: 'section-1',
    number: '01',
    num: 1,
    title: 'مقدمة الشروط والأحكام',
    content: 'يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام المنصة أو الاستمرار في أي من خدماتها، حيث إن استخدامك للمنصة يُعد موافقة صريحة منك على الالتزام بجميع البنود الواردة في هذه الصفحة، وكذلك أي تحديثات أو تعديلات قد تطرأ عليها لاحقاً.'
  },
  {
    id: 'section-2',
    number: '02',
    num: 2,
    title: 'تحديث الشروط',
    content: 'تحتفظ الجهة المالكة للمنصة بحق تعديل أو تحديث هذه الشروط في أي وقت تراه مناسباً، ويُعد استمرارك في استخدام الخدمة بعد نشر التعديلات قبولاً ضمنياً بها.'
  },
  {
    id: 'section-3',
    number: '03',
    num: 3,
    title: 'مسؤولية صحة البيانات',
    content: 'يقر المستخدم بأنه مسؤول مسؤولية كاملة عن صحة ودقة البيانات التي يقوم بإدخالها أثناء إنشاء الحساب أو أثناء استخدام أي من خدمات المنصة، وأن أي بيانات غير صحيحة أو مضللة قد تؤدي إلى تعليق الحساب أو رفض الخدمة أو اتخاذ الإجراءات اللازمة وفقاً لما تراه الجهة المشغلة مناسباً.'
  },
  {
    id: 'section-4',
    number: '04',
    num: 4,
    title: 'سرية بيانات الدخول',
    content: 'كما يلتزم المستخدم بالحفاظ على سرية بيانات الدخول الخاصة به، وعدم مشاركتها مع أي طرف آخر، ويتحمل وحده المسؤولية عن أي استخدام يتم من خلال حسابه.'
  },
  {
    id: 'section-5',
    number: '05',
    num: 5,
    title: 'الاستخدام المشروع',
    content: 'ويُمنع استخدام المنصة لأي أغراض غير مشروعة أو مخالفة للأنظمة أو الآداب العامة أو ما قد يسبب ضرراً مباشراً أو غير مباشر للمنصة أو للمستخدمين الآخرين أو لأي طرف ثالث.'
  },
  {
    id: 'section-6',
    number: '06',
    num: 6,
    title: 'حماية النظام',
    content: 'كما يلتزم المستخدم بعدم محاولة العبث بالنظام أو الوصول غير المصرح به إلى أي جزء من المنصة أو تعطيل خدماتها أو التأثير على أدائها بأي وسيلة كانت.',
  },
];

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
        
        {/* Breadcrumb */}
        <div className="flex items-center justify-start w-full">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)}
              className="bg-white border border-slate-200 rounded-lg p-2 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
            <span className="text-[#162155] font-black text-sm cursor-pointer" onClick={() => navigate(-1)}>
              الشروط والأحكام
            </span>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between w-full">
           <div className="flex flex-col gap-2 text-right">
              <h2 className="text-[#162155] font-black text-2xl">الشروط و الأحكام</h2>
              <p className="text-slate-500 font-bold text-sm">أفهم حقوقك و واجباتك بحرص.</p>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 mt-4 md:mt-0 rounded-lg border border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 transition-colors font-bold text-sm shadow-sm shrink-0">
              <img src="/transportCompany/profilePage/support.svg" alt="" className="w-4 h-4 object-contain" />
              تواصل مع الدعم
           </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start relative pb-10">
          
          {/* Right Column: Sticky Sidebar (TOC) */}
          <div className="lg:col-span-1 hidden lg:block h-full relative">
            <TermsSidebar sections={TERMS_DATA.map(t => ({ id: t.id, title: t.title, num: t.num }))} />
          </div>

          {/* Left Column: Terms Cards */}
          <div className="lg:col-span-3 flex flex-col gap-4">
             {TERMS_DATA.map((term) => (
                <TermCard 
                  key={term.id}
                  id={term.id}
                  number={term.number}
                  title={term.title}
                  content={term.content}
                />
             ))}
          </div>

        </div>

      </div>
    </div>
  );
}
