import { CustomGoogleMap } from '@/components/ui/CustomGoogleMap';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Feature 009 T112/T117/SC-005: the four-way legend ("not received"/"late"/"delivering"/
 * "en route", counts 2/1/12/3) was fabricated — no endpoint breaks trackable orders down at
 * that granularity (`GET /orders/summary` gives aggregate counts only). Dropped rather than
 * invented, the same precedent as InvoicesSection/DoughnutSection elsewhere in this
 * composition. Header text was also hardcoded Arabic-only; moved to i18n.
 */
export function MapTrackingCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mapCenter = { lat: 24.7136, lng: 46.6753 }; // Riyadh coordinates

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col h-[420px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-black text-slate-800">{t('tracking.liveTitle')}</h2>
        <button
          onClick={() => navigate('/transport/tracking')}
          className="text-[11px] font-bold text-blue-600 hover:text-blue-700"
        >
          {t('dashboard.viewAll')}
        </button>
      </div>

      {/* Map Image */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
        <CustomGoogleMap
          center={mapCenter}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
