import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { COMPANY } from '../../data/company.data';
import { IconComponent } from '../../shared/icon.component';
import { SiteImageComponent } from '../../shared/site-image.component';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, IconComponent, SiteImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t();
    <section id="home" class="hero" aria-labelledby="hero-title">
      <app-site-image class="bg" key="hero-road-dusk" [priority]="true" sizes="100vw" [showBadge]="false" />
      <div class="overlay" aria-hidden="true"></div>

      <div class="container content">
        <p class="eyebrow"><app-icon name="pin" [size]="16" /> {{ t.hero.eyebrow }}</p>
        <h1 id="hero-title">{{ t.hero.title }}</h1>
        <p class="company">{{ i18n.lang() === 'ar' ? company.name.ar : company.tagline.en }}</p>
        <p class="lead">{{ t.hero.description }}</p>
        <div class="actions">
          <a class="btn btn-gold btn-lg" [routerLink]="['/', i18n.lang()]" fragment="contact">
            {{ t.hero.primaryCta }} <app-icon name="arrow" [size]="18" [flip]="true" />
          </a>
          <a class="btn btn-ghost btn-lg" [routerLink]="['/', i18n.lang()]" fragment="services">{{ t.hero.secondaryCta }}</a>
        </div>
        <ul class="pillars">
          @for (p of t.hero.pillars; track p) {
            <li>{{ p }}</li>
          }
        </ul>
      </div>
      <span class="photo-note">{{ t.common.illustrative }}</span>
    </section>
  `,
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  protected readonly i18n = inject(LanguageService);
  protected readonly company = COMPANY;
}
