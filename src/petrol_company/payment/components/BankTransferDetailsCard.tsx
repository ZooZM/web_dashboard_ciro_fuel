import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyIcon } from './icons';

interface BankTransferDetailsCardProps {
  reference: string;
  onReferenceChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

// T175/T177/FR-066/FR-067: the IBAN/beneficiary/bank fields below are the platform's own
// static receiving-account details (there is nothing per-company or per-transaction to
// source them from — the platform has one bank account) — what records the payment is
// `reference`/`file` beneath them, at least one of which `PaymentPage` requires before
// submitting (the backend's own `PAYMENT_EVIDENCE_REQUIRED` refusal, mirrored client-side).
export function BankTransferDetailsCard({ reference, onReferenceChange, file, onFileChange }: BankTransferDetailsCardProps) {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-3xl p-6 shadow-sm flex flex-col gap-6 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-start gap-4 w-full">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
           <img src="/petrolCompany/payment/blueExchange.svg" alt="" className="w-4 h-4 object-contain" />
        </div>
        <span className="text-[#162155] font-black text-lg">بيانات التحويل البنكي</span>
      </div>

      <div className="flex flex-col gap-3">
         {/* Field 1 */}
         <div className="flex items-center justify-between border border-[#E7E9EF] rounded-xl p-3 bg-white">
            <span className="text-[#858C95] font-semibold text-xs w-24">رقم الآيبان</span>
            <span className="font-black text-[#162155] text-sm flex-1 text-center" dir="ltr">SA12 3456 7890 1234 5678</span>
            <div className="w-20 flex justify-end">
              {copiedField === 'iban' ? (
                <div className="flex items-center gap-1 text-blue-600 animate-in fade-in">
                  <span className="text-xs font-bold">تم النسخ</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : (
                <button onClick={() => handleCopy('SA12 3456 7890 1234 5678', 'iban')} className="text-blue-600 hover:text-blue-700 transition-colors">
                  <CopyIcon className="w-5 h-5" />
                </button>
              )}
            </div>
         </div>

         {/* Field 2 */}
         <div className="flex items-center justify-between border border-[#E7E9EF] rounded-xl p-3 bg-white">
            <span className="text-[#858C95] font-semibold text-xs w-24">اسم المستفيد</span>
            <span className="font-black text-[#162155] text-sm flex-1 text-center">بترو أمان للبترول</span>
            <div className="w-20 flex justify-end">
              {copiedField === 'name' ? (
                <div className="flex items-center gap-1 text-blue-600 animate-in fade-in">
                  <span className="text-xs font-bold">تم النسخ</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : (
                <button onClick={() => handleCopy('بترو أمان للبترول', 'name')} className="text-blue-600 hover:text-blue-700 transition-colors">
                  <CopyIcon className="w-5 h-5" />
                </button>
              )}
            </div>
         </div>

         {/* Field 3 */}
         <div className="flex items-center justify-between border border-[#E7E9EF] rounded-xl p-3 bg-white">
            <span className="text-[#858C95] font-semibold text-xs w-24">البنك</span>
            <span className="font-black text-[#162155] text-sm flex-1 text-center">مصرف الراجحي</span>
            <div className="w-20 flex justify-end">
              {copiedField === 'bank' ? (
                <div className="flex items-center gap-1 text-blue-600 animate-in fade-in">
                  <span className="text-xs font-bold">تم النسخ</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ) : (
                <button onClick={() => handleCopy('مصرف الراجحي', 'bank')} className="text-blue-600 hover:text-blue-700 transition-colors">
                  <CopyIcon className="w-5 h-5" />
                </button>
              )}
            </div>
         </div>

         {/* Reference input — satisfies FR-067's evidence requirement without a file */}
         <input
           type="text"
           value={reference}
           onChange={(e) => onReferenceChange(e.target.value)}
           placeholder={t('platformAccount.referencePlaceholder')}
           className="w-full border border-[#E7E9EF] rounded-xl p-3 text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400 mt-2"
         />

         {/* Dotted upload area */}
         <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-[#E7E9EF] rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
         >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center justify-center w-12 h-12">
               <svg width="42" height="42" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="6.81989" y="11.4556" width="20" height="14" rx="2" transform="rotate(-15 6.81989 11.4556)" fill="#2563EB"/>
                  <rect x="4" y="10" width="20" height="14" rx="2" fill="#2563EB"/>
                  <circle cx="9.5" cy="14.5" r="2.5" fill="white"/>
                  <path d="M4 19L9 14L13 18L18 13L24 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            {file ? (
              <span className="text-blue-600 font-bold text-sm">{file.name}</span>
            ) : (
              <div className="flex items-center gap-1 mt-1">
                 <span className="text-blue-600 font-bold text-sm">أضغط هنا للرفع</span>
                 <span className="text-[#858C95] font-bold text-sm">أو اسحب الملف هنا</span>
              </div>
            )}
            <span className="text-[#A1A7AD] font-semibold text-[11px] tracking-wider uppercase">JPG, JPEG, PNG, PDF</span>
         </div>
      </div>
    </div>
  );
}
