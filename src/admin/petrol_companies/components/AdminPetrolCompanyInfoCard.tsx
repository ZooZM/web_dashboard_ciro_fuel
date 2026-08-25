import { useState } from 'react';
import { cn } from '@/lib/utils';

export function AdminPetrolCompanyInfoCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [fields, setFields] = useState({
    companyName: 'بترو أمان',
    managerName: 'إبراهيم القحطاني',
    jobTitle: 'مدير العمليات',
    email: 'ahmed.subaie@trn.sa',
    city: 'جدة',
    region: 'حي الروضة',
    notes: '',
  });
  const [draft, setDraft] = useState({ ...fields });

  const handleEdit = () => {
    setDraft({ ...fields });
    setIsEditing(true);
  };

  const handleSave = () => {
    setFields({ ...draft });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className={cn(
      "bg-white rounded-2xl p-6 shadow-sm flex flex-col h-full transition-all",
      isEditing ? "border-[#1E5FFF] border-2" : "border border-[#E7E9EF]"
    )}>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <img src="/petrolCompany/owner/user.svg" alt="" className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#162155]">معلومات الشركة</h3>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2" dir="ltr">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-50/50 border border-green-100 text-green-600 rounded-lg text-xs font-bold hover:bg-green-50 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              حفظ
            </button>
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-lg border border-red-100 bg-white flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors text-red-500"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="w-8 h-8 rounded-xl border border-[#E7E9EF] bg-white flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors"
          >
            <img src="/admin/petrolCompany/details/edit.svg" alt="Edit" className="w-6 h-6" onError={(e) => {
              (e.target as HTMLImageElement).src = '/petrolCompany/station/edit.svg';
            }} />
          </button>
        )}
      </div>

      {/* Grid Fields */}
      <div className="grid grid-cols-2 gap-y-6 gap-x-6 mb-8">

        {/* Row 1 */}
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">الاسم الكامل</span>
          {isEditing ? (
            <input
              value={draft.companyName}
              onChange={(e) => setDraft({ ...draft, companyName: e.target.value })}
              className="text-sm font-black text-[#162155] border border-[#E7E9EF] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 bg-white text-right"
              dir="rtl"
            />
          ) : (
            <span className="text-sm font-black text-[#162155]">{fields.companyName}</span>
          )}
        </div>

        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2 justify-start mb-1">
            <span className="text-[11px] font-bold text-[#858C95]">كود الشركة</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500">
              <img src="/transportCompany/profilePage/filledLock.svg" alt="" className="w-2.5 h-2.5" />
              غير قابل للتعديل
            </div>
          </div>
          {isEditing ? (
             <div className="text-sm font-black text-[#162155] border border-[#E7E9EF] rounded-xl px-4 py-3 bg-white text-right" dir="ltr">TRN-2024-001</div>
          ) : (
             <span className="text-sm font-black text-[#162155]" dir="ltr">TRN-2024-001</span>
          )}
        </div>

        {/* Row 2 */}
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">الاسم الكامل</span>
          {isEditing ? (
            <input
              value={draft.managerName}
              onChange={(e) => setDraft({ ...draft, managerName: e.target.value })}
              className="text-sm font-black text-[#162155] border border-[#E7E9EF] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 bg-white text-right"
              dir="rtl"
            />
          ) : (
            <span className="text-sm font-black text-[#162155]">{fields.managerName}</span>
          )}
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">المسمى الوظيفي</span>
          {isEditing ? (
            <input
              value={draft.jobTitle}
              onChange={(e) => setDraft({ ...draft, jobTitle: e.target.value })}
              className="text-sm font-black text-[#162155] border border-[#E7E9EF] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 bg-white text-right"
              dir="rtl"
            />
          ) : (
            <span className="text-sm font-black text-[#162155]">{fields.jobTitle}</span>
          )}
        </div>

        {/* Row 3 */}
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">البريد الإلكتروني</span>
          {isEditing ? (
            <input
              value={draft.email}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              className="text-sm font-black text-[#162155] border border-[#E7E9EF] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 bg-white"
              dir="ltr"
              style={{ textAlign: 'left' }}
            />
          ) : (
            <span className="text-sm font-black text-[#162155] break-all" dir="ltr">{fields.email}</span>
          )}
        </div>

        <div className="flex flex-col text-right">
          <div className="flex items-center gap-2 justify-start mb-1">
            <span className="text-[11px] font-bold text-[#858C95]">رقم الجوال</span>
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-500">
              <img src="/transportCompany/profilePage/filledLock.svg" alt="" className="w-2.5 h-2.5" />
              غير قابل للتعديل
            </div>
          </div>
          {isEditing ? (
            <div className="text-sm font-black text-[#162155] border border-transparent rounded-xl px-0 py-3 bg-transparent text-right" dir="ltr">05xxxxxxxx</div>
          ) : (
            <span className="text-sm font-black text-[#162155]" dir="ltr">05xxxxxxxx</span>
          )}
        </div>

        {/* Row 4 */}
        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">المدينة</span>
          {isEditing ? (
            <div className="relative">
              <select
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                className="w-full text-sm font-black text-[#162155] border border-[#E7E9EF] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 bg-white text-right appearance-none"
                dir="rtl"
              >
                <option value="جدة">جدة</option>
                <option value="الرياض">الرياض</option>
                <option value="الدمام">الدمام</option>
              </select>
              <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none text-blue-500">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ) : (
            <span className="text-sm font-black text-[#162155]">{fields.city}</span>
          )}
        </div>

        <div className="flex flex-col text-right">
          <span className="text-[11px] font-bold text-[#858C95] mb-1">المنطقة</span>
          {isEditing ? (
            <div className="relative">
              <select
                value={draft.region}
                onChange={(e) => setDraft({ ...draft, region: e.target.value })}
                className="w-full text-sm font-black text-[#162155] border border-[#E7E9EF] rounded-xl px-4 py-3 focus:outline-none focus:border-blue-400 bg-white text-right appearance-none"
                dir="rtl"
              >
                <option value="حي الروضة">حي الروضة</option>
                <option value="حي الصفا">حي الصفا</option>
                <option value="حي الشاطئ">حي الشاطئ</option>
              </select>
              <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none text-blue-500">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          ) : (
            <span className="text-sm font-black text-[#162155]">{fields.region}</span>
          )}
        </div>

      </div>

      {/* Footer Notes Box */}
      <div className={cn(
        "w-full mt-auto rounded-xl p-3 text-center transition-all",
        isEditing ? "bg-white border border-[#E7E9EF]" : "bg-[#F8FAFC] border border-dashed border-[#CBD5E1]"
      )}>
        {isEditing ? (
          <textarea
            value={draft.notes}
            onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
            placeholder="ملاحظات إضافية عن الحساب ..."
            className="w-full bg-transparent text-[11px] font-bold text-[#162155] resize-none focus:outline-none text-right placeholder:text-[#858C95] h-12"
            dir="rtl"
          />
        ) : (
          <span className="text-[11px] font-bold text-[#858C95]">
            {fields.notes || 'ملاحظات على الحساب أي وجدت.'}
          </span>
        )}
      </div>

    </div>
  );
}
