import { AssignmentProvider, useAssignment } from './AssignmentContext';
import { OrderAssignHeader } from './OrderAssignHeader';
import { AssignMapCard } from './AssignMapCard';
import { AssignOrderDataCard } from './AssignOrderDataCard';
import { AssignSelectionCard } from './AssignSelectionCard';
import { AssignLists } from './AssignLists';
import { useTranslation } from 'react-i18next';

function OrderAssignContent() {
  const { t } = useTranslation();
  const { order, orderLoading, isAssignable } = useAssignment();

  if (orderLoading) {
    return <p className="p-6 text-sm text-slate-400">{t('common.loading')}</p>;
  }
  if (!order) {
    return <p className="p-6 text-sm text-slate-400">{t('errors.notFound')}</p>;
  }
  if (!isAssignable) {
    // FR-006: an order that is no longer ROUTED_TO_TRANSPORT (already assigned by another
    // admin, or cancelled) is refused rather than shown a stale assignment screen.
    return <p className="p-6 text-sm text-amber-600">{t('assign.notAssignable')}</p>;
  }

  return (
    <>
      <OrderAssignHeader />
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <AssignOrderDataCard />
          </div>
          <div className="lg:col-span-1">
            <AssignMapCard />
          </div>
        </div>
        <AssignSelectionCard />
        <AssignLists />
      </div>
    </>
  );
}

export function OrderAssignPage() {
  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full" dir="rtl">
      <AssignmentProvider>
        <OrderAssignContent />
      </AssignmentProvider>
    </div>
  );
}
