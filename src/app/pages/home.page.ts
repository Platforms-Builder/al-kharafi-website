import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { LanguageService } from '../core/i18n/language.service';
import { SeoService } from '../core/seo.service';
import { AboutComponent } from '../sections/about/about.component';
import { ContactComponent } from '../sections/contact/contact.component';
import { GalleryComponent } from '../sections/gallery/gallery.component';
import { HeroComponent } from '../sections/hero/hero.component';
import { ServicesComponent } from '../sections/services/services.component';
import { TripsComponent } from '../sections/trips/trips.component';
import { WhyUsComponent } from '../sections/why-us/why-us.component';

@Component({
  selector: 'app-home-page',
  imports: [HeroComponent, AboutComponent, ServicesComponent, TripsComponent, WhyUsComponent, GalleryComponent, ContactComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <app-about />
    <app-services />
    <app-trips />
    <app-why-us />
    <app-gallery />
    <app-contact />
  `,
})
export class HomePage {
  constructor() {
    const seo = inject(SeoService);
    const lang = inject(LanguageService).lang;
    effect(() => {
      lang();
      seo.apply('home');
    });
  }
}
