import type { Direction, Language } from '@/constants/order-status';
import { directionForLanguage } from '@/constants/order-status';

/** Keeps <html dir lang> in sync with the active language so browser-native mirroring
 *  (scrollbars, form controls, bidi text) matches Tailwind's logical-property utilities. */
export function syncDocumentDirection(language: Language): Direction {
  const direction = directionForLanguage(language);
  document.documentElement.dir = direction;
  document.documentElement.lang = language;
  return direction;
}
