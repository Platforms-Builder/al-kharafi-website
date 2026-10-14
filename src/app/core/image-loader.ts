import { ImageLoaderConfig } from '@angular/common';

/** Maps NgOptimizedImage requests to the pre-generated `-800.webp` / `-1600.webp` variants. */
export function siteImageLoader(config: ImageLoaderConfig): string {
  const size = config.width && config.width <= 800 ? 800 : 1600;
  return `${config.src}-${size}.webp`;
}
