import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { IMAGES } from '../data/images.data';
import { LanguageService } from '../core/i18n/language.service';
import { SiteImage } from '../models/site.models';

/** Responsive image that fills its (positioned) host and flags illustrative stock photography. */
@Component({
  selector: 'app-site-image',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <img [ngSrc]="image().src" ngSrcset="800w, 1600w" [sizes]="sizes()" fill [priority]="priority()"
      [alt]="decorative() ? '' : i18n.pick(image().alt)" />
    @if (image().illustrative && showBadge()) {
      <span class="badge" [title]="i18n.t().common.illustrativeLong">{{ i18n.t().common.illustrative }}</span>
    }
  `,
  styles: `
    :host { position: relative; display: block; overflow: hidden; background: var(--navy-2); }
    img { object-fit: cover; }
    .badge {
      position: absolute; inset-block-end: .6rem; inset-inline-start: .6rem; z-index: 1;
      padding: .2rem .55rem; border-radius: 999px; font-size: .72rem; font-weight: 600;
      color: #fff; background: rgb(16 36 58 / .72); backdrop-filter: blur(4px);
    }
  `,
})
export class SiteImageComponent {
  protected readonly i18n = inject(LanguageService);
  readonly key = input.required<string>();
  readonly sizes = input('100vw');
  readonly priority = input(false);
  readonly decorative = input(false);
  readonly showBadge = input(true);
  protected readonly image = computed<SiteImage>(() => (IMAGES as Record<string, SiteImage>)[this.key()]);
}
