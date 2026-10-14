import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguageService } from '../core/i18n/language.service';
import { whatsappLink } from '../core/inquiry.service';
import { IconComponent } from './icon.component';

/** Floating "chat on WhatsApp" button. Hidden when no WhatsApp number is configured. */
@Component({
  selector: 'app-whatsapp-fab',
  imports: [IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (url(); as href) {
      <a class="fab" [href]="href" target="_blank" rel="noopener" [attr.aria-label]="i18n.t().form.whatsapp.floating + ' ' + i18n.t().a11y.opensNewTab">
        <app-icon name="whatsapp" [size]="28" />
        <span class="label">{{ i18n.t().form.whatsapp.floating }}</span>
      </a>
    }
  `,
  styles: `
    .fab {
      position: fixed; inset-block-end: 1.25rem; inset-inline-end: 1.25rem; z-index: 40;
      display: inline-flex; align-items: center; gap: .6rem; height: 3.5rem; padding-inline: 1rem;
      border-radius: 999px; background: #128c4b; color: #fff; text-decoration: none; font-weight: 700;
      box-shadow: 0 10px 28px rgb(18 140 75 / .4); transition: transform .2s ease, background-color .2s ease;
      &:hover { background: #0f7a41; transform: translateY(-2px); }
    }
    .label { max-width: 0; overflow: hidden; white-space: nowrap; transition: max-width .3s ease; }
    .fab:hover .label, .fab:focus-visible .label { max-width: 16rem; }
    @media (max-width: 600px) { .fab { inset-block-end: 1rem; inset-inline-end: 1rem; padding-inline: .9rem; } }
  `,
})
export class WhatsappFabComponent {
  protected readonly i18n = inject(LanguageService);
  protected readonly url = computed(() => whatsappLink(this.i18n.t().form.whatsapp.greeting));
}
