import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ar } from '../../core/i18n/ar';
import { en } from '../../core/i18n/en';
import { LanguageService } from '../../core/i18n/language.service';
import { COMPANY } from '../../data/company.data';
import { SERVICES } from '../../data/services.data';
import { IconComponent } from '../../shared/icon.component';
import { NAV_SECTIONS } from '../header/header.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  protected readonly i18n = inject(LanguageService);
  protected readonly company = COMPANY;
  protected readonly services = SERVICES;
  protected readonly sections = NAV_SECTIONS;
  /** Shown in both languages regardless of the active one. */
  protected readonly copyright = { ar: ar.footer.copyright, en: en.footer.copyright };
  protected readonly year = new Date().getFullYear();
}
