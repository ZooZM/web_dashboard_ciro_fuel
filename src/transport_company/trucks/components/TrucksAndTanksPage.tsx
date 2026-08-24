import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TrucksAndTanksPage() {
  const [activeTab, setActiveTab] = useState<'trucks' | 'tanks'>('trucks');
  const [isAdding, setIsAdding] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(1); // Mock first item editing
  const [searchQuery, setSearchQuery] = useState('');

  const renderAddForm = () => {
    const isTanks = activeTab === 'tanks';
    const entityName = isTanks ? 'تانك' : 'شاحنة';

    if (!isAdding) {
      return (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">إضافة {entityName} جديد</h2>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm font-bold shadow-sm"
          >
            <img src="/transportCompany/trucks/whitePlus.svg" alt="Add" className="w-4 h-4" />
            إضافة {entityName}
          </button>
        </div>
      );
    }

    return (
      <div className="border border-dashed border-slate-300 bg-slate-50/30 rounded-2xl p-6 mb-6 relative">
        <h2 className="text-base font-bold text-slate-900 mb-8 text-right">إضافة {entityName} جديد</h2>
        
        {activeTab === 'trucks' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-end">
            <div className="hidden xl:block"></div> {/* Spacer for centering in grid */}

            {/* License Plate Inputs */}
            <div className="flex justify-center h-[200px]">
              <div className="flex items-center gap-4 lg:gap-6">
                  
                  {/* Numbers */}
                  <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2" dir="ltr">
                          <input type="text" maxLength={1} placeholder="." className="w-12 h-14 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
                          <input type="text" maxLength={1} placeholder="." className="w-12 h-14 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
                          <input type="text" maxLength={1} placeholder="." className="w-12 h-14 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
                          <input type="text" maxLength={1} placeholder="." className="w-12 h-14 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
                      </div>
                      <span className="text-xs font-bold text-slate-400">أرقام</span>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center -mt-6">
                      <span className="text-sm font-black text-slate-900 mb-1">رقم اللوحة</span>
                      <div className="w-4 h-[3px] bg-slate-900 rounded-full"></div>
                  </div>
                  
                  {/* Letters */}
                  <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-2" dir="ltr">
                          <input type="text" maxLength={1} placeholder="." className="w-12 h-14 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
                          <input type="text" maxLength={1} placeholder="." className="w-12 h-14 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
                          <input type="text" maxLength={1} placeholder="." className="w-12 h-14 text-center text-3xl text-slate-400 placeholder-slate-300 font-bold border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm transition-shadow pb-3" />
                      </div>
                      <span className="text-xs font-bold text-slate-400">حروف</span>
                  </div>
                  
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-end justify-end gap-3">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-6 py-2.5 rounded-xl transition-colors text-sm font-bold" dir="ltr"
              >
                <span dir="rtl">إلغاء</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm" dir="ltr">
                <span dir="rtl">إضافة {entityName}</span>
                <img src="/transportCompany/trucks/whitePlus.svg" alt="Add" className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Top Row: Capacity & Code */}
            <div className="flex gap-6 w-full">
              {/* Right Input: Tank Code (كود التانك) */}
              <div className="flex flex-col flex-1 gap-2">
                <span className="text-xs font-bold text-slate-400 text-right">كود التانك</span>
                <input 
                  type="text" 
                  placeholder="كود التانك" 
                  className="w-full h-[60px] border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white shadow-sm" 
                  style={{ textAlign: 'right' }}
                />
              </div>

              {/* Left Input: Capacity (السعة) */}
              <div className="flex flex-col flex-1 gap-2">
                <span className="text-xs font-bold text-slate-400 text-right">السعة</span>
                <div className="flex items-center justify-between border border-slate-200 rounded-xl bg-white p-2 h-[60px] shadow-sm">
                  <button className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-slate-900" dir="ltr">20,000</span>
                    <span className="text-[10px] font-bold text-slate-400">لتر</span>
                  </div>
                  <button className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Body Type (نوع الهيكل) */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 text-right">نوع الهيكل</span>
              <div className="flex gap-6 w-full">
                
                {/* Aluminum (Right in RTL) */}
                <button className="flex-1 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-200 transition-colors shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                    <img src="/petrolCompany/orderDetails/aluminum.svg" alt="Aluminum" className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">ألومنيوم</span>
                </button>
                
                {/* Iron (Left in RTL) */}
                <button className="flex-1 flex flex-col items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-200 transition-colors shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                    <img src="/petrolCompany/orderDetails/iron.svg" alt="Iron" className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">حديد</span>
                </button>
                
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-2">
              <button 
                onClick={() => setIsAdding(false)}
                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 px-6 py-2.5 rounded-xl transition-colors text-sm font-bold" dir="ltr"
              >
                <span dir="rtl">إلغاء</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-colors text-sm font-bold shadow-sm" dir="ltr">
                <span dir="rtl">إضافة {entityName}</span>
                <img src="/transportCompany/trucks/whitePlus.svg" alt="Add" className="w-4 h-4" />
              </button>
            </div>
            
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-blue-900 mb-2">الشاحنات والتانكات</h1>
        <p className="text-sm font-bold text-slate-400">
          إدارة رؤوس الشاحنات والتانكات المقطورة بشكل مستقل - يتم ربطهم بسائق عند إسناد كل رحلة
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-start gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
            <img src="/transportCompany/trucks/blueTruck.svg" alt="Trucks" className="w-6 h-6" />
          </div>
          <div className="text-right  flex-1 pl-4">
            <div className="text-xs font-bold text-slate-400 mb-1">إجمالي الشاحنات</div>
            <div className="text-xl font-black text-slate-900">4</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
            <img src="/transportCompany/trucks/orangeTank.svg" alt="Tanks" className="w-6 h-6" />
          </div>
          <div className="text-right flex-1 pl-4">
            <div className="text-xs font-bold text-slate-400 mb-1">إجمالي التانكات</div>
            <div className="text-xl font-black text-slate-900">14</div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
            <img src="/transportCompany/trucks/greenPump.svg" alt="Capacity" className="w-6 h-6" />
          </div>
          <div className="text-right flex-1 pl-4">
            <div className="text-xs font-bold text-slate-400 mb-1">إجمالي السعة</div>
            <div className="text-xl font-black text-slate-900" dir="ltr">93,000 لتر</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Tabs and Search */}
        <div className="border-b border-slate-200 p-3 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex bg-slate-50  rounded-xl w-full md:w-auto shrink-0">
            <button
              onClick={() => setActiveTab('trucks')}
              className={cn(
                "px-8 py-2  rounded-lg text-sm font-bold transition-colors w-1/2 md:w-auto",
                activeTab === 'trucks' 
                  ? "bg-blue-100/50 border-b-2 border-blue-700 text-blue-700" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              الشاحنات
            </button>
            <button
              onClick={() => setActiveTab('tanks')}
              className={cn(
                "px-8 py-2 rounded-lg text-sm font-bold  text-blue-700 transition-colors w-1/2 md:w-auto",
                activeTab === 'tanks' 
                  ? "bg-blue-100/50 border-b-2 border-blue-700 text-blue-700" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              التانكات
            </button>
          </div>
          
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث بكود أو إسم المالك..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pr-10 pl-4 text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-right"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {renderAddForm()}

          {/* List */}
          <div className="space-y-4 mt-6">
            {[1, 2, 3, 4].map((i) => {
              const isEditing = editingItemId === i;

              if (isEditing) {
                return (
                  <div key={i} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-4 bg-slate-50/30">
                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                          {activeTab === 'trucks' ? (
                            <img src="/transportCompany/trucks/blueTruck.svg" alt="Truck" className="w-5 h-5" />
                          ) : (
                            <img src="/petrolCompany/orderDetails/aluminum.svg" alt="Tank" className="w-5 h-5" />
                          )}
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-sm font-bold text-slate-900" dir="ltr">
                            {activeTab === 'trucks' ? 'ABC-1234' : 'TNK-0231'}
                          </span>
                          {activeTab === 'trucks' ? (
                            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md mt-1 w-fit">آخر سائق: أحمد السبيعي</span>
                          ) : (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">ألومنيوم</span>
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md" dir="ltr">20,000 لتر</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100/50 text-green-600 px-3 py-1.5 rounded-md text-xs font-bold shrink-0">متاح</div>
                        <button 
                          onClick={() => setEditingItemId(null)}
                          className="w-10 h-10 rounded-lg border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 transition-colors bg-white shadow-sm"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <button 
                          onClick={() => setEditingItemId(null)}
                          className="flex items-center gap-2 bg-green-100/50 hover:bg-green-100 text-green-600 px-6 py-2.5 rounded-lg transition-colors text-xs font-bold"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          حفظ
                        </button>
                      </div>
                    </div>
                    
                    {/* Bottom Row - License Plate Edit */}
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-bold text-slate-400 text-right">رقم اللوحة</span>
                      <input 
                        type="text" 
                        defaultValue={activeTab === 'trucks' ? 'ABC-1234' : 'TNK-0231'}
                        className="w-full border border-slate-200 rounded-lg py-3 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                        dir="ltr"
                        style={{ textAlign: 'right' }}
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} className="border border-slate-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-200 transition-colors bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                      {activeTab === 'trucks' ? (
                        <img src="/transportCompany/trucks/blueTruck.svg" alt="Truck" className="w-5 h-5" />
                      ) : (
                        <img src="/petrolCompany/orderDetails/aluminum.svg" alt="Tank" className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-sm font-bold text-slate-900" dir="ltr">
                        {activeTab === 'trucks' ? 'ABC-1234' : 'TNK-0231'}
                      </span>
                      {activeTab === 'trucks' ? (
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md mt-1 w-fit">آخر سائق: أحمد السبيعي</span>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">ألومنيوم</span>
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md" dir="ltr">20,000 لتر</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100/50 text-green-600 px-3 py-1 rounded-md text-xs font-bold shrink-0">متاح</div>
                    {activeTab === 'trucks' && (
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-50 transition-colors">
                        <img src="/transportCompany/trucks/qrCode.svg" alt="QR" className="w-6 h-6" />
                      </button>
                    )}
                    <button 
                      onClick={() => setEditingItemId(i)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                    >
                      <img src="/petrolCompany/station/edit.svg" alt="Edit" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
