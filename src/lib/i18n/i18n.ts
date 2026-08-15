import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LANGUAGE } from '@/constants/order-status';
import ar from './ar.json';
import en from './en.json';

const LANGUAGE_STORAGE_KEY = 'dashboard-language';

function readStoredLanguage(): string {
  return localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? DEFAULT_LANGUAGE;
}

export function persistLanguage(language: string): void {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

void i18n.use(initReactI18next).init({
  resources: {
    ar: { translation: ar },
    en: { translation: en },
  },
  lng: readStoredLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false }, // React already escapes; avoids double-escaping.
});

export default i18n;
