import { ChangeDetectionStrategy, Component, computed, inject, isDevMode } from '@angular/core';
import { InquiryDraftService } from '../../core/inquiry.service';
import { LanguageService } from '../../core/i18n/language.service';
import { ScrollService } from '../../core/scroll.service';
import { SAMPLE_TRIPS, TRIPS } from '../../data/trips.data';
import { Trip } from '../../models/site.models';
import { IconComponent } from '../../shared/icon.component';
import { RevealDirective } from '../../shared/reveal.directive';
import { SectionHeadingComponent } from '../../shared/section-heading.component';
import { SiteImageComponent } from '../../shared/site-image.component';

@Component({
  selector: 'app-trips',
  imports: [IconComponent, RevealDirective, SectionHeadingComponent, SiteImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.scss',
})
export class TripsComponent {
  protected readonly i18n = inject(LanguageService);
  private readonly draft = inject(InquiryDraftService);
  private readonly scroll = inject(ScrollService);

  /** Real trips always; sample trips only in development builds when no real trips exist. */
  protected readonly showingSamples = TRIPS.length === 0 && isDevMode();
  protected readonly trips: Trip[] = this.showingSamples ? SAMPLE_TRIPS : TRIPS;

  private readonly dateFormat = computed(
    () => new Intl.DateTimeFormat(this.i18n.locale(), { day: 'numeric', month: 'long', year: 'numeric' }),
  );

  protected formatDate(iso: string): string {
    return this.dateFormat().format(new Date(`${iso}T00:00:00`));
  }

  protected formatPrice(price: NonNullable<Trip['price']>): string {
    return new Intl.NumberFormat(this.i18n.locale(), {
      style: 'currency', currency: price.currency, maximumFractionDigits: 0,
    }).format(price.amount);
  }

  protected inquire(trip?: Trip): void {
    this.draft.prefill({ service: 'organized-trips', destination: trip ? this.i18n.pick(trip.destination) : undefined });
    this.scroll.toSection('contact', '#inq-name');
  }
}
