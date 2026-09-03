import { useTranslation } from 'react-i18next';

interface FuelExchangeContactInfoProps {
  counterparty: { name: string; contactEmail: string; contactPhone: string };
}

// Feature 013 T233/FR-086b: the counterparty's real company-level contact details
// (`GET /fuel-exchange/requests/:id`'s own `counterparty` field) — the previous mock's
// fabricated named contact person, photo and masked phone number are dropped; the
// platform has no per-request contact person, only the company's own registered
// email/phone.
export function FuelExchangeContactInfo({ counterparty }: FuelExchangeContactInfoProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-start gap-2 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
          <img src="/petrolCompany/requests/details/details.svg" alt="" className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-black text-slate-900">{t('fuelExchange.contactInfo')}</h2>
      </div>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-3 text-blue-600 font-black text-2xl">
          {counterparty.name.charAt(0)}
        </div>
        <span className="text-base font-black text-slate-900">{counterparty.name}</span>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.phone')}</span>
          <span className="text-sm font-black text-slate-900" dir="ltr">{counterparty.contactPhone}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-slate-400 mb-1">{t('fuelExchange.email')}</span>
          <span className="text-sm font-black text-slate-900" dir="ltr">{counterparty.contactEmail}</span>
        </div>
      </div>

      <a
        href={`mailto:${counterparty.contactEmail}`}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-blue-200 text-blue-600 bg-white hover:bg-blue-50 transition-colors text-sm font-bold"
      >
        <img src="/transportCompany/orderPage/orderDetails/phone.svg" alt="" className="w-5 h-5 ml-2" />
        <span>{t('fuelExchange.contactCounterparty')}</span>
      </a>
    </div>
  );
}
