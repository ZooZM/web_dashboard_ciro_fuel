import { describe, expect, it } from 'vitest';
import i18n from '@/lib/i18n/i18n';
import ar from '@/lib/i18n/ar.json';
import en from '@/lib/i18n/en.json';
import { useLanguageStore } from '@/stores/language.store';
import { directionForLanguage } from '@/constants/order-status';

function flattenKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === 'object' && value !== null
      ? flattenKeys(value as Record<string, unknown>, path)
      : [path];
  });
}

describe('AR/EN localization + RTL (FR-021/FR-022, SC-009)', () => {
  it('has an identical key set in both language bundles (no missing translations)', () => {
    const arKeys = flattenKeys(ar).sort();
    const enKeys = flattenKeys(en).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it('maps Arabic to RTL and English to LTR', () => {
    expect(directionForLanguage('ar')).toBe('rtl');
    expect(directionForLanguage('en')).toBe('ltr');
  });

  it('switching languages updates <html dir lang> and the active i18next language', () => {
    useLanguageStore.getState().setLanguage('en');
    expect(document.documentElement.dir).toBe('ltr');
    expect(document.documentElement.lang).toBe('en');
    expect(i18n.language).toBe('en');

    useLanguageStore.getState().setLanguage('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(document.documentElement.lang).toBe('ar');
    expect(i18n.language).toBe('ar');
  });
});
