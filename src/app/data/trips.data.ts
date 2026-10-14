import { Trip } from '../models/site.models';

/**
 * PUBLISHED TRIPS — add real, company-confirmed trips here.
 * Leave empty until real destinations, dates, prices and availability are supplied;
 * the Trips section then shows an "ask about upcoming trips" message instead.
 */
export const TRIPS: Trip[] = [];

/**
 * DEVELOPMENT-ONLY SAMPLE TRIPS.
 * Rendered only when the app runs in dev mode (`ng serve`) and always labelled "Sample".
 * They are never included in what visitors see in a production build.
 */
export const SAMPLE_TRIPS: Trip[] = [
  {
    id: 'sample-abydos',
    sample: true,
    image: 'abydos-temple',
    destination: { ar: 'أبيدوس – سوهاج', en: 'Abydos – Sohag' },
    description: {
      ar: 'نص تجريبي لوصف الرحلة. يُستبدل بتفاصيل الرحلة الحقيقية عند توفرها.',
      en: 'Placeholder trip description. Replace with real trip details when available.',
    },
    date: '2099-01-15',
    duration: { ar: 'يوم واحد', en: '1 day' },
    price: { amount: 0, currency: 'EGP' },
    availability: 'available',
  },
  {
    id: 'sample-luxor',
    sample: true,
    image: 'luxor-night',
    destination: { ar: 'الأقصر', en: 'Luxor' },
    description: {
      ar: 'نص تجريبي لوصف الرحلة. يُستبدل بتفاصيل الرحلة الحقيقية عند توفرها.',
      en: 'Placeholder trip description. Replace with real trip details when available.',
    },
    date: '2099-02-01',
    duration: { ar: 'يومان', en: '2 days' },
    availability: 'limited',
  },
  {
    id: 'sample-aswan',
    sample: true,
    image: 'aswan-feluccas',
    destination: { ar: 'أسوان', en: 'Aswan' },
    description: {
      ar: 'نص تجريبي لوصف الرحلة. يُستبدل بتفاصيل الرحلة الحقيقية عند توفرها.',
      en: 'Placeholder trip description. Replace with real trip details when available.',
    },
    availability: 'on-request',
  },
  {
    id: 'sample-hurghada',
    sample: true,
    image: 'hurghada-sea',
    destination: { ar: 'الغردقة', en: 'Hurghada' },
    description: {
      ar: 'نص تجريبي لوصف الرحلة. يُستبدل بتفاصيل الرحلة الحقيقية عند توفرها.',
      en: 'Placeholder trip description. Replace with real trip details when available.',
    },
    date: '2099-03-10',
    duration: { ar: '٤ أيام', en: '4 days' },
    price: { amount: 0, currency: 'EGP' },
    availability: 'full',
  },
];
