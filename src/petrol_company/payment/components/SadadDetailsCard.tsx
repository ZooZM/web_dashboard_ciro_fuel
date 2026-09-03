import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SadadLogo } from './icons';

interface SadadDetailsCardProps {
  reference: string;
  onReferenceChange: (value: string) => void;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

// T175/T176/T177/FR-066/FR-066b: no payment provider is integrated (FR-066a), so there is
// no platform capability to mint a real, per-transaction SADAD invoice number or
// expiry — the previous mock's "INV-2024-158" / 14-digit code / validity date were
// invented with no backend source. What's left is the platform's static SADAD biller
// info (the one thing that genuinely doesn't vary per payment) plus the same
// reference/file evidence inputs `BankTransferDetailsCard` uses — this is never
// presented as proof anything has been paid.
export function SadadDetailsCard({ reference, onReferenceChange, file, onFileChange }: SadadDetailsCardProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white border border-[#E7E9EF] rounded-3xl p-6 shadow-sm flex flex-col gap-6 animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-start gap-4 w-full">
        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
           <img src="/petrolCompany/payment/bluePayment.svg" alt="" className="w-6 h-6 object-contain" />
        </div>
        <span className="text-[#162155] font-black text-lg">{t('platformAccount.sadadDetailsTitle')}</span>
      </div>

      <div className="bg-[#FFF7ED] border border-orange-400 border-dashed rounded-2xl p-4 flex items-center gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 px-4 py-2 flex items-center justify-center shrink-0">
          <SadadLogo className="h-8 w-auto" />
        </div>
        <span className="text-[#858C95] font-semibold text-sm text-right">{t('platformAccount.sadadInstructions')}</span>
      </div>

      <input
        type="text"
        value={reference}
        onChange={(e) => onReferenceChange(e.target.value)}
        placeholder={t('platformAccount.referencePlaceholder')}
        className="w-full border border-[#E7E9EF] rounded-xl p-3 text-sm font-semibold text-right focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 placeholder:text-slate-400"
      />

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
        {file ? (
          <span className="text-blue-600 font-bold text-sm">{file.name}</span>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-blue-600 font-bold text-sm">أضغط هنا للرفع</span>
            <span className="text-[#858C95] font-bold text-sm">أو اسحب الملف هنا</span>
          </div>
        )}
        <span className="text-[#A1A7AD] font-semibold text-[11px] tracking-wider uppercase">JPG, JPEG, PNG, PDF</span>
      </div>
    </div>
  );
}
