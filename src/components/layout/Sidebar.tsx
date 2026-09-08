import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LogOut, ChevronLeft, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSession } from '@/stores/session.store';
import { Role } from '@/constants/roles';
import { useSessionIdentity } from '@/hooks/useSessionIdentity';
import { useLayoutStore } from '@/stores/layout.store';
import { useLogout } from '@/auth/hooks/useLogout';


function NavItem({ to, icon: Icon, label, badge, active, isCollapsed, iconClassName }: { to: string; icon: any; label: string; badge?: number; active?: boolean; isCollapsed: boolean; iconClassName?: string }) {
  return (
    <NavLink
      to={to}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        cn(
          'flex items-center rounded-xl group relative transition-all duration-300',
          isCollapsed ? 'justify-center p-2.5 mx-auto w-11 h-11' : 'px-4 py-2.5 w-full',
          isActive || active
            ? 'bg-[#2563EB] text-white shadow-lg shadow-blue-500/20'
            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200',
        )
      }
    >
      {({ isActive }) => (
        <>
          <motion.div layout="position" className="relative flex items-center justify-center shrink-0">
            {typeof Icon === 'string' ? (
              <img
                src={Icon}
                alt={label}
                className={cn(
                  "transition-all duration-300 object-contain",
                  iconClassName || (isCollapsed ? "h-5 w-5" : "h-5 w-5 "),
                  (isActive || active) ? "brightness-0 invert" : "opacity-70 group-hover:opacity-100"
                )}
              />
            ) : (
              <Icon className={cn("transition-all duration-300", iconClassName || (isCollapsed ? "h-5 w-5" : "h-5  w-5"), (isActive || active) ? "text-white" : "text-slate-400 group-hover:text-slate-200")} />
            )}
          </motion.div>

          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap flex-1"
              >
                <div className="pr-3 text-right text-sm font-medium">{label}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {badge ? (
            <motion.span
              layout="position"
              className={cn(
                "flex items-center justify-center rounded-full bg-[#F97316] font-bold text-white shadow-sm shadow-[#0b1121] z-10 transition-all duration-300",
                isCollapsed
                  ? "absolute top-1.5 right-1.5 h-4 w-4 text-[9px]"
                  : "h-5 w-5 shrink-0 text-[10px]"
              )}
            >
              {badge}
            </motion.span>
          ) : null}
        </>
      )}
    </NavLink>
  );
}

export interface NavEntry {
  to: string;
  icon: string;
  label: string;
  badge?: number;
  iconClassName?: string;
}

// Feature 013 R1 corrected `/petrolCompany/*`'s ROUTE guard from [CLIENT, COMPANY_ADMIN]
// to [FUEL_COMPANY_ADMIN] — but this navigation was left branching on `role === 'CLIENT'`,
// a role that can no longer reach the shell at all. A fuel company administrator therefore
// fell through to the unnamed `else`, which is the TRANSPORT menu: signed in to
// /petrolCompany, they were offered "تتبع الشحنات / تسعير أجرة النقل / السائقين /
// الشاحنات والتانكات", every one of them a /transport/* link their own guard refuses.
//
// Keyed by role, with no catch-all: an unrecognised role now renders NO navigation rather
// than silently inheriting another surface's, and a role added later shows up as a missing
// key here instead of as someone else's menu.
export const NAV_BY_ROLE: Partial<Record<Role, NavEntry[]>> = {
  [Role.SUPER_ADMIN]: [
    { to: '/admin/dashboard', icon: '/sideBar/home.svg', label: 'الرئيسية' },
    { to: '/admin/orders', icon: '/sideBar/order.svg', label: 'الطلبات', badge: 5 },
    { to: '/admin/tracking', icon: '/sideBar/map.svg', label: 'تتبع الشحنات' },
    { to: '/admin/fuel-exchange', icon: '/sideBar/fuel-exchange.svg', label: 'تبادل الوقود' },
    { to: '/admin/transport-companies', icon: '/sideBar/greyTruck.svg', label: 'شركات النقل' },
    { to: '/admin/petrol-companies', icon: '/sideBar/stations.svg', label: 'شركات البترول', iconClassName: 'h-6 w-6' },
    { to: '/admin/invoices', icon: '/sideBar/order.svg', label: 'الفواتير و المدفوعات' },
    { to: '/admin/platform-account', icon: '/sideBar/Property%201=Transaction.svg', label: 'حساب المنصات' },
    // Feature 013 T239/T240/FR-055/FR-056/FR-059/FR-062a/FR-062b: the operator's write
    // surface for the platform-wide commission rate and cashback programme — absent for
    // every fuel company admin entirely (FR-091).
    { to: '/admin/billing-settings', icon: '/blue-percentage-icon.svg', label: 'إعدادات العمولة' },
    { to: '/admin/notifications', icon: '/sideBar/notification.svg', label: 'الاشعارات', badge: 5 },
  ],
  [Role.FUEL_COMPANY_ADMIN]: [
    { to: '/petrolCompany/dashboard', icon: '/sideBar/home.svg', label: 'الرئيسية' },
    // Feature 013 T121/FR-047/FR-048: the static badge={5} on this item and the
    // notifications item below were fabricated — no live count was ever wired to either.
    // Removed rather than left showing a number that can never be true; a real unread
    // count would need Sidebar to poll its own summary query, out of that phase's scope.
    { to: '/petrolCompany/orders', icon: '/sideBar/order.svg', label: 'الطلبات' },
    { to: '/petrolCompany/tracking', icon: '/sideBar/map.svg', label: 'تتبع الشحنات' },
    { to: '/petrolCompany/fuel-exchange', icon: '/sideBar/fuel-exchange.svg', label: 'تبادل الوقود' },
    { to: '/petrolCompany/pricing', icon: '/sideBar/fuel-pricing.svg', label: 'تسعير الوقود' },
    { to: '/petrolCompany/companies', icon: '/sideBar/greyTruck.svg', label: 'شركات النقل' },
    { to: '/petrolCompany/stations', icon: '/sideBar/stations.svg', label: 'المحطات', iconClassName: 'h-7 w-7' },
    { to: '/petrolCompany/invoices', icon: '/sideBar/order.svg', label: 'الفواتير و المدفوعات' },
    { to: '/petrolCompany/support', icon: '/petrolCompany/support.svg', label: 'الدعم' },
    { to: '/petrolCompany/PlatformAccountPage', icon: '/sideBar/Property%201=Transaction.svg', label: 'حساب المنصة' },
    { to: '/petrolCompany/notifications', icon: '/sideBar/notification.svg', label: 'الاشعارات' },
  ],
  [Role.TRANSPORT_COMPANY_ADMIN]: [
    { to: '/transport/dashboard', icon: '/sideBar/home.svg', label: 'الرئيسية' },
    { to: '/transport/orders', icon: '/sideBar/order.svg', label: 'الطلبات', badge: 5 },
    { to: '/transport/tracking', icon: '/sideBar/map.svg', label: 'تتبع الشحنات' },
    { to: '/transport/delivery-areas', icon: '/petrolCompany/transporters/details/pin.svg', label: 'تسعير أجرة النقل', iconClassName: 'w-6 h-6' },
    { to: '/transport/drivers', icon: '/sideBar/steering.svg', label: 'السائقين' },
    { to: '/transport/trucks', icon: '/sideBar/greyTruck.svg', label: 'الشاحنات والتانكات' },
    { to: '/transport/invoices', icon: '/sideBar/order.svg', label: 'الفواتير و المدفوعات' },
    { to: '/transport/notifications', icon: '/sideBar/notification.svg', label: 'الاشعارات', badge: 5 },
  ],
};

export function Sidebar() {
  const { user } = useSession();
  const { organizationName, organizationSubtitle, fullName, roleLabel } = useSessionIdentity();
  const logout = useLogout();
  const { isSidebarCollapsed: isCollapsed, toggleSidebar, setSidebarCollapsed } = useLayoutStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);

    // Collapse by default on mobile on initial load
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarCollapsed]);

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}
      <motion.aside
        dir="rtl"
        animate={{
          width: isMobile ? 260 : (isCollapsed ? 90 : 260),
          x: isMobile && isCollapsed ? '100%' : 0
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "flex h-screen shrink-0 flex-col bg-[#0b1121] border-l border-slate-800/50 overflow-hidden",
          isMobile ? "fixed top-0 right-0 z-50" : "sticky top-0"
        )}
      >
        <div className={cn("pt-4 pb-2 flex flex-col transition-all duration-300 shrink-0", isCollapsed ? "px-3" : "px-4")}>

          {/* Header (Logo + Toggle) */}
          <div className={cn("flex items-center transition-all duration-300 mb-5", isCollapsed ? "flex-col justify-center gap-4 h-auto" : "justify-between h-8")}>
            <motion.div layout="position" className="overflow-hidden flex items-center justify-center">
              <img
                src={isCollapsed ? (user?.role === 'SUPER_ADMIN' ? "/LOGO/LogoDark.svg" : "/LOGO/LogoDark.svg") : (user?.role === 'SUPER_ADMIN' ? "/LOGO/LogoDark.svg" : "/LOGO/LogoDark.svg")}
                alt="CIRO FUEL"
                className={cn("object-contain transition-all duration-300", isCollapsed ? "h-6 w-auto" : "h-6")}
                onError={(e) => {
                  if (isCollapsed) (e.target as HTMLImageElement).src = user?.role === 'SUPER_ADMIN' ? "/LOGO/LogoDark.svg  " : "/LOGO/LogoDark.svg";
                }}
              />
            </motion.div>
            <motion.button
              layout="position"
              onClick={toggleSidebar}
              className={cn(
                "flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 z-10 transition-colors",
                isCollapsed ? "mx-auto p-2" : "p-1.5"
              )}
              title={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
            >
              <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                <img src="/sideBar/Menu.svg" alt="Menu" className={cn("transition-all duration-300 object-contain", isCollapsed ? "h-5 w-8 scale-90" : "h-6 w-10 scale-110")} />
              </motion.div>
            </motion.button>
          </div>

          {/* Company Card */}
          <motion.div
            layout="position"
            className={cn(
              "flex items-center mb-3 rounded-xl overflow-hidden transition-all duration-300",
              isCollapsed
                ? "justify-center w-10 h-10 mx-auto"
                : "bg-[#1e293b]/40 p-2.5 border border-slate-700/50 w-full"
            )}
          >
            <motion.div layout="position" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white relative z-10">
              {user?.role === Role.SUPER_ADMIN ? (
                <img src="/sideBar/protection.svg" alt="admin icon" className="h-5 w-5" />
              ) : (
                <img
                  src={user?.role === Role.FUEL_COMPANY_ADMIN ? '/sideBar/petroAman.svg' : '/sideBar/truck.svg'}
                  alt="company icon"
                  className="h-6 w-6"
                />
              )}
            </motion.div>
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap flex-1"
                >
                  <div className="flex flex-col text-right pr-3">
                    {/* The acting administrator's OWN company, read from the platform.
                        This was the literal 'سيرو ترانسبورت' / 'TRN-2024-002' for every
                        non-operator session, so a fuel company admin saw a transport
                        company's name and a registration code `Company` has no field for.
                        The subtitle is the company's real TYPE instead. */}
                    <span className="text-sm font-bold text-white">{organizationName || '—'}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5">{organizationSubtitle}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className={cn("flex-1", isCollapsed ? "px-3" : "px-4")}>
          <nav className="flex flex-col gap-0.5 w-full">
            {(user?.role ? (NAV_BY_ROLE[user.role] ?? []) : []).map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                iconClassName={item.iconClassName}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className={cn("mt-auto pt-2 flex flex-col gap-2 w-full transition-all duration-300 shrink-0", isCollapsed ? "p-3 pb-4" : "p-4 pb-4")}>
          <motion.div
            layout="position"
            className={cn(
              "flex items-center rounded-xl overflow-hidden transition-all duration-300",
              isCollapsed
                ? "justify-center mx-auto w-11 h-11"
                : "bg-[#1e293b]/40 p-2.5 border border-slate-700/50 w-full"
            )}
          >
            <motion.img
              layout="position"
              src="/topBar/profilePic.jpg"
              alt="Avatar"
              className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-700 relative z-10"
            />
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap flex-1"
                >
                  <div className="flex items-center pr-3">
                    <div className="flex flex-1 flex-col text-right">
                      {/* Was 'حسين السيد' for the operator and 'مدير العمليات' for EVERY
                          other role — a job title nobody on this platform holds, shown to
                          fuel and transport administrators alike. Both lines are the
                          session's own values now. */}
                      <span className="text-sm font-bold text-white">{fullName || '—'}</span>
                      <span className="text-[11px] text-slate-400 mt-0.5">{roleLabel}</span>
                    </div>
                    <ChevronLeft className="h-4 w-4 text-slate-400 shrink-0 ml-1" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            layout="position"
            onClick={() => logout()}
            className={cn(
              "flex items-center rounded-xl border border-slate-700/50 bg-transparent hover:bg-slate-800/50 overflow-hidden transition-all duration-300",
              isCollapsed ? "justify-center mx-auto w-11 h-11 p-0" : "px-3 py-2.5 w-full justify-between"
            )}
            title="تسجيل الخروج"
          >
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <span className="block text-sm font-bold text-red-500 text-right pr-2">تسجيل الخروج</span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div layout="position" className="relative z-10 pl-1">
              <LogOut className={cn("-scale-x-100 shrink-0 transition-all duration-300 text-red-500", isCollapsed ? "h-5 w-5" : "h-5 w-5")} />
            </motion.div>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
}
