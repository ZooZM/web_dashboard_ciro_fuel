import { OrderAssignHeader } from './OrderAssignHeader';
import { AssignMapCard } from './AssignMapCard';
import { AssignOrderDataCard } from './AssignOrderDataCard';
import { AssignSelectionCard } from './AssignSelectionCard';
import { AssignLists } from './AssignLists';

export function OrderAssignPage() {
  return (
    <div className="w-full flex-1 p-4 md:p-6 font-sans -mt-4 bg-[#F8FAFC] border border-[#E7E9EF] rounded-2xl min-h-full" dir="rtl">
      <OrderAssignHeader />

      <div className="flex flex-col gap-6">
        
        {/* Top Section: Map & Order Data */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2">
            <AssignOrderDataCard />
          </div>
          <div className="lg:col-span-1">
            <AssignMapCard />
          </div>
        </div>

        {/* Middle Section: Selection Box */}
        <AssignSelectionCard />

        {/* Bottom Section: Lists */}
        <AssignLists />
      </div>
    </div>
  );
}
