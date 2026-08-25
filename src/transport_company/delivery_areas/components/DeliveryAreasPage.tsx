import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DeliveryAreasPage() {
  const [expandedCompanies, setExpandedCompanies] = useState<string[]>(['comp1']);
  const [editingAreaId, setEditingAreaId] = useState<string | null>('area1');

  const toggleCompany = (id: string) => {
    setExpandedCompanies(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const companies = [
    {
      id: 'comp1',
      name: 'بترو أمان',
      location: 'جدة - حي الروضة',
      areasCount: 3,
      status: 'active',
      areas: [
        {
          id: 'area1',
          name: 'جدة الوسطي',
          location: 'جدة - حي الروضة',
          pricePerKm: '1.80',
          minPrice: '120',
        },
        {
          id: 'area2',
          name: 'جدة الشمالية',
          location: 'جدة - حي الروضة',
          pricePerKm: null,
          minPrice: null,
        },
        {
          id: 'area3',
          name: 'الدمام الصناعية',
          location: 'الدمام',
          pricePerKm: '1.80',
          minPrice: '120',
        }
      ]
    },
    {
      id: 'comp2',
      name: 'بترو أمان',
      location: 'جدة - حي الروضة',
      areasCount: 0,
      status: 'pending',
      areas: []
    },
    {
      id: 'comp3',
      name: 'الوقود الذكي',
      location: 'جدة - حي الروضة',
      areasCount: 3,
      status: 'active',
      areas: []
    },
    {
      id: 'comp4',
      name: 'النخبة للمحروقات',
      location: 'جدة - حي الروضة',
      areasCount: 3,
      status: 'active',
      areas: []
    }
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 bg-slate-50/50 min-h-screen" dir="rtl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-blue-900 mb-2">مناطق التوصيل والتسعير</h1>
        <p className="text-sm font-bold text-slate-400">
          حدّد وحدّث أسعار النقل داخل المناطق المعتمدة من شركات البترول
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/delivery/locationPin.svg" alt="Areas" className="w-6 h-6" />
          </div>
          <div className="text-right flex-1 pl-4">
            <div className="text-xs font-bold text-slate-400 mb-1">إجمالي المناطق</div>
            <div className="text-xl font-black text-blue-600">5</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
            <img src="/transportCompany/delivery/orangeCoin.svg" alt="Fare" className="w-6 h-6" />
          </div>
          <div className="text-right flex-1 pl-4">
            <div className="text-xs font-bold text-slate-400 mb-1">متوسط الأجرة / كم</div>
            <div className="text-xl font-black text-orange-500" dir="ltr">1.85 ر.س</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Main List (Right Side in RTL) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex flex-col gap-4">
              {companies.map((company, index) => {
                const isExpanded = expandedCompanies.includes(company.id);

                return (
                  <div key={company.id} className={cn(
                    "border border-slate-200 rounded-xl transition-all overflow-hidden",
                    isExpanded ? "bg-white shadow-sm" : "bg-white"
                  )}>

                    {/* Company Header */}
                    <div
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => company.areasCount > 0 && toggleCompany(company.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                          {/* Fuel Icon */}
                          <img src="/transportCompany/profilePage/petroAman.jpg" alt="" className='w-full h-full object-cover rounded-lg' />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-bold text-slate-900">{company.name}</span>
                          <span className="text-xs font-bold text-slate-400">{company.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        {company.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <button className="bg-red-50 text-red-500 px-6 py-2 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                              رفض
                            </button>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                              قبول
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-500">
                            <span className="text-sm font-bold">{company.areasCount} مناطق</span>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Areas List */}
                    {isExpanded && company.areas.length > 0 && (
                      <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/30">
                        <div className="flex flex-col gap-3 mt-4">
                          {company.areas.map(area => {
                            const isEditing = editingAreaId === area.id;

                            return (
                              <div key={area.id} className={cn(
                                "rounded-xl border border-slate-200 bg-slate-50 overflow-hidden relative transition-all",
                                isEditing ? "shadow-sm border-blue-200" : ""
                              )}>

                                <div className="p-4">
                                  {/* Top Row */}
                                  <div className="flex justify-between items-start">
                                    {/* Right side (Info) */}
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white">
                                        <img src="/petrolCompany/transporters/details/pin.svg" alt="" className='w-8 h-8 object-cover rounded-lg' />
                                      </div>
                                      <div className="flex flex-col">
                                        <span className="text-sm font-bold text-blue-900">{area.name}</span>
                                        <span className="text-xs font-bold text-slate-400">{area.location}</span>
                                      </div>
                                    </div>

                                    {/* Left side (Prices & Action) */}
                                    <div className="flex items-center gap-6">
                                      <div className="flex flex-col text-left">
                                        {area.pricePerKm ? (
                                          <span className="text-sm font-bold text-green-600">{area.pricePerKm} ر.س <span className="text-xs text-green-600/70">/ كم</span></span>
                                        ) : (
                                          <span className="text-sm font-bold text-green-600">-- ر.س <span className="text-xs text-green-600/70">/ كم</span></span>
                                        )}
                                        {area.minPrice ? (
                                          <span className="text-xs font-bold text-slate-400 mt-1">الحد الأدنى {area.minPrice} ر.س</span>
                                        ) : (
                                          <span className="text-xs font-bold text-slate-400 mt-1">الحد الأدنى -- ر.س</span>
                                        )}
                                      </div>

                                      {isEditing ? (
                                        <button
                                          onClick={() => setEditingAreaId(null)}
                                          className="w-10 h-10 rounded-lg border border-blue-200 flex items-center justify-center hover:bg-blue-50 transition-colors text-blue-600 bg-white"
                                        >
                                          <X className="w-5 h-5" />
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => setEditingAreaId(area.id)}
                                          className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-white transition-colors bg-slate-50 shrink-0 text-blue-600"
                                        >
                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.4445 19.6875H20.9445M18.4443 9.68747C18.4443 9.68747 21.4443 6.68747 19.4443 4.68747C17.4443 2.68747 14.4443 5.68747 14.4443 5.68747L5.44587 14.6859C4.78722 15.3446 4.26719 16.1441 4.10888 17.062C3.94903 17.9888 3.89583 19.139 4.44432 19.6875C4.99281 20.236 6.14299 20.1828 7.0698 20.0229C7.98772 19.8646 8.78722 19.3446 9.44587 18.6859L18.4443 9.68747ZM14.4443 5.68747L18.4443 9.68747" stroke="#1E5FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* Edit Form (Bottom Row) */}
                                  {isEditing && (
                                    <div className="mt-6 flex flex-col gap-4">
                                      <div className="flex items-center gap-4">

                                        {/* Right Input: Price per km */}
                                        <div className="flex-1 flex flex-col gap-2">
                                          <span className="text-xs font-bold text-slate-400 text-right">سعر النقل لكل كم</span>
                                          <div className="relative flex items-center">
                                            <input
                                              type="text"
                                              defaultValue={area.pricePerKm || ''}
                                              className="w-full border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                            />
                                            <div className="absolute left-3 text-blue-600">
                                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 13.3333H10.8333C11.3889 13.3333 12.5 13 12.5 11.6667C12.5 10.3333 11.3889 10 10.8333 10H9.16667C8.61111 10 7.5 9.66667 7.5 8.33333C7.5 7 8.61111 6.66667 9.16667 6.66667H10M10 13.3333H7.5M10 13.3333V15M12.5 6.66667H10M10 6.66667V5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="#1E5FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Left Input: Minimum Price */}
                                        <div className="flex-1 flex flex-col gap-2">
                                          <span className="text-xs font-bold text-slate-400 text-right">الحد الأدنى</span>
                                          <div className="relative flex items-center">
                                            <input
                                              type="text"
                                              defaultValue={area.minPrice || ''}
                                              className="w-full border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                                            />
                                            <div className="absolute left-3 text-blue-600">
                                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 13.3333H10.8333C11.3889 13.3333 12.5 13 12.5 11.6667C12.5 10.3333 11.3889 10 10.8333 10H9.16667C8.61111 10 7.5 9.66667 7.5 8.33333C7.5 7 8.61111 6.66667 9.16667 6.66667H10M10 13.3333H7.5M10 13.3333V15M12.5 6.66667H10M10 6.66667V5M17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="#1E5FFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>

                                      </div>

                                      <button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                                        onClick={() => setEditingAreaId(null)}
                                      >
                                        تحديث السعر
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                      </button>
                                    </div>
                                  )}

                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar (Left Side in RTL) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Map Location Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-start gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <img src="/transportCompany/delivery/locationPin.svg" alt="Pin" className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-blue-900">الموقع على الخريطة</h3>
            </div>

            <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200">
              {/* Map Background */}
              <img src="/petrolCompany/orderDetails/map.png" alt="Map Background" className="absolute inset-0 w-full h-full object-cover" />

              {/* Map Button (Top Left) */}
              <button className="absolute top-3 left-3 w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors z-10">
                <img src="/transportCompany/orderPage/AssignPage/location.svg" alt="Map" className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Areas by Company Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                <img src="/sideBar/order.svg" alt="List" className="w-4 h-4 filter" style={{ filter: 'invert(32%) sepia(87%) saturate(2256%) hue-rotate(212deg) brightness(99%) contrast(106%)' }} />
              </div>
              <h3 className="text-sm font-bold text-blue-900">المناطق حسب الشركة</h3>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm text-right">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4 font-bold text-blue-900 text-xs">الشركة</th>
                    <th className="py-2.5 px-4 font-bold text-blue-900 text-xs text-center">المناطق</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="bg-white">
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <img src="/transportCompany/profilePage/petroAman.jpg" alt="" className='w-8 h-8 object-cover rounded-full' />
                      <span className="font-bold text-slate-700">بترو أمان</span>
                    </td>
                    <td className="py-2.5 px-4 font-black text-slate-900 text-center">3</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <img src="/transportCompany/profilePage/petroAman.jpg" alt="" className='w-8 h-8 object-cover rounded-full' />
                      <span className="font-bold text-slate-700">الطاقة الحديثة</span>
                    </td>
                    <td className="py-2.5 px-4 font-black text-slate-900 text-center">3</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <img src="/transportCompany/profilePage/petroAman.jpg" alt="" className='w-8 h-8 object-cover rounded-full' />
                      <span className="font-bold text-slate-700">الوقود الذكي</span>
                    </td>
                    <td className="py-2.5 px-4 font-black text-slate-900 text-center">3</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-2.5 px-4 flex items-center gap-2">
                      <img src="/transportCompany/profilePage/petroAman.jpg" alt="" className='w-8 h-8 object-cover rounded-full' />
                      <span className="font-bold text-slate-700">النخبة للمحروقات</span>
                    </td>
                    <td className="py-2.5 px-4 font-black text-slate-900 text-center">3</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
