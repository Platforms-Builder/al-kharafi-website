import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LanguageService } from '../../core/i18n/language.service';
import { IconName } from '../../models/site.models';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';
import { SiteImageComponent } from '../../shared/site-image.component';

@Component({
  selector: 'app-why-us',
  imports: [IconComponent, RevealDirective, SectionHeadingComponent, SiteImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t();
    <section class="section why" aria-labelledby="why-title">
      <app-site-image class="bg" key="road-sunset" sizes="100vw" [decorative]="true" [showBadge]="false" />
      <div class="container">
        <app-section-heading [eyebrow]="t.why.eyebrow" [title]="t.why.title" [intro]="t.why.intro"
          headingId="why-title" tone="light" align="center" />
        <ul class="items">
          @for (item of t.why.items; track item.title) {
            <li appReveal>
              <span class="icon"><app-icon [name]="asIcon(item.icon)" [size]="28" /></span>
              <h3>{{ item.title }}</h3>
              <p>{{ item.body }}</p>
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .why { position: relative; color: #fff; isolation: isolate; overflow: hidden; background: var(--navy); }
    .bg { position: absolute; inset: 0; z-index: -2; opacity: .35; }
    .why::after {
      content: ''; position: absolute; inset: 0; z-index: -1;
      background: linear-gradient(180deg, rgb(16 36 58 / .96), rgb(16 36 58 / .86) 50%, rgb(16 36 58 / .97));
    }
    .items { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.25rem; margin: 0; padding: 0; list-style: none; }
    li {
      padding: 2rem 1.5rem; border-radius: var(--radius-lg); text-align: center;
      background: rgb(255 255 255 / .05); border: 1px solid rgb(200 164 93 / .28);
      transition: background-color .3s ease, border-color .3s ease;
      &:hover { background: rgb(255 255 255 / .09); border-color: var(--gold); }
    }
    .icon {
      display: inline-grid; place-items: center; width: 4rem; height: 4rem; margin-bottom: 1.1rem;
      border-radius: 50%; background: rgb(200 164 93 / .14); color: var(--gold);
    }
    h3 { margin: 0 0 .6rem; font-family: var(--font-display); font-size: 1.2rem; }
    p { margin: 0; color: rgb(255 255 255 / .78); line-height: 1.85; font-size: .96rem; }
    @media (max-width: 1000px) { .items { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px) { .items { grid-template-columns: 1fr; } }
  `,
})
export class WhyUsComponent {
  protected readonly i18n = inject(LanguageService);
  protected asIcon(name: string): IconName {
    return name as IconName;
  }
}
