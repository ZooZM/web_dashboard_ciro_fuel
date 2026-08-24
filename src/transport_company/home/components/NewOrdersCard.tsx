import { NewOrderRow } from './NewOrderRow';

// ---- Mock Data (easy to replace with real API data) ----
const NEW_ORDERS = [
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
  { logo: '/transportCompany/home/petroAman.jpg', companyName: 'شركة بترو أمان', location: 'جدة - الرحاب', time: 'اليوم، 10:90 م', quantity: '20,000', fuelType: 'بنزين 98' },
];

export function NewOrdersCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col h-[420px]">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="bg-[#FF6D00] text-white text-[11px] font-black w-[22px] h-[22px] flex items-center justify-center rounded-full shadow-sm">
            {NEW_ORDERS.length}
          </span>
          <h2 className="text-[17px] font-black text-[#1e293b]">الطلبات الجديدة</h2>
        </div>
        <button className="text-[14px] font-bold text-[#2563eb] hover:text-blue-700">عرض الكل</button>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto min-h-0 pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
        {NEW_ORDERS.map((order, i) => (
          <NewOrderRow key={i} order={order} />
        ))}
      </div>

    </div>
  );
}
