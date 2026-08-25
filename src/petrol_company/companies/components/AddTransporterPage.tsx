import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function AddTransporterPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full border border-[#E7E9EF] rounded-2xl" dir="rtl">

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/petrolCompany/companies')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          الشركات الناقلة / إضافة ناقل
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-black text-slate-900">إضافة شركة ناقلة</h1>
        <p className="text-sm font-bold text-slate-500">
          اربط شركة ناقلة مسجلة بالفعل عبر كود، أو أنشئ لها حساباً جديداً
        </p>
      </div>

      {/* Add by Code Section */}
      <div className="bg-[#F0F5FF] border border-[#E2E8F0] rounded-3xl p-6 md:p-8 flex flex-col xl:flex-row items-center justify-between gap-6 mb-8 relative z-10 shadow-sm">



        {/* Center - Icon and Title */}
        <div className="flex flex-col items-center justify-center flex-1 w-full xl:w-auto text-center shrink-0">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
            <img src="/petrolCompany/transporters/addTransporter/add.svg" alt="Add" className="w-7 h-7 filter brightness-0 invert" />
          </div>
          <h2 className="text-base font-black text-slate-700 mb-1">إضافة بكود ربط</h2>
          <p className="text-[11px] font-bold text-slate-400">
            للشركات الناقلة المسجلة بالفعل على المنصة
          </p>
        </div>

        {/* Left side in RTL (Last in HTML) - Input and Button */}
        <div className='flex flex-col items-center gap-3'>
          <div className="flex items-center gap-3 flex-1 w-full xl:w-auto justify-end">
            <div className="relative w-full sm:w-[260px] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm h-[46px]">
              <div className='flex items-center justify-center'>

                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500">
                  <img src="/petrolCompany/transporters/addTransporter/lock.svg" alt="Lock" className="w-5 h-5 filter" style={{ filter: 'invert(39%) sepia(91%) saturate(2311%) hue-rotate(210deg) brightness(97%) contrast(92%)' }} />
                </div>
                <input
                  type="text"
                  placeholder="أدخل كود الحساب"
                  className="w-full h-full py-2 pr-11 pl-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-slate-50 transition-colors"
                />
              </div>
            </div>
            <button className="bg-blue-600 text-white px-8 h-[46px] rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto shrink-0">
              ربط الشركة
            </button>

          </div>
          {/* Right side in RTL (First in HTML) - Info Text */}
          <div className="flex-1 w-full xl:w-auto flex justify-start">
            <div className="border border-dashed border-slate-300 rounded-xl px-4 py-8 bg-transparent text-center xl:text-right h-full flex items-center justify-center">
              <p className="text-xs font-bold text-slate-400 leading-relaxed w-full max-w-[400px] mx-auto xl:mx-0">
                لو الشركة الناقلة عندها حساب مسجل بالفعل على منصة CIRO FUEL،
                اطلب منها كود الربط من إعدادات حسابها، وأدخله هنا لربطها بشركتك
                مباشرة دون إنشاء حساب جديد.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="relative flex py-5 items-center mb-8">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold bg-[#F8FAFC] px-2">أو</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Right side - Form */}
        <div className="flex-1 w-full bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-start gap-2 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <img src="/petrolCompany/transporters/addTransporter/detail.svg" alt="" className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-slate-900">بيانات الحساب</h2>
          </div>

          <div className="flex flex-col gap-6">

            {/* Company Name & Logo */}
            <div className="flex items-start gap-6">
              <div className="flex-1 flex flex-row gap-6">
                <div className="w-24 h-24 bg-blue-50 rounded-2xl border border-blue-200 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors shrink-0">
                  <img src="/petrolCompany/transporters/addTransporter/image.svg" alt="Upload" className="w-10 h-10 mb-2 " />
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

            {/* Commercial Register & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-slate-700 mb-2">رقم السجل التجاري <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="رقم السجل التجاري"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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

            <div className="h-px bg-slate-100 my-2"></div>

            <p className="text-sm font-bold text-slate-400">بيانات المسؤول (نقطة التواصل الأساسية)</p>

            {/* Admin Name & Job Title */}
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

          <div className="h-px bg-slate-100 my-8"></div>

          <div className="flex items-center justify-end gap-4">
            <button
              onClick={() => navigate('/petrolCompany/companies')}
              className="bg-white text-red-500 border border-red-100 px-8 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors shadow-sm"
            >
              إلغاء
            </button>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
              إنشاء الحساب
            </button>
          </div>

        </div>

        {/* Left side - Sidebar Cards */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 shrink-0">

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

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900" dir="ltr">920-xxxxxx</span>
                <span className="text-xs font-bold text-slate-400">رقم الجوال</span>
              </div>

              <div className="h-px bg-slate-100 w-full"></div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">-</span>
                <span className="text-xs font-bold text-slate-400">المسؤول</span>
              </div>
            </div>
          </div>

          {/* Login Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full border-2 border-dashed border-blue-200 rounded-2xl pointer-events-none  "></div>
            <div className="flex flex-col gap-4 relative z-10 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <img src="/petrolCompany/transporters/addTransporter/about.svg" alt="" className="w-4 h-4 filter brightness-0 invert" />
                </div>
                <h3 className="text-base font-black text-blue-900">تسجيل الدخول</h3>
              </div>
              <p className="text-xs font-bold text-blue-600/80 leading-loose px-2">
                لا حاجة لإنشاء كلمة مرور. يقوم المسؤول بتسجيل الدخول دائماً برقم
                جواله، ويحصل على رمز تحقق (OTP) مكوّن من 4 أرقام عبر رسالة نصية
                لتفعيل حسابه والدخول للتطبيق.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-start gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/transporters/addTransporter/detail.svg" alt="" className="w-4 h-4  " />
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
                    تقوم الشركة لتبدأ بتسجيل ملاك محطاتها ومحطاتهم
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
