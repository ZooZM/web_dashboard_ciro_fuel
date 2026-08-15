import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '@/stores/language.store';
import { Button } from '@/components/ui/button';
import type { Language } from '@/constants/order-status';

export function LangSwitcher() {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  function toggle(): void {
    const next: Language = language === 'ar' ? 'en' : 'ar';
    setLanguage(next);
  }

  return (
    <Button variant="ghost" size="sm" onClick={toggle} aria-label={t('common.language')}>
      <Globe className="h-4 w-4" />
      {language === 'ar' ? 'EN' : 'AR'}
    </Button>
  );
}
