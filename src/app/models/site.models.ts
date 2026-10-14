export type Lang = 'ar' | 'en';

/** A string available in both site languages. */
export interface Localized {
  ar: string;
  en: string;
}

export interface ImageCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export interface SiteImage {
  /** Path without size suffix/extension; the image loader appends `-800.webp` / `-1600.webp`. */
  src: string;
  width: number;
  height: number;
  alt: Localized;
  /** True for licensed stock/illustrative photos that do not show the company's own vehicles or trips. */
  illustrative: boolean;
  credit?: ImageCredit;
}

export type PhoneKind = 'landline' | 'mobile';

export interface PhoneNumber {
  /** Exactly as supplied by the company — never reformatted for display. */
  display: string;
  /** E.164 value used for the tel: link. */
  e164: string;
  kind: PhoneKind;
  country: 'EG' | 'SA';
}

export type ServiceId =
  | 'land-transport' | 'tourism-services' | 'organized-trips' | 'group-transport' | 'travel-planning';

export interface ServiceItem {
  id: ServiceId;
  icon: IconName;
  image: string;
  title: Localized;
  description: Localized;
  /** Optional licence / registration note shown on the card. */
  note?: Localized | null;
}

export type TripAvailability = 'available' | 'limited' | 'full' | 'on-request';

export interface Trip {
  id: string;
  destination: Localized;
  description: Localized;
  image: string;
  /** ISO date (YYYY-MM-DD). Omit when not scheduled. */
  date?: string;
  duration?: Localized;
  price?: { amount: number; currency: 'EGP' | 'SAR' | 'USD' };
  availability: TripAvailability;
  /** Sample content is only rendered in development builds and is always visibly labelled. */
  sample?: boolean;
}

export type GalleryCategory = 'transport' | 'destinations' | 'company-trips';

export interface GalleryItem {
  image: string;
  category: GalleryCategory;
}

export type IconName =
  | 'bus' | 'compass' | 'route' | 'users' | 'chat' | 'phone' | 'pin' | 'facebook' | 'whatsapp'
  | 'menu' | 'close' | 'calendar' | 'clock' | 'tag' | 'check' | 'arrow' | 'globe' | 'headset'
  | 'seat' | 'map' | 'user' | 'briefcase' | 'chevron-left' | 'chevron-right' | 'expand' | 'copy' | 'info';
