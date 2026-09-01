import { useTranslation } from 'react-i18next';
import { TrackingProvider } from './TrackingContext';
import { TrackingSidebar } from './TrackingSidebar';
import { TrackingOrderDetails } from './TrackingOrderDetails';
import { TrackingDriverCard } from './TrackingDriverCard';
import { TrackingMapCard } from './TrackingMapCard';

export function TrackingPage() {
  const { t } = useTranslation();
  return (
    <div className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans" dir="rtl">
      <div className="mb-6 flex flex-col items-start text-right">
        <h1 className="text-2xl font-black text-slate-900">{t('tracking.title')}</h1>
      </div>

      <TrackingProvider>
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <TrackingSidebar />
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <TrackingOrderDetails />
            <TrackingDriverCard />
            <TrackingMapCard />
          </div>
        </div>
      </TrackingProvider>
    </div>
  );
}
