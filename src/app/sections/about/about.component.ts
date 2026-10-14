import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { COMPANY } from '../../data/company.data';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';
import { SiteImageComponent } from '../../shared/site-image.component';

@Component({
  selector: 'app-about',
  imports: [RouterLink, IconComponent, RevealDirective, SectionHeadingComponent, SiteImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t();
    <section id="about" class="section" aria-labelledby="about-title">
      <div class="container grid">
        <div class="media" appReveal>
          <app-site-image class="photo" key="abydos-columns" sizes="(max-width: 900px) 100vw, 45vw" />
          <div class="frame" aria-hidden="true"></div>
        </div>

        <div appReveal>
          <app-section-heading [eyebrow]="t.about.eyebrow" [title]="t.about.title" headingId="about-title" />
          <p class="lead">{{ t.about.lead }}</p>
          <p class="body">{{ t.about.body }}</p>

          <div class="facts-card">
            <div class="facts-head">
              <img [src]="company.logo.onLight" alt="" width="84" height="63" loading="lazy" />
              <div>
                <p class="facts-title">{{ t.about.factsTitle }}</p>
                <p class="facts-name">{{ i18n.pick(company.name) }}</p>
              </div>
            </div>
            <dl class="facts" [attr.aria-label]="t.about.factsTitle">
              <div>
                <dt><app-icon name="compass" [size]="18" /> {{ t.about.facts.activity }}</dt>
                <dd>{{ t.about.facts.activityValue }}</dd>
              </div>
              <div>
                <dt><app-icon name="pin" [size]="18" /> {{ t.about.facts.location }}</dt>
                <dd>{{ i18n.pick(company.city) }}</dd>
              </div>
              <div>
                <dt><app-icon name="user" [size]="18" /> {{ t.about.facts.representative }}</dt>
                <dd>{{ i18n.pick(company.representative) }}</dd>
              </div>
            </dl>
          </div>

          <a class="btn btn-navy" [routerLink]="['/', i18n.lang()]" fragment="contact">
            {{ t.about.cta }} <app-icon name="arrow" [size]="18" [flip]="true" />
          </a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid { display: grid; grid-template-columns: 5fr 6fr; gap: clamp(2rem, 6vw, 5rem); align-items: center; }
    .media { position: relative; padding: 0 0 1.5rem; padding-inline-end: 1.5rem; }
    .photo { aspect-ratio: 4 / 5; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg); z-index: 1; }
    .frame {
      position: absolute; inset-block: 1.5rem 0; inset-inline: 1.5rem 0; border: 2px solid var(--gold);
      border-radius: var(--radius-lg); z-index: 0;
    }
    .lead { font-size: 1.2rem; line-height: 1.9; color: var(--navy); font-weight: 600; margin: 0 0 1rem; }
    .body { color: var(--text-muted); line-height: 1.95; margin: 0 0 2rem; }
    .facts-card { margin: 0 0 2rem; border-radius: var(--radius); background: var(--soft); border: 1px solid var(--line); overflow: hidden; }
    .facts-head {
      display: flex; align-items: center; gap: 1rem; padding: 1rem 1.25rem; background: #fff; border-bottom: 1px solid var(--line);
      img { width: 84px; height: 63px; object-fit: contain; }
      p { margin: 0; }
    }
    .facts-title { color: var(--gold-ink); font-weight: 700; font-size: .85rem; }
    .facts-name { color: var(--navy); font-weight: 700; line-height: 1.5; }
    .facts {
      display: grid; gap: 0; margin: 0;
      > div { display: grid; grid-template-columns: minmax(9rem, auto) 1fr; gap: 1rem; padding: 1rem 1.25rem; }
      > div + div { border-top: 1px solid var(--line); }
      dt { display: flex; align-items: center; gap: .5rem; color: var(--gold-ink); font-weight: 700; }
      dd { margin: 0; color: var(--navy); font-weight: 600; }
    }
    @media (max-width: 900px) {
      .grid { grid-template-columns: 1fr; }
      .photo { aspect-ratio: 16 / 10; }
    }
    @media (max-width: 520px) {
      .facts > div { grid-template-columns: 1fr; gap: .25rem; }
    }
  `,
})
export class AboutComponent {
  protected readonly i18n = inject(LanguageService);
  protected readonly company = COMPANY;
}
