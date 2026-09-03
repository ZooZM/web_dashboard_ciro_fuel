import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';
import { SadadLogo } from './icons';

interface PaymentMethodCardProps {
  paymentMethod: 'sadad' | 'bank' | null;
  setPaymentMethod: (method: 'sadad' | 'bank') => void;
}

export function PaymentMethodCard({ paymentMethod, setPaymentMethod }: PaymentMethodCardProps) {
  return (
    <div className="bg-white border border-[#E7E9EF] rounded-3xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-3 w-full">
        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
           <img src="/petrolCompany/payment/bluePayment.svg" alt="" className="w-4 h-4 object-contain" />
        </div>
        <span className="text-[#162155] font-black text-lg">اختر طريقة الدفع</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setPaymentMethod('bank')}
          className={cn("relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all", paymentMethod === 'bank' ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" : "border-[#E7E9EF] bg-white hover:border-blue-200")}
        >
          {paymentMethod === 'bank' && (
            <div className="absolute top-3 right-3 text-blue-600">
              <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
            </div>
          )}
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", paymentMethod === 'bank' ? "bg-blue-600" : "bg-blue-50")}>
             <img src={paymentMethod === 'bank' ? "/petrolCompany/payment/whiteExchange.svg" : "/petrolCompany/payment/blueExchange.svg"} alt="" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col items-center gap-1">
             <span className="text-[#162155] font-black text-lg mt-1">تحويل بنكي</span>
             <span className="text-[#858C95] font-bold text-xs mt-0.5">إرفاق الإيصال</span>
          </div>
        </button>

        <button 
          onClick={() => setPaymentMethod('sadad')}
          className={cn("relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all", paymentMethod === 'sadad' ? "border-blue-500 bg-blue-50/50 ring-1 ring-blue-500" : "border-[#E7E9EF] bg-white hover:border-blue-200")}
        >
          {paymentMethod === 'sadad' && (
            <div className="absolute top-3 right-3 text-blue-600">
              <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
            </div>
          )}
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-colors", paymentMethod === 'sadad' ? "bg-blue-600" : "bg-blue-50")}>
             <img src={paymentMethod === 'sadad' ? "/petrolCompany/payment/whitePayment.svg" : "/petrolCompany/payment/bluePayment.svg"} alt="" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex flex-col items-center gap-1">
             <SadadLogo className="h-6 w-auto" />
             <span className="text-[#858C95] font-bold text-xs mt-1">كود الفاتورة للدفع</span>
          </div>
        </button>
      </div>
    </div>
  );
}
