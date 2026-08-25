import { useNavigate } from 'react-router-dom';

export function AddPetrolCompanyPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full min-h-full flex flex-col p-4 md:p-6 font-sans bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl" dir="rtl">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/admin/petrol-companies')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          شركات البترول / إضافة شركة بترول
        </span>
      </div>

      {/* Header Titles */}
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-black text-slate-900">إضافة شركة بترول جديدة</h1>
        <p className="text-sm font-bold text-slate-500">
          سجل شركة بترول جديدة على المنصة وأنشئ حساب المسؤول
        </p>
      </div>

      {/* Main Content Layout - Flex-1 to stretch down */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1">
        
        {/* Right side - Form (Flex Column with Flex-1 to push footer down) */}
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col">
          {/* Section Header */}
          <div className="flex items-center justify-start gap-2 mb-8 shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <img src="/petrolCompany/transporters/addTransporter/detail.svg" alt="" className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">بيانات الحساب</h2>
          </div>

          {/* Form Fields - flex-1 pushes the footer away */}
          <div className="flex flex-col gap-6 flex-1">
            
            {/* Company Name & Logo */}
            <div className="flex items-start gap-6">
              <div className="flex-1 flex flex-row gap-6">
                <div className="w-24 h-24 bg-blue-50 rounded-2xl border border-blue-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors shrink-0">
                  <img src="/petrolCompany/transporters/addTransporter/image.svg" alt="Upload" className="w-10 h-10 mb-2" />
                  <span className="text-[10px] font-bold text-blue-500">+ شعار</span>
                </div>
                <div className='flex w-full mt-3 flex-col'>
                  <label className="text-sm font-bold text-slate-700 mb-2">اسم الشركة <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="اسم الشركة"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* City & Commercial Register */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">رقم السجل التجاري <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="رقم السجل التجاري"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
                  dir="ltr"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">المدينة / المقر الرئيسي <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="مقر الشركة الرئيسي"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Supervisor Data Header */}
            <div className="mt-4 mb-2">
              <h3 className="text-sm font-bold text-slate-500">بيانات المسؤول (نقطة التواصل الأساسية)</h3>
            </div>

            {/* Supervisor Name & Job Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">اسم المسؤول <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="اسم المسؤول ثلاثي"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">المسمى الوظيفي</label>
                <input 
                  type="text" 
                  placeholder="مثال: مدير عمليات"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">رقم الجوال <span className="text-red-500">*</span></label>
                <div className="flex items-center w-full h-[46px] border border-slate-200 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors bg-white">
                  
                  {/* Input field */}
                  <div className="flex flex-col justify-center flex-1 h-full px-4">
                    <span className="text-[9px] font-bold text-slate-400 absolute opacity-0 pointer-events-none">رقم الجوال</span>
                    <input 
                      type="text" 
                      placeholder="5X XXX XXXX"
                      className="w-full text-sm font-medium focus:outline-none placeholder:text-slate-400 bg-transparent text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Prefix Section (Right in RTL) */}
                  <div className="flex items-center justify-center px-4 gap-2 h-full border-r border-slate-200 shrink-0">
                    <span className="text-sm font-bold text-blue-600" dir="ltr">+966</span>
                    <img src="/petrolCompany/transporters/details/phone.svg" alt="Phone" className="w-5 h-5 filter" style={{ filter: 'invert(39%) sepia(91%) saturate(2311%) hue-rotate(210deg) brightness(97%) contrast(92%)' }} />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  placeholder="example@mail.com"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col">
              <textarea 
                rows={3}
                placeholder="ملاحظات إضافية عن الحساب..."
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

          </div>
          
          {/* Footer with Buttons (Stays at the bottom) */}
          <div className="mt-8 shrink-0">
            <div className="h-px bg-slate-100 mb-6"></div>
            
            <div className="flex items-center justify-end gap-4">
              <button 
                onClick={() => navigate('/admin/petrol-companies')}
                className="bg-white text-slate-600 border border-slate-200 px-8 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm"
              >
                إلغاء
              </button>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
                إنشاء الحساب
              </button>
            </div>
          </div>
          
        </div>

        {/* Left side - Sidebar Cards */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0 h-full">
          
          {/* Account Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-start gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/transporters/addTransporter/seen.svg" alt="" className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">ملخص الحساب</h3>
            </div>
            
            <div className="flex flex-col gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-base font-black text-slate-900 mb-1">اسم الشركة</span>
                <span className="text-xs font-bold text-slate-400">المدينة</span>
              </div>
              
              <div className="h-px bg-slate-100 w-full my-1"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900" dir="ltr">920-xxxxxx</span>
                <span className="text-xs font-bold text-slate-400">رقم الجوال</span>
              </div>

              <div className="h-px bg-slate-100 w-full my-1"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">-</span>
                <span className="text-xs font-bold text-slate-400">المسؤول</span>
              </div>
            </div>
          </div>

          {/* Login Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full border-[2px] border-dashed border-blue-400 rounded-2xl pointer-events-none "></div>
            <div className="flex flex-col gap-4 relative z-10 text-center">
              <div className="flex items-center justify-start gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <img src="/petrolCompany/transporters/addTransporter/about.svg" alt="" className="w-4 h-4 filter brightness-0 invert" />
                </div>
                <h3 className="text-base font-black text-blue-900">تسجيل الدخول</h3>
              </div>
              <p className="text-xs font-bold text-blue-600/80 leading-loose px-2 text-right">
                لا حاجة لإنشاء كلمة مرور. يقوم المسؤول بتسجيل الدخول دائماً برقم
                جواله، ويحصل على رمز تحقق (OTP) مكوّن من 4 أرقام عبر رسالة نصية
                لتفعيل حسابه والدخول للتطبيق.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex-1">
            <div className="flex items-center justify-start gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/transporters/addTransporter/detail.svg" alt="" className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">الخطوات التالية بعد الإنشاء</h3>
            </div>
            
            <div className="flex flex-col gap-6 relative">
              <div className="absolute right-3.5 top-2 bottom-2 w-0.5 bg-slate-100 z-0"></div>
              
              <div className="flex items-start gap-4 relative z-10 text-right">
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-0.5">
                  1
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 mb-1">إرسال رمز تفعيل للمسؤول</span>
                  <span className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    عبر رسالة نصية على رقم الجوال المسجل
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-4 relative z-10 text-right">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-0.5">
                  2
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 mb-1">إضافة ملاك المحطات</span>
                  <span className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    تقدر الشركة تبدأ تسجيل ملاك محطاتها ومحطاتهم
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-4 relative z-10 text-right">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-0.5">
                  3
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 mb-1">ربط شركات النقل</span>
                  <span className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    إضافة شركاء النقل عبر كود أو حساب جديد
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-4 relative z-10 text-right">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 text-xs font-black flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-0.5">
                  4
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 mb-1">استقبال الطلبات</span>
                  <span className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    الشركة جاهزة لمراجعة طلبات محطاتها
                  </span>
                </div>
              </div>
              
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
