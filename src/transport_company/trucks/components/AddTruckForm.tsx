import React from 'react';

interface AddTruckFormProps {
  onCancel: () => void;
  entityName: string;
}

export function AddTruckForm({ onCancel, entityName }: AddTruckFormProps) {
  return (
    <div className="flex flex-col gap-12 w-full relative pb-16">
      {/* Row 1: License Plate Inputs */}
      <div className="flex justify-center w-full mt-4">
        <div className="flex items-center gap-6 lg:gap-10">

          {/* Numbers */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3" dir="ltr">
              <input type="text" maxLength={1} placeholder="." className="w-14 h-16 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
              <input type="text" maxLength={1} placeholder="." className="w-14 h-16 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
              <input type="text" maxLength={1} placeholder="." className="w-14 h-16 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
              <input type="text" maxLength={1} placeholder="." className="w-14 h-16 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
            </div>
            <span className="text-sm font-bold text-slate-400">أرقام</span>
          </div>

          {/* Separator / Title */}
          <div className="flex flex-col items-center justify-center -mt-8">
            <span className="text-sm font-black text-slate-900 mb-2">رقم اللوحة</span>
            <div className="w-4 h-[3px] bg-slate-900 rounded-full"></div>
          </div>

          {/* Letters */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3" dir="ltr">
              <input type="text" maxLength={1} placeholder="." className="w-14 h-16 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
              <input type="text" maxLength={1} placeholder="." className="w-14 h-16 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
              <input type="text" maxLength={1} placeholder="." className="w-14 h-16 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
            </div>
            <span className="text-sm font-bold text-slate-400">حروف</span>
          </div>

        </div>
      </div>

      {/* Row 2: NFC Card & Ciro Pay */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full max-w-5xl mx-auto">

        {/* Right Column (in RTL): NFC Card */}
        <div className="flex flex-col gap-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm w-full lg:max-w-[400px] lg:mr-auto">
          <div className="flex justify-center items-center gap-2 mb-2">
            <img src="/transportCompany/trucks/addTruck/ Icon.svg" alt="NFC" className="w-6 h-6" />
            <span className="text-base font-bold text-slate-900">كارت سيرو NFC</span>
          </div>
          <div className="relative">
            <input type="text" placeholder="سيتم إدخال UID الكارت هنا تلقائياً بعد القراءة" className="w-full text-center text-xs font-bold text-slate-400 placeholder-slate-300 border border-slate-200 rounded-xl py-3.5 px-4 focus:outline-none bg-white" readOnly />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
          </div>
          <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-4 text-center flex flex-col gap-1.5">
            <div className="flex items-center justify-center gap-1.5 text-blue-600">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4.67334V4.66668M8 11.3333L8 6.66667M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z" stroke="#1E5FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span className="text-xs font-bold">يرجى وضع كارت سيرو NFC على جهاز القراءة ...</span>
            </div>
            <span className="text-xs font-bold text-blue-500">سيتم التقاط UID الكارت تلقائياً</span>
          </div>
        </div>

        {/* Left Column (in RTL): Ciro Pay Logo */}
        <div className="flex items-center justify-center gap-4 shrink-0 w-full lg:ml-auto">
          <style>
            {`
              @keyframes fade-pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.4; transform: scale(1.1); }
              }
              .animate-signal-1 { animation: fade-pulse 2s ease-in-out infinite; }
              .animate-signal-2 { animation: fade-pulse 2s ease-in-out infinite; animation-delay: 1s; }
            `}
          </style>
          <div className="animate-signal-1">
            <img src="/transportCompany/trucks/connecting.gif" className="w-10 h-20 object-contain transform rotate-180" alt="Connecting" />
          </div>
          <div className="w-[200px] h-[200px] rounded-2xl flex items-center justify-center bg-white border border-slate-100 shadow-sm overflow-hidden z-10">
            <img src="/transportCompany/trucks/addTruck/CiroPay.png" alt="CiroPay" className="w-full h-full object-contain p-2" />
          </div>
          <div className="animate-signal-2">
            <img src="/transportCompany/trucks/connecting.gif" className="w-10 h-20 object-contain " alt="Connecting" />
          </div>
        </div>

      </div>

      {/* Action Buttons (Absolute Bottom Left) */}
      <div className="absolute bottom-0 left-0 flex items-center justify-start gap-3">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-6 py-2.5 rounded-xl transition-colors text-sm font-bold" dir="ltr"
        >
          <span dir="rtl">إلغاء</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm" dir="ltr">
          <span dir="rtl">إضافة {entityName}</span>
          <img src="/transportCompany/trucks/whitePlus.svg" alt="Add" className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
