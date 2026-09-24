import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { AdminCreditLimitRequestCard } from './AdminCreditLimitRequestCard';
import { AdminCreditLimitCard } from './AdminCreditLimitCard';

// spec 013 Phase 6 note: `StationsBlock` (`petrol_company/stations/components/owner_details`)
// was made real in Phase 6, wired to `GET/POST /users/:id/stations` — routes gated
// `@Roles(FUEL_COMPANY_ADMIN)` only. This SUPER_ADMIN oversight surface cannot call them
// (403), so it can no longer reuse that component as-is; this whole page is still a mock
// (`owner` below is hardcoded) and belongs to a later operator-oversight phase (016) that
// will need its own SUPER_ADMIN-facing read path. Left as a mock section rather than
// wired against a route that would 403 for this persona.

const MOCK_ORDERS = [
  { id: 'ORD-2024-256', stationName: 'محطة الرحاب', fuelType: 'بنزين 95', volume: '20,000 لتر', status: 'قيد التوصيل' },
  { id: 'ORD-2024-256', stationName: 'محطة الرحاب', fuelType: 'بنزين 95', volume: '20,000 لتر', status: 'مكتمل' },
  { id: 'ORD-2024-256', stationName: 'محطة الرحاب', fuelType: 'بنزين 95', volume: '20,000 لتر', status: 'مكتمل' },
];

export function AdminStationOwnerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [owner, setOwner] = useState({
    id: id || 'TRN-2024-001',
    name: 'محمد أحمد',
    isActive: true,
    joinDate: '2022/01/15',
    roleCode: 'TRN-2024-001',
    pendingInvoices: '140,000',
    totalInvoices: '201,000',
    monthlyOrders: '54',
    stationsCount: 3,
    email: 'ahmed.subale@trn.sa',
    mobile: '05xxxxxxxx',
    contactMobile: '920-xxxxxx',
    contactEmail: 'support@cirofuel.sa'
  });

  return (
    <div className="flex flex-col p-6 max-w-[1600px] mx-auto w-full gap-6" dir="rtl">
      
      {/* Header / Breadcrumb */}
      <div className="flex items-center justify-start gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="w-8 h-8 flex items-center justify-center bg-white rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <img src="/petrolCompany/station/arrowRight.svg" className="w-3 h-3 rotate-180" alt="Back" />
        </button>
        <span className="text-sm font-bold text-slate-400">ملاك المحطات / <span className="text-slate-900">{owner.name}</span></span>
      </div>

      {/* Main Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
            <img src="/petrolCompany/orderDetails/profile.jpg" alt="Avatar" className="w-14 h-14 " />
          </div>
          <div className="flex flex-col text-right items-start">
            <div className="flex items-center justify-start gap-3 mb-1">
              <span className="text-lg font-black text-slate-900">{owner.name}</span>
              <span className="bg-green-100/50 text-green-600 px-3 py-1 rounded-lg text-xs font-bold">{owner.isActive ? "نشط" : "غير نشط"}</span>
            </div>
            <span className="text-xs font-bold text-slate-400">تاريخ الانضمام {owner.joinDate} - PC-2024-011</span>
          </div>
        </div>
        <div className="flex items-center justify-center px-6 h-10 bg-red-50 text-red-500 rounded-xl font-bold text-sm gap-2 cursor-pointer hover:bg-red-100 transition-colors border border-red-200">
          <img src="/petrolCompany/owner/pause (1).svg" alt="" className="w-4 h-4" />
          إيقاف
        </div>
      </div>

      {/* Feature 013 Phase 14: `DueLitersBalanceCard` was dropped from this SUPER_ADMIN
          oversight page for the same reason as `StationsBlock` above — it now reads
          `GET /litre-balances`, `@Roles(FUEL_COMPANY_ADMIN)` only, so rendering it here
          would 403. */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stations Count */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col text-right items-start">
            <span className="text-xs font-bold text-slate-500 mb-1">عدد المحطات</span>
            <span className="text-xl font-black text-slate-900">{owner.stationsCount}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/owner/blueStation.svg" alt="" className="w-5 h-5" />
          </div>
        </div>

        {/* Monthly Orders */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col text-right items-start">
            <span className="text-xs font-bold text-slate-500 mb-1">طلبات الشهر</span>
            <span className="text-xl font-black text-slate-900">{owner.monthlyOrders}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/owner/orangeOrder.svg" alt="" className="w-5 h-5" />
          </div>
        </div>

        {/* Total Invoices */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col text-right items-start">
            <span className="text-xs font-bold text-slate-500 mb-1">إجمالي الفواتير</span>
            <span className="text-xl font-black text-slate-900">{owner.totalInvoices} <span className="text-[10px] text-slate-500">ر.س</span></span>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/owner/greenOrder.svg" alt="" className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Invoices */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm flex items-center justify-between gap-4">
          <div className="flex flex-col text-right items-start">
            <span className="text-xs font-bold text-slate-500 mb-1">الفواتير المستحقة</span>
            <span className="text-xl font-black text-slate-900">{owner.pendingInvoices} <span className="text-[10px] text-slate-500">ر.س</span></span>
          </div>
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <img src="/petrolCompany/owner/schedule.svg" alt="" className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* RIGHT COLUMN (lg:col-span-2) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Owner Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <img src="/petrolCompany/owner/user.svg" alt="" className="w-6 h-6" />
                </div>
                <span className="font-black text-slate-900 text-lg">معلومات المالك</span>
              </div>
              <button onClick={() => setIsEditModalOpen(true)} className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                  <img src="/transportCompany/orderPage/orderDetails/edit.svg" alt="" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right">
              {/* Name */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-slate-400 mb-2">الاسم الكامل</span>
                <span className="text-base font-black text-slate-900">{owner.name}</span>
              </div>

              {/* Code */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-slate-400">كود الحساب</span>
                  <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                    <img src="/petrolCompany/owner/lock.svg" alt="" className="w-3 h-3" />
                    غير قابل للتعديل
                  </div>
                </div>
                <span className="text-base font-black text-slate-900">{owner.roleCode}</span>
              </div>
              
              {/* Email */}
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold text-slate-400 mb-2">البريد الإلكتروني</span>
                <span className="text-base font-black text-slate-900">{owner.email}</span>
              </div>

              {/* Mobile */}
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-slate-400">رقم الجوال</span>
                  <div className="flex items-center gap-1 bg-slate-50 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold border border-slate-200">
                    <img src="/petrolCompany/owner/lock.svg" alt="" className="w-3 h-3" />
                    غير قابل للتعديل
                  </div>
                </div>
                <span className="text-base font-black text-slate-900">{owner.mobile}</span>
              </div>
            </div>
            <div className="mt-8 border border-dashed border-slate-300 rounded-xl bg-[#F8FAFC] p-4 text-center">
              <span className="text-xs font-bold text-slate-400">ملاحظات على الحساب أي وجدت..</span>
            </div>
          </div>

          {/* Admin read-only credit limit cards (no buttons) */}
          <AdminCreditLimitRequestCard />
          <AdminCreditLimitCard />
        </div>

        {/* LEFT COLUMN */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Contact Information */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/owner/details.svg" alt="" className="w-6 h-6" />
              </div>
              <span className="font-black text-slate-900 text-lg">معلومات التواصل</span>
            </div>

            <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center mb-3">
              <img src="/petrolCompany/orderDetails/profile.jpg" alt="Avatar" className="w-16 h-16" />
            </div>
            
            <span className="text-base font-black text-slate-900 mb-8">{owner.name}</span>

            <div className="w-full flex flex-col gap-5 text-right mb-8">
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-400 mb-1">رقم الجوال</span>
                <span className="text-sm font-black text-slate-900">{owner.contactMobile}</span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xs font-bold text-slate-400 mb-1">البريد الإلكتروني</span>
                <span className="text-sm font-black text-slate-900">{owner.contactEmail}</span>
              </div>
            </div>

            <button className="w-full py-3 rounded-xl border border-blue-100 text-blue-600 bg-white hover:bg-blue-50 transition-colors font-bold text-sm flex items-center justify-center gap-2">
              <img src="/petrolCompany/transporters/details/phone.svg" alt="" className=' w-4 h-4'/>
              تواصل مع المالك
            </button>
          </div>

          {/* Recent Orders Log */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
            <div className="w-full flex items-center justify-start gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <img src="/petrolCompany/owner/blueOrder.svg" alt="" className="w-6 h-6" />
              </div>
              <span className="font-black text-slate-900 text-lg">سجل الطلبات الأخيرة</span>
            </div>

            <div className="flex flex-col gap-4 mb-4">
              {MOCK_ORDERS.map((order, index) => (
                <div key={index} className={cn(
                  "flex items-center justify-between pb-4 w-full",
                  index !== MOCK_ORDERS.length - 1 && "border-b border-slate-100"
                )}>
                  
                  {/* Order Details (Right) */}
                  <div className="flex flex-col items-start flex-1 text-right">
                    <span className="text-xs font-black text-slate-900 mb-0.5">{order.id}</span>
                    <span className="text-[10px] font-bold text-slate-400">{owner.name} - {order.stationName}</span>
                  </div>

                  {/* Fuel Details (Middle) */}
                  <div className="flex flex-col items-center justify-center flex-1">
                    <span className="text-[10px] font-bold text-slate-500 mb-0.5">{order.fuelType}</span>
                    <span className="text-xs font-black text-slate-900">{order.volume}</span>
                  </div>
                  
                  {/* Status Badge (Left) */}
                  <div className="flex justify-end flex-1">
                    <div className={cn(
                      "px-3 py-1.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5",
                      order.status === 'قيد التوصيل' ? "bg-green-50 text-green-600 border border-green-200" : "bg-slate-50 text-slate-500 border border-slate-200"
                    )}>
                      {order.status}
                      <div className={cn("w-1.5 h-1.5 rounded-full", order.status === 'قيد التوصيل' ? "bg-green-500" : "bg-slate-400")}></div>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            <Link 
              to="/admin/orders"
              className="w-full py-3 mt-2 rounded-xl border border-slate-200 text-blue-600 bg-white hover:bg-slate-50 transition-colors font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
            >
              عرض المزيد
              <img src="/petrolCompany/owner/blueOrder.svg" alt="" className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      <MockEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        initialName={owner.name}
        initialEmail={owner.email}
        onSave={(name, email) => {
          setOwner(prev => ({ ...prev, name, email }));
        }}
      />
    </div>
  );
}

function MockEditModal({ 
  isOpen, 
  onClose, 
  initialName, 
  initialEmail, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialName: string; 
  initialEmail: string; 
  onSave: (name: string, email: string) => void;
}) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(name, email);
    toast.success('تم حفظ التعديلات بنجاح');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl flex flex-col gap-4 text-right" dir="rtl">
        <h2 className="text-xl font-black text-slate-900">تعديل معلومات المالك</h2>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">الاسم الكامل</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-bold text-slate-700">البريد الإلكتروني</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" 
            />
          </div>
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors">
            حفظ التعديلات
          </button>
          <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}
