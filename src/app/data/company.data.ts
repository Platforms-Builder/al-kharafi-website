import { Localized, PhoneNumber } from '../models/site.models';

/**
 * Single source of truth for verified company information.
 * Only edit with information confirmed by the company.
 */
export const COMPANY = {
  name: {
    ar: 'شركة الخارفي للاستثمار السياحي والنقل البري والرحلات',
    en: 'Al-Kharafi',
  } satisfies Localized,
  shortName: { ar: 'الخارفي', en: 'Al-Kharafi' } satisfies Localized,
  tagline: {
    ar: 'للاستثمار السياحي والنقل البري والرحلات',
    en: 'Tourism Investment, Land Transport & Trips',
  } satisfies Localized,

  representative: {
    ar: 'م. عبد الحميد الخارفي',
    en: 'Eng. Abdulhamid Al-Kharafi',
  } satisfies Localized,

  address: {
    ar: 'سوهاج، شارع مدرسة الزراعة، أبراج الجهاز المركزي للمحاسبات.',
    en: 'Agricultural School Street, Central Auditing Organization Towers, Sohag, Egypt.',
  } satisfies Localized,
  city: { ar: 'سوهاج، مصر', en: 'Sohag, Egypt' } satisfies Localized,

  /** Exact Google Maps pin for the company location, provided by the company. */
  mapUrl: 'https://maps.app.goo.gl/tZ6KX8aC71demgMz7',

  phones: [
    { display: '0932100091', e164: '+20932100091', kind: 'landline', country: 'EG' },
    { display: '01029274903', e164: '+201029274903', kind: 'mobile', country: 'EG' },
    { display: '00966534962062', e164: '+966534962062', kind: 'mobile', country: 'SA' },
    { display: '01559421249', e164: '+201559421249', kind: 'mobile', country: 'EG' },
    { display: '01010211013', e164: '+201010211013', kind: 'mobile', country: 'EG' },
  ] satisfies PhoneNumber[],

  facebookUrl: 'https://web.facebook.com/profile.php?id=61576808551940',

  /**
   * WhatsApp number in international format without "+" — confirmed by the company (01559421249).
   * The inquiry form opens a pre-filled WhatsApp chat to this number. Set to null to disable.
   */
  whatsapp: '201559421249' as string | null,

  /**
   * Eagle mark extracted from the official logo (text removed).
   * `onDark`: gold version for navy backgrounds; `onLight`: original colours for light backgrounds.
   * Replace with exports from the original vector file when available.
   */
  logo: {
    onDarkSmall: 'brand/eagle-gold-160.webp',
    onDark: 'brand/eagle-gold-400.webp',
    onLight: 'brand/eagle-color-400.webp',
    /** PNG used for search engines (structured data). */
    png: 'brand/eagle-color.png',
    ratio: 504 / 375,
  },

  /** Original QR code images from the business card. Do not regenerate them. */
  qrCodes: {
    facebook: null as string | null,
    location: null as string | null,
  },

  /**
   * Endpoint that receives inquiry form submissions as JSON (POST).
   * While null, the form never claims that anything was sent — it asks the visitor to call instead.
   */
  inquiryEndpoint: null as string | null,
} as const;
