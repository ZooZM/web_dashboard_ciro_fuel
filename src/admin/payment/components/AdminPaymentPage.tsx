import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AmountCard } from '@/petrol_company/payment/components/AmountCard';
import { PaymentMethodCard } from '@/petrol_company/payment/components/PaymentMethodCard';
import { SadadDetailsCard } from '@/petrol_company/payment/components/SadadDetailsCard';
import { BankTransferDetailsCard } from '@/petrol_company/payment/components/BankTransferDetailsCard';

export function AdminPaymentPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'sadad' | 'bank' | null>(null);
  const [amountType, setAmountType] = useState<'full' | 'partial'>('full');
  const [partialAmount, setPartialAmount] = useState<number>(200000);
  // Feature 013 Phase 13: `SadadDetailsCard`/`BankTransferDetailsCard` gained a real
  // reference/file props contract for the FCA's own "pay the platform" flow. This
  // SUPER_ADMIN screen ("pay a fuel company its cashback") is a pre-existing mock with no
  // real submit action and no backend capability behind it (out of this feature's scope —
  // the platform never pays a company out through this flow); local no-op state is only
  // here to satisfy the shared components' props, not to record anything.
  const [reference, setReference] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const TOTAL_AMOUNT = 299060.50;

  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans animate-in fade-in duration-500" dir="rtl">
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center bg-white border border-[#E7E9EF] rounded-lg hover:bg-slate-50 transition-colors shrink-0">
            <ChevronRight className="w-5 h-5 text-[#162155]" />
          </button>
          <span className="text-[#858C95] font-bold text-sm">دفع كاش باك لبترو أمان</span>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2 items-center text-center mt-2 mb-4">
          <h1 className="text-2xl font-black text-[#162155]">اختر المبلغ وطريقة الدفع</h1>
          <p className="text-[#858C95] font-semibold text-sm">الدفع العمولة المستحقة للمنصة</p>
        </div>

        {/* Amount Card */}
        <AmountCard 
          amountType={amountType}
          setAmountType={setAmountType}
          partialAmount={partialAmount}
          setPartialAmount={setPartialAmount}
          totalAmount={TOTAL_AMOUNT}
        />

        {/* Payment Method Card */}
        <PaymentMethodCard 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />

        {/* Dynamic Details Card */}
        {paymentMethod === 'sadad' && (
          <SadadDetailsCard reference={reference} onReferenceChange={setReference} file={file} onFileChange={setFile} />
        )}
        {paymentMethod === 'bank' && (
          <BankTransferDetailsCard reference={reference} onReferenceChange={setReference} file={file} onFileChange={setFile} />
        )}

      </div>
    </div>
  );
}
