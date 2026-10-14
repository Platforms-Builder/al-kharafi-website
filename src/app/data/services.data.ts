import { ServiceItem } from '../models/site.models';

/**
 * Service categories, derived from the registered company name.
 * Replace with the confirmed service list when the company supplies it.
 */
export const SERVICES: ServiceItem[] = [
  {
    id: 'land-transport',
    icon: 'bus',
    image: 'road-palms',
    title: { ar: 'النقل البري', en: 'Land Transportation' },
    description: {
      ar: 'خدمات نقل بري للأفراد والمجموعات بين المدن والوجهات المختلفة، مع التنسيق المسبق لمواعيد وخط سير الرحلة.',
      en: 'Road transport for individuals and groups between cities and destinations, with schedules and routes coordinated in advance.',
    },
  },
  {
    id: 'tourism-services',
    icon: 'compass',
    image: 'luxor-temple',
    title: { ar: 'الخدمات السياحية', en: 'Tourism & Travel Services' },
    description: {
      ar: 'مساعدة في الترتيب لزيارة المعالم والوجهات السياحية بما يتناسب مع اهتماماتك وميزانيتك.',
      en: 'Help arranging visits to landmarks and tourist destinations that match your interests and budget.',
    },
  },
  {
    id: 'organized-trips',
    icon: 'route',
    image: 'aswan-feluccas',
    title: { ar: 'الرحلات السياحية', en: 'Organized Trips & Excursions' },
    description: {
      ar: 'رحلات ونزهات منظمة يتم الإعلان عن مواعيدها وتفاصيلها، ويمكنك الاستفسار عن الرحلات القادمة في أي وقت.',
      en: 'Organized trips and excursions announced with their dates and details — ask us about upcoming trips at any time.',
    },
  },
  {
    id: 'group-transport',
    icon: 'users',
    image: 'coaches-giza',
    title: { ar: 'نقل المجموعات', en: 'Group Transportation' },
    description: {
      ar: 'تنسيق انتقالات العائلات والمدارس والشركات والمجموعات، حسب عدد المسافرين وطبيعة الرحلة.',
      en: 'Transport for families, schools, companies and groups, arranged around the number of travellers and the type of trip.',
    },
  },
  {
    id: 'travel-planning',
    icon: 'chat',
    image: 'road-mountains',
    title: { ar: 'الاستفسار عن الرحلات', en: 'Travel Planning & Inquiries' },
    description: {
      ar: 'تحدث مع فريقنا لمعرفة الخيارات المتاحة وتخطيط رحلتك خطوة بخطوة قبل السفر.',
      en: 'Talk to our team about the available options and plan your journey step by step before you travel.',
    },
  },
];
