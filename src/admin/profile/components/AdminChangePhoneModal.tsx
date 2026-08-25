import { useRef } from 'react';
import { Check, ChevronDown, Lock } from 'lucide-react';

interface AdminChangePhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalStep: number;
  setModalStep: (step: number) => void;
}

export function AdminChangePhoneModal({ isOpen, onClose, modalStep, setModalStep }: AdminChangePhoneModalProps) {
  const otpRef0 = useRef<HTMLInputElement>(null);
  const otpRef1 = useRef<HTMLInputElement>(null);
  const otpRef2 = useRef<HTMLInputElement>(null);
  const otpRef3 = useRef<HTMLInputElement>(null);
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3];

  const handleOtpChange = (index: number, value: string) => {
    if (value.length === 1 && index < 3) {
      otpRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      otpRefs[index - 1]?.current?.focus();
    }
  };

  const handleClose = () => {
    onClose();
    setModalStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in" dir="rtl">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl relative animate-in zoom-in-95 duration-200 m-4">
        
        {/* Header */}
        <div className="flex items-center justify-between w-full mb-8">
          <div className="flex items-center gap-2">
             <Lock className="w-5 h-5 text-orange-400" strokeWidth={1.5} />
             <span className="text-[#162155] font-black text-lg">تغيير رقم الجوال</span>
          </div>
          <button 
            onClick={handleClose} 
            className="w-8 h-8 flex items-center justify-center bg-[#F8FAFC] rounded-lg hover:bg-slate-100 transition-colors"
          >
            <img src="/transportCompany/profilePage/X.svg" alt="Close" className="w-4 h-4 object-contain" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center w-full mb-8" dir="ltr">
           <div className="flex items-center gap-2">
              {/* Left Circle (Step 3) */}
              {modalStep === 1 || modalStep === 2 ? (
                <div className="w-4 h-4 rounded-full border-2 border-[#E7E9EF]"></div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-green-500 bg-white flex items-center justify-center text-green-500">
                   <Check className="w-4 h-4" />
                </div>
              )}

              <div className="w-8 h-[1px] border-t-2 border-dashed border-[#E7E9EF]"></div>
              
              {/* Middle Circle (Step 2) */}
              {modalStep === 1 ? (
                <div className="w-4 h-4 rounded-full border-2 border-[#E7E9EF]"></div>
              ) : modalStep === 2 ? (
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                   <img src="/petrolCompany/requests/details/comment.svg" alt="Comment" className="w-4 h-4 object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-green-500 bg-white flex items-center justify-center text-green-500">
                   <img src="/petrolCompany/requests/details/comment.svg" alt="Comment" className="w-3.5 h-3.5 object-contain" style={{ filter: 'invert(52%) sepia(85%) saturate(386%) hue-rotate(86deg) brightness(96%) contrast(87%)' }} />
                </div>
              )}
              
              <div className="w-8 h-[1px] border-t-2 border-dashed border-[#E7E9EF]"></div>
              
              {/* Right Circle (Step 1) */}
              {modalStep === 1 ? (
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 bg-white flex items-center justify-center text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                   <img src="/petrolCompany/transporters/details/phone.svg" alt="Phone" className="w-4 h-4 object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full border-2 border-green-500 bg-white flex items-center justify-center text-green-500">
                   <img src="/petrolCompany/transporters/details/phone.svg" alt="Phone" className="w-3.5 h-3.5 object-contain" style={{ filter: 'invert(52%) sepia(85%) saturate(386%) hue-rotate(86deg) brightness(96%) contrast(87%)' }} />
                </div>
              )}
           </div>
        </div>

        {modalStep === 1 ? (
          <>
            {/* Step 1: Phone Input */}
            <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
               <h3 className="text-[#162155] font-black text-base">أدخل الرقم الجديد</h3>
               <p className="text-[#858C95] text-xs font-medium">سيتم استخدام هذا الرقم لتسجيل الدخول لاحقاً عبر رمز تحقق (OTP)</p>
            </div>

            <div className="w-full mb-8">
               <div className="flex items-center border border-[#E7E9EF] rounded-xl overflow-hidden h-12 focus-within:border-blue-500 transition-colors" dir="ltr">
                  <div className="flex items-center gap-2 px-4 h-full bg-[#F8FAFC] border-r border-[#E7E9EF]">
                     <img src="/petrolCompany/transporters/details/phone.svg" alt="Phone" />
                     <span className="text-[#162155] font-bold text-sm">+966</span>
                     <ChevronDown className="w-4 h-4 text-[#858C95]" />
                  </div>
                  <input 
                    type="text" 
                    placeholder="5X XXX XXXX" 
                    className="flex-1 h-full px-4 outline-none text-[#162155] font-bold text-left placeholder:text-[#858C95]/50"
                    dir="ltr"
                  />
               </div>
            </div>

            <div className="flex items-center gap-4 w-full">
               <button 
                 onClick={handleClose} 
                 className="flex-1 py-3 rounded-xl border border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
               >
                  إلغاء
               </button>
               <button 
                 onClick={() => setModalStep(2)}
                 className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
               >
                  إرسال كود التحقيق
               </button>
            </div>
          </>
        ) : modalStep === 2 ? (
          <>
            {/* Step 2: OTP Input */}
            <div className="flex flex-col items-center justify-center gap-2 mb-8 text-center">
               <p className="text-[#858C95] text-xs font-bold" dir="rtl">
                  تم إرسال رمز مكون من 4 أرقام إلى <span className="text-[#162155]" dir="ltr">+966 5xxxxxxxx</span>
               </p>
            </div>

            <div className="flex items-center justify-center gap-3 mb-6" dir="ltr">
               {[0, 1, 2, 3].map((index) => (
                 <input 
                   key={index}
                   ref={otpRefs[index]}
                   type="text" 
                   maxLength={1} 
                   onChange={(e) => handleOtpChange(index, e.target.value)}
                   onKeyDown={(e) => handleOtpKeyDown(index, e)}
                   className="w-12 h-14 rounded-xl border border-[#E7E9EF] text-center text-xl font-black text-[#162155] outline-none focus:border-blue-500 transition-colors" 
                 />
               ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-4 mb-8">
               <p className="text-[#858C95] text-xs font-bold">
                  لم يصلك الرمز ؟ <button className="text-blue-600 font-bold hover:underline">إعادة إرسال الكود</button>
               </p>
            </div>

            <div className="flex items-center gap-4 w-full">
               <button 
                 onClick={() => setModalStep(1)} 
                 className="flex-1 py-3 rounded-xl border border-blue-600 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
               >
                  رجوع
               </button>
               <button 
                 onClick={() => setModalStep(3)}
                 className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
               >
                  تأكيد
               </button>
            </div>
          </>
        ) : (
          <>
            {/* Step 3: Success */}
            <div className="flex flex-col items-center justify-center w-full mb-8 mt-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <Check className="w-6 h-6 text-green-500" strokeWidth={3} />
              </div>
              <h3 className="text-[#162155] font-black text-base">تم تغيير رقم الجوال بنجاح</h3>
            </div>

            <div className="w-full">
               <button 
                 onClick={handleClose}
                 className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
               >
                  تم
               </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
