// Country-code choices for the sign-in screen. `code` is the E.164 country prefix the
// LoginPage prepends to the national number — the platform validates E.164 only
// (`E164_PATTERN`), so any of these composes a number it accepts. `+966` stays the default
// and keeps the stricter Saudi-mobile check (`looksLikeSaudiMobile`).
export interface Country {
  code: string;
  name: string;
  flag: string; // URL to flag image from flagcdn.com
}

export const COUNTRIES: Country[] = [
  { code: '+966', name: 'SA', flag: 'https://flagcdn.com/w40/sa.png' },
  { code: '+971', name: 'AE', flag: 'https://flagcdn.com/w40/ae.png' },
  { code: '+965', name: 'KW', flag: 'https://flagcdn.com/w40/kw.png' },
  { code: '+974', name: 'QA', flag: 'https://flagcdn.com/w40/qa.png' },
  { code: '+973', name: 'BH', flag: 'https://flagcdn.com/w40/bh.png' },
  { code: '+968', name: 'OM', flag: 'https://flagcdn.com/w40/om.png' },
  { code: '+20',  name: 'EG', flag: 'https://flagcdn.com/w40/eg.png' },
];

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}
