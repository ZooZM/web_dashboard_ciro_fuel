import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOrderDetailContext } from './OrderDetailContext';
import { useOverrideVerification, useReassignVehicle } from '@/transport_company/orders/hooks/useStalledDelivery';
import { useTrucksList } from '@/transport_company/trucks/hooks/useTrucks';
import { useTanksList } from '@/transport_company/trucks/hooks/useTanks';
import { OrderStatus } from '@/constants/order-status';
import { Button } from '@/components/ui/button';
import { toast } from '@/lib/toast/toast';
import type { ApiError } from '@/lib/api/api-error';

const MIN_REASON_LENGTH = 10; // matches OverrideVerificationDto's own @MinLength(10)

/**
 * Feature 009 T098-T101/FR-054-058: override is offered only while a verification stage is
 * actually outstanding (ASSIGNED_TO_DRIVER/LOADING) and reassignment only before departure
 * (not yet IN_TRANSIT) — the same windows the platform itself enforces, surfaced here
 * rather than judged independently.
 */
export function StalledDeliveryCard() {
  const { t } = useTranslation();
  const { order, orderId } = useOrderDetailContext();
  const [reason, setReason] = useState('');
  const [reassignTruckId, setReassignTruckId] = useState('');
  const [reassignTankId, setReassignTankId] = useState('');
  const override = useOverrideVerification(orderId);
  const reassign = useReassignVehicle(orderId);
  const trucksQuery = useTrucksList(true);
  const tanksQuery = useTanksList();

  if (!order) return null;

  const canOverride = order.status === OrderStatus.ASSIGNED_TO_DRIVER || order.status === OrderStatus.LOADING;
  // Platform guard (`OrdersService.reassignVehicle`): only before departure, i.e. exactly
  // ASSIGNED_TO_DRIVER — LOADING already means the driver has departed for the warehouse.
  const canReassign = order.status === OrderStatus.ASSIGNED_TO_DRIVER;

  if (!canOverride && !canReassign) return null;

  function onOverride(): void {
    if (reason.trim().length < MIN_REASON_LENGTH) return;
    override.mutate(reason.trim(), {
      onSuccess: () => setReason(''),
      onError: (error) => toast.error((error as ApiError).message || t('assign.refusal.generic')),
    });
  }

  function onReassign(): void {
    if (!reassignTruckId || !reassignTankId) return;
    reassign.mutate(
      { truckId: reassignTruckId, tankId: reassignTankId },
      {
        onSuccess: () => {
          setReassignTruckId('');
          setReassignTankId('');
        },
        onError: (error) => {
          const err = error as ApiError;
          toast.error(err.error === 'ALREADY_DEPARTED' ? t('stalled.alreadyDeparted') : err.message);
        },
      },
    );
  }

  return (
    <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <h2 className="text-xl font-black text-[#162155]">{t('stalled.title')}</h2>

      {canOverride && (
        <div className="flex flex-col gap-3 border border-slate-200 rounded-xl p-4">
          <span className="text-sm font-bold text-slate-700">{t('stalled.overrideVerification')}</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('stalled.reasonPlaceholder')}
            rows={2}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
          />
          <Button
            onClick={onOverride}
            disabled={override.isPending || reason.trim().length < MIN_REASON_LENGTH}
            className="self-start"
          >
            {t('stalled.confirmOverride')}
          </Button>
        </div>
      )}

      {canReassign && (
        <div className="flex flex-col gap-3 border border-slate-200 rounded-xl p-4">
          <span className="text-sm font-bold text-slate-700">{t('stalled.reassignVehicle')}</span>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={reassignTruckId}
              onChange={(e) => setReassignTruckId(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value="">{t('assign.notSelected')}</option>
              {(trucksQuery.data?.items ?? []).map((truck) => (
                <option key={truck.id} value={truck.id}>{truck.plateNumber}</option>
              ))}
            </select>
            <select
              value={reassignTankId}
              onChange={(e) => setReassignTankId(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
            >
              <option value="">{t('assign.notSelected')}</option>
              {(tanksQuery.data?.items ?? []).map((tank) => (
                <option key={tank.id} value={tank.id}>{tank.code}</option>
              ))}
            </select>
          </div>
          <Button
            onClick={onReassign}
            disabled={reassign.isPending || !reassignTruckId || !reassignTankId}
            className="self-start"
          >
            {t('stalled.confirmReassign')}
          </Button>
        </div>
      )}
    </div>
  );
}
