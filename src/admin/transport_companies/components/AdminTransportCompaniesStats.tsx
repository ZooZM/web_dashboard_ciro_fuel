import { useTranslation } from 'react-i18next';
import { CompanyStatus } from '@/constants/order-status';
import type { TransportCompany } from '@/admin/transport_companies/api/transport-companies.api';

/**
 * spec 017 (operator dashboard) T070/FR-025/FR-026 — figures derived from the
 * SAME `?type=TRANSPORT` result the list renders, so the cards and the rows
 * beneath them cannot disagree.
 *
 * That mattered more than it looked: until this feature the backend ignored
 * `type` entirely, so this screen's "transport companies" count was the
 * platform's whole company count, fuel companies included (research R2).
 *
 * The order total comes from the one batched volume call the page already
 * makes, summed here rather than fetched again. "Covered areas" is the count of
 * DISTINCT regions across every transporter — not a sum of per-company counts,
 * which would double-count a region two transporters both serve and could
 * exceed the platform's thirteen.
 */
export function AdminTransportCompaniesStats({
  companies,
  totalOrders,
}: {
  companies: TransportCompany[];
  totalOrders: number | undefined;
}) {
  const { t } = useTranslation();

  const activeCount = companies.filter((c) => c.status === CompanyStatus.ACTIVE).length;
  const coveredRegions = new Set(companies.flatMap((c) => c.servedRegions ?? [])).size;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatBox
        label={t('adminDashboard.cards.transportCompanies')}
        value={companies.length}
        icon="/Admin/transporter/blueTruck.svg"
        iconBg="bg-blue-50"
      />
      <StatBox
        label={t('companies.active')}
        value={activeCount}
        icon="/Admin/transporter/orangeTruck.svg"
        iconBg="bg-orange-50"
      />
      <StatBox
        label={t('transportCompanies.orderVolume')}
        value={totalOrders}
        icon="/petrolCompany/owner/greenOrder.svg"
        iconBg="bg-green-50"
      />
      <StatBox
        label={t('transportCompanies.coveredAreas')}
        value={coveredRegions}
        icon="/Admin/transporter/pin.svg"
        iconBg="bg-red-50"
      />
    </div>
  );
}

/** A figure that has not loaded renders as a dash, never as `0` (FR-076). */
function StatBox({
  label,
  value,
  icon,
  iconBg,
}: {
  label: string;
  value: number | undefined;
  icon: string;
  iconBg: string;
}) {
  return (
    <div className="bg-white border border-[#E7E9EF] rounded-2xl p-5 shadow-sm flex items-center justify-start gap-4">
      <div className="flex flex-col text-right order-2">
        <span className="text-[#858C95] text-xs font-bold mb-1">{label}</span>
        <span className="text-[#162155] text-2xl font-black">
          {value === undefined ? '—' : value.toLocaleString()}
        </span>
      </div>
      <div
        className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center shrink-0 order-1`}
      >
        <img src={icon} alt="" className="w-6 h-6 object-contain" />
      </div>
    </div>
  );
}
