import { ChangeDetectionStrategy, Component, afterNextRender, effect, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../core/i18n/language.service';
import { SeoService } from '../core/seo.service';
import { IMAGES } from '../data/images.data';
import { SiteImage } from '../models/site.models';
import { IconComponent } from '../shared/icon.component';

@Component({
  selector: 'app-credits-page',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let t = i18n.t();
    <section class="section page" aria-labelledby="credits-title">
      <div class="container">
        <h1 id="credits-title">{{ t.credits.title }}</h1>
        <p class="intro">{{ t.credits.intro }}</p>
        <div class="table-wrap" tabindex="0" role="region" [attr.aria-labelledby]="'credits-title'">
          <table>
            <thead>
              <tr>
                <th scope="col">{{ t.credits.image }}</th>
                <th scope="col">{{ t.credits.author }}</th>
                <th scope="col">{{ t.credits.license }}</th>
                <th scope="col">{{ t.credits.source }}</th>
              </tr>
            </thead>
            <tbody>
              @for (img of images; track img.src) {
                @if (img.credit; as c) {
                  <tr>
                    <td>{{ i18n.pick(img.alt) }}</td>
                    <td dir="auto">{{ c.author }}</td>
                    <td><a [href]="c.licenseUrl" target="_blank" rel="noopener license">{{ c.license }}</a></td>
                    <td><a [href]="c.source" target="_blank" rel="noopener" dir="ltr">{{ c.title }}</a></td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
        <a class="btn btn-navy" [routerLink]="['/', i18n.lang()]">
          <app-icon name="arrow" [size]="18" [flip]="i18n.dir() === 'ltr'" /> {{ t.credits.back }}
        </a>
      </div>
    </section>
  `,
  styles: `
    .page { padding-top: calc(var(--header-h) + 3rem); min-height: 70vh; }
    h1 { margin: 0 0 1rem; font-family: var(--font-display); color: var(--navy); font-size: clamp(1.9rem, 3.5vw, 2.6rem); }
    .intro { max-width: 52rem; margin: 0 0 2rem; color: var(--text-muted); line-height: 1.9; }
    .table-wrap { overflow-x: auto; margin-bottom: 2rem; border: 1px solid var(--line); border-radius: var(--radius); }
    table { width: 100%; border-collapse: collapse; font-size: .92rem; }
    th, td { padding: .85rem 1rem; text-align: start; border-bottom: 1px solid var(--line); vertical-align: top; }
    th { background: var(--soft); color: var(--navy); }
    tr:last-child td { border-bottom: 0; }
    a { color: var(--navy-2); }
  `,
})
export class CreditsPage {
  protected readonly i18n = inject(LanguageService);
  protected readonly images = Object.values(IMAGES) as SiteImage[];

  constructor() {
    const seo = inject(SeoService);
    effect(() => {
      this.i18n.lang();
      seo.apply('credits');
    });
    afterNextRender(() => window.scrollTo(0, 0));
  }
}
