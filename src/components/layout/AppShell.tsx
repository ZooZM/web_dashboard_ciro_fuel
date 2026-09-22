import { Outlet } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShell() {
  return (
    <div className="flex h-svh bg-slate-50 overflow-hidden font-sans" dir="rtl">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-slate-50">
        <div className="sticky top-0 z-40 bg-slate-50 pt-2">
          <Topbar />
        </div>
        <main className="flex-1 p-4 md:p-6 bg-slate-50">
          <div className="min-h-full flex flex-col">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
