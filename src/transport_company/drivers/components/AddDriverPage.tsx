import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AddDriverPage() {
  const navigate = useNavigate();

  // state for truck option
  const [truckOption, setTruckOption] = useState<'new' | 'registered'>('new');

  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] min-h-full" dir="rtl">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 cursor-pointer w-fit" onClick={() => navigate('/transport/drivers')}>
        <button className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
          <img src="/petrolCompany/requests/details/chevronRight.svg" alt="Back" className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors">
          السائقين / إضافة سائق جديد
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-2xl font-black text-slate-900">إضافة سائق جديد</h1>
        <p className="text-sm font-bold text-slate-500">
          ضم سائق جديد و سجل شاحنته ضمن أسطول الشركة
        </p>
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
            
            {/* Owner Name & Logo */}
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

            

            {/* Iqama & Phone */}
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
                <label className="text-sm font-bold text-slate-700 mb-2">رقم الإقامة / الهوية</label>
                <input 
                  type="text" 
                  placeholder="5X XXX XXXX"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-left"
                  dir="ltr"
                />
              </div>

          
              
            </div>

            {/* Truck Section */}
            <div className="h-px bg-slate-100 my-2"></div>
            
            <div className="flex items-center justify-start gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <img src="/transportCompany/orderPage/AssignPage/truck.svg" alt="" className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-black text-slate-900">الشاحنة</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Option: Add New Truck */}
              

              {/* Option: Registered Truck */}
              <div 
                onClick={() => setTruckOption('registered')}
                className={`relative flex flex-col items-center justify-center p-6 rounded-xl border cursor-pointer transition-colors h-32 ${truckOption === 'registered' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
              >
                {truckOption === 'registered' && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${truckOption === 'registered' ? 'bg-blue-200' : 'bg-slate-100'}`}>
                  <img src="/transportCompany/orderPage/AssignPage/truck.svg" alt="" className={`w-5 h-5`} />
                </div>
                <span className={`text-sm font-bold ${truckOption === 'registered' ? 'text-blue-900' : 'text-slate-500'}`}>شاحنة مسجلة</span>
              </div>

              <div 
                onClick={() => setTruckOption('new')}
                className={`relative flex flex-col items-center justify-center p-6 rounded-xl border cursor-pointer transition-colors h-32 ${truckOption === 'new' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}
              >
                {truckOption === 'new' && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${truckOption === 'new' ? 'bg-blue-600' : 'bg-slate-100'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={truckOption === 'new' ? 'text-white' : 'text-slate-400'}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </div>
                <span className={`text-sm font-bold ${truckOption === 'new' ? 'text-blue-900' : 'text-slate-500'}`}>إضافة شاحنة جديدة</span>
              </div>
            </div>



            {/* License Plate Input */}
            <div className="flex flex-col items-center justify-center mt-6 gap-2">
                <div className="flex items-center gap-6">

                     {/* Letters */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2" dir="ltr">
                            <input type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            <input type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            <input type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            <input type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">حروف</span>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                        <span className="text-sm font-black text-slate-900 mb-1">رقم اللوحة</span>
                        <div className="w-4 h-0.5 bg-slate-300"></div>
                    </div>
                    {/* Numbers */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2" dir="ltr">
                            <input type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            <input type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                            <input type="text" maxLength={1} className="w-12 h-14 text-center text-xl font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">أرقام</span>
                    </div>


                 
                </div>
            </div>

          </div>
          
          <div className="h-px bg-slate-100 my-8"></div>
          
          <div className="flex items-center justify-start gap-4 flex-row-reverse">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm">
              إنشاء الحساب
            </button>
            <button 
              onClick={() => navigate('/transport/drivers')}
              className="bg-white text-red-500 border border-red-100 px-8 py-3 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors shadow-sm"
            >
              إلغاء
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
                <span className="text-base font-black text-slate-900 mb-1">اسم السائق</span>
                <span className="text-sm font-bold text-slate-900" dir="ltr">920-xxxxxx</span>
              </div>
              
              <div className="h-px bg-slate-100 w-full"></div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900">-</span>
                <span className="text-xs font-bold text-slate-400">رقم الإقامة</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-slate-900" dir="ltr">920-xxxxxx</span>
                <span className="text-xs font-bold text-slate-400">رقم الجوال</span>
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
              <p className="text-xs font-bold text-blue-600/80 leading-loose px-2">
                لا حاجة لإنشاء كلمة مرور. يقوم السائق بتسجيل الدخول دائماً برقم
                جواله، ويحصل على رمز تحقق (OTP) مكوّن من 4 أرقام عبر رسالة نصية
                لتفعيل حسابه والدخول للتطبيق.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-start gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/transporters/addTransporter/detail.svg" alt="" className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900">الخطوات التالية بعد الإنشاء</h3>
            </div>
            
            <div className="flex flex-col gap-6 relative">
              
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
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 text-xs font-black flex items-center justify-center shrink-0 border-2 border-white shadow-sm mt-0.5">
                  2
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 mb-1">استقبال الطلبات</span>
                  <span className="text-[10px] font-bold text-slate-400 leading-relaxed">
                    السائق جاهز لتلقي الرحلات
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
