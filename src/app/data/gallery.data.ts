import { GalleryItem } from '../models/site.models';

/**
 * Gallery items. The current entries are licensed illustrative photos (see images.data.ts).
 * Add the company's own photos with category 'company-trips' or 'transport' as they become available.
 */
export const GALLERY: GalleryItem[] = [
  { image: 'hero-road-dusk', category: 'transport' },
  { image: 'abydos-temple', category: 'destinations' },
  { image: 'coaches-giza', category: 'transport' },
  { image: 'luxor-night', category: 'destinations' },
  { image: 'aswan-feluccas', category: 'destinations' },
  { image: 'road-sunset', category: 'transport' },
  { image: 'karnak', category: 'destinations' },
  { image: 'hurghada-sea', category: 'destinations' },
  { image: 'road-palms', category: 'transport' },
  { image: 'giza-pyramids', category: 'destinations' },
];
