// `erasableSyntaxOnly` forbids runtime `enum` — this object+type pattern gives the same
// call-site syntax while remaining fully erasable. Mirrors
// `src/common/enums/region.enum.ts` exactly (FR-097) — Saudi Arabia's 13 administrative
// regions, referenced by code everywhere a region is set (transporter served regions,
// fuel company covered regions), never as free text (Principle I).
export const RegionCode = {
  RIYADH: 'RIYADH',
  MAKKAH: 'MAKKAH',
  MADINAH: 'MADINAH',
  QASSIM: 'QASSIM',
  EASTERN_PROVINCE: 'EASTERN_PROVINCE',
  ASIR: 'ASIR',
  TABUK: 'TABUK',
  HAIL: 'HAIL',
  NORTHERN_BORDERS: 'NORTHERN_BORDERS',
  JAZAN: 'JAZAN',
  NAJRAN: 'NAJRAN',
  AL_BAHAH: 'AL_BAHAH',
  AL_JOUF: 'AL_JOUF',
} as const;

export type RegionCode = (typeof RegionCode)[keyof typeof RegionCode];

export const ALL_REGION_CODES: readonly RegionCode[] = Object.values(RegionCode);

// Mirrors `GovernorateCode` from the same platform file. Display/UX data only — routing
// resolves on `RegionCode` alone (FR-014), never governorate.
export const GovernorateCode = {
  RIYADH_CITY: 'RIYADH_CITY',
  DIRIYAH: 'DIRIYAH',
  KHARJ: 'KHARJ',
  DAWADMI: 'DAWADMI',
  MAJMAAH: 'MAJMAAH',
  MAKKAH_CITY: 'MAKKAH_CITY',
  JEDDAH: 'JEDDAH',
  TAIF: 'TAIF',
  RABIGH: 'RABIGH',
  QUNFUDHAH: 'QUNFUDHAH',
  MADINAH_CITY: 'MADINAH_CITY',
  YANBU: 'YANBU',
  ALULA: 'ALULA',
  BADR: 'BADR',
  BURAYDAH: 'BURAYDAH',
  UNAYZAH: 'UNAYZAH',
  RASS: 'RASS',
  DAMMAM: 'DAMMAM',
  DHAHRAN: 'DHAHRAN',
  KHOBAR: 'KHOBAR',
  AHSA: 'AHSA',
  JUBAIL: 'JUBAIL',
  QATIF: 'QATIF',
  ABHA: 'ABHA',
  KHAMIS_MUSHAIT: 'KHAMIS_MUSHAIT',
  BISHA: 'BISHA',
  TABUK_CITY: 'TABUK_CITY',
  DUBA: 'DUBA',
  HAIL_CITY: 'HAIL_CITY',
  ARAR: 'ARAR',
  RAFHA: 'RAFHA',
  JAZAN_CITY: 'JAZAN_CITY',
  SABYA: 'SABYA',
  NAJRAN_CITY: 'NAJRAN_CITY',
  SHARURAH: 'SHARURAH',
  AL_BAHAH_CITY: 'AL_BAHAH_CITY',
  SAKAKA: 'SAKAKA',
  QURAYYAT: 'QURAYYAT',
} as const;

export type GovernorateCode = (typeof GovernorateCode)[keyof typeof GovernorateCode];

// Phase 6 (US3) T080 — mirrors `src/modules/regions/regions.constants.ts` exactly
// (region → governorate membership only; display names are out of scope here since the
// station form renders governorate codes through i18next like every other enum, FR-097).
// The backend is still the authority that refuses a mismatched pair server-side
// (`governorateBelongsToRegion` in `stations.controller.ts`/`users.controller.ts`) — this
// list exists so the form can narrow the governorate dropdown to a chosen region and
// catch the mismatch before a round trip, not to replace that check.
export const REGION_GOVERNORATES: Record<RegionCode, readonly GovernorateCode[]> = {
  [RegionCode.RIYADH]: [
    GovernorateCode.RIYADH_CITY,
    GovernorateCode.DIRIYAH,
    GovernorateCode.KHARJ,
    GovernorateCode.DAWADMI,
    GovernorateCode.MAJMAAH,
  ],
  [RegionCode.MAKKAH]: [
    GovernorateCode.MAKKAH_CITY,
    GovernorateCode.JEDDAH,
    GovernorateCode.TAIF,
    GovernorateCode.RABIGH,
    GovernorateCode.QUNFUDHAH,
  ],
  [RegionCode.MADINAH]: [
    GovernorateCode.MADINAH_CITY,
    GovernorateCode.YANBU,
    GovernorateCode.ALULA,
    GovernorateCode.BADR,
  ],
  [RegionCode.QASSIM]: [GovernorateCode.BURAYDAH, GovernorateCode.UNAYZAH, GovernorateCode.RASS],
  [RegionCode.EASTERN_PROVINCE]: [
    GovernorateCode.DAMMAM,
    GovernorateCode.DHAHRAN,
    GovernorateCode.KHOBAR,
    GovernorateCode.AHSA,
    GovernorateCode.JUBAIL,
    GovernorateCode.QATIF,
  ],
  [RegionCode.ASIR]: [GovernorateCode.ABHA, GovernorateCode.KHAMIS_MUSHAIT, GovernorateCode.BISHA],
  [RegionCode.TABUK]: [GovernorateCode.TABUK_CITY, GovernorateCode.DUBA],
  [RegionCode.HAIL]: [GovernorateCode.HAIL_CITY],
  [RegionCode.NORTHERN_BORDERS]: [GovernorateCode.ARAR, GovernorateCode.RAFHA],
  [RegionCode.JAZAN]: [GovernorateCode.JAZAN_CITY, GovernorateCode.SABYA],
  [RegionCode.NAJRAN]: [GovernorateCode.NAJRAN_CITY, GovernorateCode.SHARURAH],
  [RegionCode.AL_BAHAH]: [GovernorateCode.AL_BAHAH_CITY],
  [RegionCode.AL_JOUF]: [GovernorateCode.SAKAKA, GovernorateCode.QURAYYAT],
};

export function governorateBelongsToRegion(
  governorate: GovernorateCode,
  region: RegionCode,
): boolean {
  return REGION_GOVERNORATES[region].includes(governorate);
}

// Display names, mirroring `regions.constants.ts`'s `REGIONS`/`GOVERNORATE_NAMES` —
// bilingual reference data for a fixed geographic list, not translatable UI copy, so it
// lives here as data rather than as ~90 more i18next keys.
export const REGION_NAMES: Record<RegionCode, { ar: string; en: string }> = {
  [RegionCode.RIYADH]: { ar: 'الرياض', en: 'Riyadh' },
  [RegionCode.MAKKAH]: { ar: 'مكة المكرمة', en: 'Makkah' },
  [RegionCode.MADINAH]: { ar: 'المدينة المنورة', en: 'Madinah' },
  [RegionCode.QASSIM]: { ar: 'القصيم', en: 'Qassim' },
  [RegionCode.EASTERN_PROVINCE]: { ar: 'المنطقة الشرقية', en: 'Eastern Province' },
  [RegionCode.ASIR]: { ar: 'عسير', en: 'Asir' },
  [RegionCode.TABUK]: { ar: 'تبوك', en: 'Tabuk' },
  [RegionCode.HAIL]: { ar: 'حائل', en: 'Hail' },
  [RegionCode.NORTHERN_BORDERS]: { ar: 'الحدود الشمالية', en: 'Northern Borders' },
  [RegionCode.JAZAN]: { ar: 'جازان', en: 'Jazan' },
  [RegionCode.NAJRAN]: { ar: 'نجران', en: 'Najran' },
  [RegionCode.AL_BAHAH]: { ar: 'الباحة', en: 'Al Bahah' },
  [RegionCode.AL_JOUF]: { ar: 'الجوف', en: 'Al Jouf' },
};

export const GOVERNORATE_NAMES: Record<GovernorateCode, { ar: string; en: string }> = {
  [GovernorateCode.RIYADH_CITY]: { ar: 'الرياض', en: 'Riyadh' },
  [GovernorateCode.DIRIYAH]: { ar: 'الدرعية', en: 'Diriyah' },
  [GovernorateCode.KHARJ]: { ar: 'الخرج', en: 'Al-Kharj' },
  [GovernorateCode.DAWADMI]: { ar: 'الدوادمي', en: 'Al-Dawadmi' },
  [GovernorateCode.MAJMAAH]: { ar: 'المجمعة', en: "Al-Majma'ah" },
  [GovernorateCode.MAKKAH_CITY]: { ar: 'مكة المكرمة', en: 'Makkah' },
  [GovernorateCode.JEDDAH]: { ar: 'جدة', en: 'Jeddah' },
  [GovernorateCode.TAIF]: { ar: 'الطائف', en: 'Taif' },
  [GovernorateCode.RABIGH]: { ar: 'رابغ', en: 'Rabigh' },
  [GovernorateCode.QUNFUDHAH]: { ar: 'القنفذة', en: 'Al-Qunfudhah' },
  [GovernorateCode.MADINAH_CITY]: { ar: 'المدينة المنورة', en: 'Madinah' },
  [GovernorateCode.YANBU]: { ar: 'ينبع', en: 'Yanbu' },
  [GovernorateCode.ALULA]: { ar: 'العلا', en: 'AlUla' },
  [GovernorateCode.BADR]: { ar: 'بدر', en: 'Badr' },
  [GovernorateCode.BURAYDAH]: { ar: 'بريدة', en: 'Buraydah' },
  [GovernorateCode.UNAYZAH]: { ar: 'عنيزة', en: 'Unaizah' },
  [GovernorateCode.RASS]: { ar: 'الرس', en: 'Ar Rass' },
  [GovernorateCode.DAMMAM]: { ar: 'الدمام', en: 'Dammam' },
  [GovernorateCode.DHAHRAN]: { ar: 'الظهران', en: 'Dhahran' },
  [GovernorateCode.KHOBAR]: { ar: 'الخبر', en: 'Al Khobar' },
  [GovernorateCode.AHSA]: { ar: 'الأحساء', en: 'Al-Ahsa' },
  [GovernorateCode.JUBAIL]: { ar: 'الجبيل', en: 'Jubail' },
  [GovernorateCode.QATIF]: { ar: 'القطيف', en: 'Qatif' },
  [GovernorateCode.ABHA]: { ar: 'أبها', en: 'Abha' },
  [GovernorateCode.KHAMIS_MUSHAIT]: { ar: 'خميس مشيط', en: 'Khamis Mushait' },
  [GovernorateCode.BISHA]: { ar: 'بيشة', en: 'Bisha' },
  [GovernorateCode.TABUK_CITY]: { ar: 'تبوك', en: 'Tabuk' },
  [GovernorateCode.DUBA]: { ar: 'ضباء', en: 'Duba' },
  [GovernorateCode.HAIL_CITY]: { ar: 'حائل', en: 'Hail' },
  [GovernorateCode.ARAR]: { ar: 'عرعر', en: 'Arar' },
  [GovernorateCode.RAFHA]: { ar: 'رفحاء', en: 'Rafha' },
  [GovernorateCode.JAZAN_CITY]: { ar: 'جازان', en: 'Jazan' },
  [GovernorateCode.SABYA]: { ar: 'صبيا', en: 'Sabya' },
  [GovernorateCode.NAJRAN_CITY]: { ar: 'نجران', en: 'Najran' },
  [GovernorateCode.SHARURAH]: { ar: 'شرورة', en: 'Sharurah' },
  [GovernorateCode.AL_BAHAH_CITY]: { ar: 'الباحة', en: 'Al Bahah' },
  [GovernorateCode.SAKAKA]: { ar: 'سكاكا', en: 'Sakaka' },
  [GovernorateCode.QURAYYAT]: { ar: 'القريات', en: 'Qurayyat' },
};

export function regionLabel(code: RegionCode, lang: string): string {
  return lang.startsWith('ar') ? REGION_NAMES[code].ar : REGION_NAMES[code].en;
}

export function governorateLabel(code: GovernorateCode, lang: string): string {
  return lang.startsWith('ar') ? GOVERNORATE_NAMES[code].ar : GOVERNORATE_NAMES[code].en;
}
