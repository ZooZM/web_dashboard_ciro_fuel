import { Outlet } from 'react-router-dom';
import { Topbar } from '@/components/layout/Topbar';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppShell() {
  return (
    <div className="flex h-svh flex-col">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
