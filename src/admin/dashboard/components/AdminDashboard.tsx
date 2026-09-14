import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSession } from '@/stores/session.store';
import { StatCard } from '@/transport_company/home/components/StatCard';
import { ProgressOrdersCard } from '@/transport_company/home/components/ProgressOrdersCard';
import { ActionCard } from '@/transport_company/home/components/ActionCard';
import { DoughnutSection } from '@/transport_company/home/components/DoughnutSection';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DateRangePopup } from '@/components/ui/date-range-popup';
import { usePlatformOverview } from '@/admin/dashboard/hooks/usePlatformOverview';
import { OrderStatusBucket, orderStatusBucketLabelKey } from '@/constants/order-status';
import type { PlatformOverview } from '@/admin/dashboard/api/platform-overview.api';

/**
 * spec 017 (operator dashboard) US1 — the operator's home screen, on real
 * platform figures.
 *
 * **Every number here used to be a literal**, and six of them carried a
 * fabricated trend caption ("16.30%", "من الأسبوع الماضي"). The platform
 * computes no period-over-period comparison anywhere, so not one of those
 * captions could ever have been true; they are REMOVED rather than recomputed
 * (FR-009, FR-078, recorded in this feature's Removals table). `StatCard`'s
 * `trend`, `trendUp` and `date` props are already optional — feature 009 made
 * them so for exactly this reason — so nothing is passed and the shared
 * component, which the transport company also renders, is untouched.
 *
 * The order chart now renders **six** segments rather than the mock's two, so
 * the segments can actually sum to the card above them (FR-006).
 */

// ── Chart palette ────────────────────────────────────────────────────────────
// One colour per bucket, keyed by name rather than indexed into an array: a
// bucket added later gets an explicit colour here or fails to compile, instead
// of silently reusing whichever neighbour happened to sit at its index.
const BUCKET_COLOURS: Record<OrderStatusBucket, string> = {
  NEW: '#3B82F6',
  IN_PROGRESS: '#8B5CF6',
  COMPLETED: '#10B981',
  REJECTED: '#EF4444',
  CANCELLED: '#94A3B8',
  NEEDS_ATTENTION: '#F59E0B',
};

const COMPANY_TYPE_COLOURS: Record<string, string> = {
  FUEL: '#10B981',
  TRANSPORT: '#3B82F6',
};

/**
 * Builds a `conic-gradient` from a list of counts.
 *
 * A zero-count segment contributes a zero-width slice rather than being
 * dropped, so the ring and the legend stay in the same order; a total of zero
 * renders one neutral ring rather than an invalid gradient.
 */
function buildGradient(segments: { count: number; colour: string }[]): string {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  if (total === 0) return 'conic-gradient(#E2E8F0 0% 100%)';
  let cursor = 0;
  const stops = segments.map((segment) => {
    const start = (cursor / total) * 100;
    cursor += segment.count;
    const end = (cursor / total) * 100;
    return `${segment.colour} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

/** Compact display for large figures, so a stat card never wraps. */
function compact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return String(Math.round(value * 100) / 100);
}

export function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useSession();
  const navigate = useNavigate();

  // Absent until the operator picks a range: the platform then resolves the
  // current calendar month and reports `isDefault`, so this screen never
  // computes a default of its own that could disagree with the platform's.
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { data, isLoading, isError, refetch } = usePlatformOverview(range);

  return (
    <div
      className="w-full p-4 md:p-6 flex-1 -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full font-sans"
      dir="rtl"
    >
      <div className="w-full max-w-[1400px] mx-auto p-2">
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-col text-right">
            <h1 className="text-2xl font-black text-slate-900">
              {t('adminDashboard.greeting', { name: user?.fullName?.split(' ')[0] ?? '' })}
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {t('adminDashboard.subtitle')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* T032 — wired, so picking a range actually refetches. */}
            <DateRangePopup
              className="w-[240px]"
              onApply={(applied) => setRange({ from: applied.from, to: applied.to })}
            />
          </div>
        </div>

        {/* FR-076: loading, failed and empty each render distinctly. */}
        {isLoading && <OverviewSkeleton label={t('adminDashboard.loading')} />}

        {isError && (
          <div className="bg-white border border-red-200 rounded-2xl p-6 text-right mb-6">
            <p className="text-sm font-bold text-red-700 mb-3">{t('adminDashboard.failed')}</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold"
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {data && <Overview data={data} />}

        {/* ── Orders in progress ── */}
        <motion.div layout className="grid grid-cols-1 gap-4 mb-6">
          <ProgressOrdersCard onViewAllClick={() => navigate('/admin/order-tracking')} />
        </motion.div>

        {/* ── Quick Actions (T035 — each wired to a route that exists) ── */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-6">
          <h2 className="text-sm font-black text-slate-800 mb-5 mr-2 text-right">
            {t('adminDashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ActionCard
              title={t('adminDashboard.actions.invoices')}
              subtitle={t('adminDashboard.actions.invoicesSubtitle')}
              icon="/petrolCompany/invoice.svg"
              bgClass="bg-[#F3E8FF] border border-[#E9D5FF]"
              onClick={() => navigate('/admin/invoices')}
            />
            <ActionCard
              title={t('adminDashboard.actions.addTransporter')}
              subtitle={t('adminDashboard.actions.addTransporterSubtitle')}
              icon="/petrolCompany/truck.svg"
              bgClass="bg-[#FEE2E2] border border-[#FECACA]"
              onClick={() => navigate('/admin/transport-companies/new')}
            />
            <ActionCard
              title={t('adminDashboard.actions.addStationOwner')}
              subtitle={t('adminDashboard.actions.addStationOwnerSubtitle')}
              icon="/transportCompany/home/users.svg"
              bgClass="bg-[#DBEAFE] border border-[#BFDBFE]"
              onClick={() => navigate('/admin/petrol-companies')}
            />
            <ActionCard
              title={t('adminDashboard.actions.announce')}
              subtitle={t('adminDashboard.actions.announceSubtitle')}
              icon="/Admin/Home/notification.svg"
              bgClass="bg-[#D1FAE5] border border-[#A7F3D0]"
              onClick={() => navigate('/admin/notifications')}
            />
          </div>
        </div>

        {/*
          T036 — REMOVED and recorded (FR-078): `MapTrackingCard`, whose
          four-way legend feature 009 already deleted from the transport
          composition for inventing counts no endpoint supplies, and
          `InvoicesSection`, a revenue breakdown the platform computes nowhere.
          Both rendered invented figures on this screen. The second
          `ProgressOrdersCard` — which duplicated the first verbatim — goes with
          them. `FuelIcon` went too: it was imported and never rendered.
        */}
      </div>
    </div>
  );
}

function Overview({ data }: { data: PlatformOverview }) {
  const { t } = useTranslation();

  const orderSegments = data.breakdown.byOrderBucket.map((segment) => ({
    ...segment,
    colour: BUCKET_COLOURS[segment.bucket],
  }));
  const companySegments = data.breakdown.byCompanyType.map((segment) => ({
    ...segment,
    colour: COMPANY_TYPE_COLOURS[segment.type] ?? '#94A3B8',
  }));
  const companyTotal = companySegments.reduce((sum, s) => sum + s.count, 0);

  return (
    <>
      {/* ── Stat Cards ── no trend, no trendUp, no date (FR-009) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
        <StatCard
          title={t('adminDashboard.cards.fuelCompanies')}
          value={String(data.pointInTime.fuelCompanies)}
          icon="/Admin/Home/gunStation.svg"
          iconBgClass="bg-[#E8F5E9]"
        />
        <StatCard
          title={t('adminDashboard.cards.transportCompanies')}
          value={String(data.pointInTime.transportCompanies)}
          icon="/petrolCompany/truck.svg"
          iconBgClass="bg-[#FFF7ED]"
        />
        <StatCard
          title={t('adminDashboard.cards.stations')}
          value={String(data.pointInTime.stations)}
          icon="/Admin/Home/station.svg"
          iconBgClass="bg-[#F3E8FF]"
        />
        <StatCard
          title={t('adminDashboard.cards.orders')}
          value={compact(data.period.orderCount)}
          icon="/Admin/Home/chart.svg"
          iconBgClass="bg-[#FEE2E2]"
        />
        <StatCard
          title={t('adminDashboard.cards.tradingVolume')}
          value={compact(data.period.orderValue)}
          unit={t('common.currency')}
          icon="/Admin/Home/dollar.svg"
          iconBgClass="bg-[#E8F5E9]"
        />
        <StatCard
          title={t('adminDashboard.cards.litres')}
          value={compact(data.period.litresMoved)}
          unit={t('common.litre')}
          icon="/Admin/Home/quantities.svg"
          iconBgClass="bg-[#E8F5E9]"
        />
      </div>

      {/*
        FR-001a — the three period figures are counted on two different bases,
        and saying so IS the requirement. Two figures under one date range
        answering on different bases, with nothing explaining it, reads as a bug
        in one of them.
      */}
      <p className="text-[11px] font-semibold text-slate-500 text-right mb-6 leading-relaxed">
        {t('adminDashboard.basisNote')}
        {data.period.isDefault ? ` · ${t('adminDashboard.defaultPeriod')}` : ''}
      </p>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <DoughnutSection
          title={t('adminDashboard.charts.companies')}
          total={String(companyTotal)}
          label={t('adminDashboard.charts.companyUnit')}
          gradient={buildGradient(companySegments)}
          legend={companySegments.map((segment) => ({
            label: t(`adminDashboard.companyType.${segment.type}`),
            value: String(segment.count),
            color: '',
            // The swatch is driven by the SAME colour map the ring uses, so the
            // two cannot disagree about which slice is which.
            swatchColor: segment.colour,
          }))}
        />
        <DoughnutSection
          title={t('adminDashboard.charts.orders')}
          total={String(data.period.orderCount)}
          label={t('adminDashboard.charts.orderUnit')}
          gradient={buildGradient(orderSegments)}
          // SIX segments, not the mock's two — zeros included, so the segments
          // sum to the card above (FR-006) and an empty bucket reads as "none"
          // rather than as "not computed".
          legend={orderSegments.map((segment) => ({
            label: t(orderStatusBucketLabelKey(segment.bucket)),
            value: String(segment.count),
            color: '',
            swatchColor: segment.colour,
          }))}
        />
      </div>
    </>
  );
}

/** FR-076 — loading renders distinctly from empty and from failed. */
function OverviewSkeleton({ label }: { label: string }) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-2xl p-4 min-h-[100px] animate-pulse"
          />
        ))}
      </div>
      <p className="text-xs font-semibold text-slate-400 text-right">{label}</p>
    </div>
  );
}
