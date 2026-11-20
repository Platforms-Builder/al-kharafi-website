import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { IMAGES } from '../data/images.data';
import { LanguageService } from '../core/i18n/language.service';
import { SiteImage } from '../models/site.models';

/** Responsive image that fills its (positioned) host. */
@Component({
  selector: 'app-site-image',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img [ngSrc]="image().src" ngSrcset="800w, 1600w" [sizes]="sizes()" fill [priority]="priority()"
      [alt]="decorative() ? '' : i18n.pick(image().alt)" />
  `,
  styles: `
    :host { position: relative; display: block; overflow: hidden; background: var(--navy-2); }
    img { object-fit: cover; }
  `,
})
export class SiteImageComponent {
  protected readonly i18n = inject(LanguageService);
  readonly key = input.required<string>();
  readonly sizes = input('100vw');
  readonly priority = input(false);
  readonly decorative = input(false);
  protected readonly image = computed<SiteImage>(() => (IMAGES as Record<string, SiteImage>)[this.key()]);
}
