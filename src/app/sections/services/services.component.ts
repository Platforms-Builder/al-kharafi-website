import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InquiryDraftService } from '../../core/inquiry.service';
import { LanguageService } from '../../core/i18n/language.service';
import { ScrollService } from '../../core/scroll.service';
import { SERVICES } from '../../data/services.data';
import { ServiceItem } from '../../models/site.models';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';
import { SiteImageComponent } from '../../shared/site-image.component';

@Component({
  selector: 'app-services',
  imports: [IconComponent, RevealDirective, SectionHeadingComponent, SiteImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t();
    <section id="services" class="section soft" aria-labelledby="services-title">
      <div class="container">
        <app-section-heading [eyebrow]="t.services.eyebrow" [title]="t.services.title" [intro]="t.services.intro"
          headingId="services-title" align="center" />

        <ul class="cards">
          @for (service of services; track service.id) {
            <li class="card" appReveal>
              <app-site-image class="media" [key]="service.image" sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
              <div class="body">
                <span class="icon"><app-icon [name]="service.icon" [size]="26" /></span>
                <h3>{{ i18n.pick(service.title) }}</h3>
                <p>{{ i18n.pick(service.description) }}</p>
                @if (service.note) {
                  <p class="card-note"><app-icon name="check" [size]="16" /> {{ i18n.pick(service.note) }}</p>
                }
                <button type="button" class="link-btn" (click)="inquire(service)">
                  {{ t.services.cardCta }} <app-icon name="arrow" [size]="16" [flip]="true" />
                  <span class="visually-hidden">: {{ i18n.pick(service.title) }}</span>
                </button>
              </div>
            </li>
          }
        </ul>

      </div>
    </section>
  `,
  styles: `
    .cards {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin: 0; padding: 0; list-style: none;
    }
    .card {
      display: flex; flex-direction: column; overflow: hidden;
      background: #fff; border-radius: var(--radius-lg); box-shadow: var(--shadow); border: 1px solid var(--line);
      transition: transform .3s ease, box-shadow .3s ease;
      &:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    }
    .media { aspect-ratio: 16 / 9; }
    .body { position: relative; display: flex; flex-direction: column; flex: 1; padding: 2.25rem 1.5rem 1.5rem; }
    .icon {
      position: absolute; top: -1.75rem; inset-inline-start: 1.5rem; display: grid; place-items: center;
      width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--navy); color: var(--gold);
      box-shadow: 0 0 0 4px #fff;
    }
    h3 { margin: 0 0 .6rem; font-family: var(--font-display); font-size: 1.3rem; color: var(--navy); }
    p { margin: 0 0 1.25rem; color: var(--text-muted); line-height: 1.85; flex: 1; }
    .card-note {
      flex: 0; display: flex; align-items: center; gap: .4rem; margin-top: -.5rem;
      color: #1f7a4d; font-weight: 700; font-size: .88rem;
    }
    @media (max-width: 1100px) { .cards { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 700px) { .cards { grid-template-columns: 1fr; } }
  `,
})
export class ServicesComponent {
  protected readonly i18n = inject(LanguageService);
  private readonly draft = inject(InquiryDraftService);
  private readonly scroll = inject(ScrollService);
  protected readonly services = SERVICES;

  protected inquire(service: ServiceItem): void {
    this.draft.prefill({ service: service.id });
    this.scroll.toSection('contact', '#inq-name');
  }
}
