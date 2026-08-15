import { create } from 'zustand';
import type { Language } from '@/constants/order-status';
import { DEFAULT_LANGUAGE } from '@/constants/order-status';
import i18n, { persistLanguage } from '@/lib/i18n/i18n';
import { syncDocumentDirection } from '@/lib/rtl/direction';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

const initialLanguage = (i18n.language as Language) || DEFAULT_LANGUAGE;
syncDocumentDirection(initialLanguage);

export const useLanguageStore = create<LanguageState>((set) => ({
  language: initialLanguage,
  setLanguage: (language) => {
    void i18n.changeLanguage(language);
    persistLanguage(language);
    syncDocumentDirection(language);
    set({ language });
  },
}));
