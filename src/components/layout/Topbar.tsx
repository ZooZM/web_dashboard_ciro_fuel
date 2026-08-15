import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { useSession } from '@/stores/session.store';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { Button } from '@/components/ui/button';
import { LangSwitcher } from '@/components/layout/LangSwitcher';

export function Topbar() {
  const { t } = useTranslation();
  const { user } = useSession();
  const logout = useLogout();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
      <span className="font-semibold">{t('common.appName')}</span>
      <div className="flex items-center gap-3">
        {user ? <span className="text-sm text-muted-foreground">{user.fullName}</span> : null}
        <LangSwitcher />
        <Button variant="ghost" size="sm" onClick={() => void logout()} aria-label={t('common.signOut')}>
          <LogOut className="h-4 w-4" />
          {t('common.signOut')}
        </Button>
      </div>
    </header>
  );
}
