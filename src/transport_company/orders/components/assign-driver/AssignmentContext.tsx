import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useOrderDetail } from '@/transport_company/orders/hooks/useOrders';
import { useCandidates } from '@/transport_company/orders/hooks/useCandidates';
import { useAssignDriver } from '@/transport_company/orders/hooks/useAssignDriver';
import { useTrucksList } from '@/transport_company/trucks/hooks/useTrucks';
import { useTanksList } from '@/transport_company/trucks/hooks/useTanks';
import { isAssignableOrderStatus } from '@/constants/order-status';
import { assignmentRefusalMessage } from './assignmentRefusal';
import type { ApiError } from '@/lib/api/api-error';
import type { Candidate } from '@/transport_company/orders/api/dispatch.api';
import type { Truck, Tank } from '@/transport_company/trucks/types';
import { DriverEligibility } from '@/constants/order-status';

interface AssignmentContextValue {
  orderId: string;
  order: ReturnType<typeof useOrderDetail>['data'];
  orderLoading: boolean;
  candidates: Candidate[];
  candidatesLoading: boolean;
  candidatesError: boolean;
  refetchCandidates: () => void;
  trucks: Truck[];
  tanks: Tank[];
  selectedDriverId: string | null;
  selectedTruckId: string | null;
  selectedTankId: string | null;
  selectDriver: (candidate: Candidate) => void;
  selectTruck: (truckId: string) => void;
  selectTank: (tankId: string) => void;
  // Feature 010 FR-008: required only when the selected candidate's eligibility is
  // OFFLINE — BUSY/INACTIVE are never assignable at all (FR-007 correction), so no reason
  // ever applies to them.
  reason: string;
  setReason: (reason: string) => void;
  reasonRequired: boolean;
  refusal: string | null;
  isAssignable: boolean;
  isConfirming: boolean;
  confirm: () => void;
}

const AssignmentContext = createContext<AssignmentContextValue | null>(null);

export function AssignmentProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const orderId = id ?? '';

  const orderQuery = useOrderDetail(orderId);
  const order = orderQuery.data;
  const isAssignable = order ? isAssignableOrderStatus(order.status) : false;

  const candidatesQuery = useCandidates(orderId, isAssignable);
  const trucksQuery = useTrucksList(true);
  const tanksQuery = useTanksList();
  const assign = useAssignDriver(orderId);

  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string | null>(null);
  const [selectedTankId, setSelectedTankId] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [refusal, setRefusal] = useState<string | null>(null);

  const candidates = candidatesQuery.data ?? [];
  const selectedDriver = candidates.find((c) => c._id === selectedDriverId);
  // Feature 010 FR-007/FR-008: only OFFLINE ever needs a reason — BUSY/INACTIVE are
  // refused outright by the platform regardless of one, so requiring it for them would
  // just be a dead-end field with no way to actually proceed.
  const reasonRequired = selectedDriver?.eligibility === DriverEligibility.OFFLINE;

  // FR-003: on selecting a driver, pre-select their suggested truck — `null` means
  // pre-select nothing, never "first available" (the operator must choose deliberately).
  function selectDriver(candidate: Candidate): void {
    setSelectedDriverId(candidate._id);
    setSelectedTruckId(candidate.suggestedTruck?._id ?? null);
    setReason('');
    setRefusal(null);
  }

  function selectTruck(truckId: string): void {
    setSelectedTruckId(truckId);
    setRefusal(null);
  }

  function selectTank(tankId: string): void {
    setSelectedTankId(tankId);
    setRefusal(null);
  }

  function confirm(): void {
    if (!selectedDriverId || !selectedTruckId || !selectedTankId) return;
    if (reasonRequired && !reason.trim()) return;
    setRefusal(null);
    assign.mutate(
      {
        driverId: selectedDriverId,
        truckId: selectedTruckId,
        tankId: selectedTankId,
        ...(reasonRequired ? { reason: reason.trim() } : {}),
      },
      {
        onError: (error) => {
          setRefusal(assignmentRefusalMessage(error as ApiError, t));
        },
      },
    );
  }

  const value = useMemo<AssignmentContextValue>(
    () => ({
      orderId,
      order,
      orderLoading: orderQuery.isLoading,
      candidates,
      candidatesLoading: candidatesQuery.isLoading,
      candidatesError: candidatesQuery.isError,
      refetchCandidates: () => void candidatesQuery.refetch(),
      trucks: trucksQuery.data?.items ?? [],
      tanks: tanksQuery.data?.items ?? [],
      selectedDriverId,
      selectedTruckId,
      selectedTankId,
      selectDriver,
      selectTruck,
      selectTank,
      reason,
      setReason,
      reasonRequired,
      refusal,
      isAssignable,
      isConfirming: assign.isPending,
      confirm,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      orderId,
      order,
      orderQuery.isLoading,
      candidates,
      candidatesQuery.isLoading,
      candidatesQuery.isError,
      trucksQuery.data,
      tanksQuery.data,
      selectedDriverId,
      selectedTruckId,
      selectedTankId,
      reason,
      reasonRequired,
      refusal,
      isAssignable,
      assign.isPending,
    ],
  );

  return <AssignmentContext.Provider value={value}>{children}</AssignmentContext.Provider>;
}

export function useAssignment(): AssignmentContextValue {
  const ctx = useContext(AssignmentContext);
  if (!ctx) throw new Error('useAssignment must be used within AssignmentProvider');
  return ctx;
}
