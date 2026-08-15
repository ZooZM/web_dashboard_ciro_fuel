import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Package, Truck, Users, Settings, Building2, ClipboardList } from 'lucide-react';
import { Role } from '@/constants/roles';
import { RoleGate } from '@/routing/RoleGate';
import { cn } from '@/lib/utils';

function NavItem({ to, icon: Icon, label }: { to: string; icon: typeof Package; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
          isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:bg-accent/50',
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  );
}

export function Sidebar() {
  const { t } = useTranslation();

  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-e p-3">
      <RoleGate allow={[Role.SUPER_ADMIN]}>
        <NavItem to="/companies" icon={Building2} label={t('nav.companies')} />
        <NavItem to="/platform-orders" icon={ClipboardList} label={t('nav.orders')} />
      </RoleGate>
      <RoleGate allow={[Role.COMPANY_ADMIN]}>
        <NavItem to="/orders" icon={Package} label={t('nav.orders')} />
        <NavItem to="/drivers" icon={Truck} label={t('nav.drivers')} />
        <NavItem to="/clients" icon={Users} label={t('nav.clients')} />
        <NavItem to="/settings" icon={Settings} label={t('nav.settings')} />
      </RoleGate>
    </nav>
  );
}
