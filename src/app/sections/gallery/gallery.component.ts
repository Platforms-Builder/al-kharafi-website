import {
  ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal, viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { LanguageService } from '../../core/i18n/language.service';
import { GALLERY } from '../../data/gallery.data';
import { IMAGES } from '../../data/images.data';
import { GalleryCategory, SiteImage } from '../../models/site.models';
import { IconComponent } from '../../shared/icon.component';
import { SectionHeadingComponent } from '../../shared/section-heading.component';
import { SiteImageComponent } from '../../shared/site-image.component';

type Filter = 'all' | GalleryCategory;

@Component({
  selector: 'app-gallery',
  imports: [NgOptimizedImage, IconComponent, SectionHeadingComponent, SiteImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  protected readonly i18n = inject(LanguageService);
  /** Only categories that have photos are offered (e.g. 'company-trips' appears once such photos are added). */
  protected readonly filters: Filter[] = (['all', 'transport', 'destinations', 'company-trips'] as Filter[]).filter(
    (f) => f === 'all' || GALLERY.some((g) => g.category === f),
  );
  protected readonly filter = signal<Filter>('all');
  protected readonly items = computed(() =>
    GALLERY.filter((g) => this.filter() === 'all' || g.category === this.filter()),
  );

  protected readonly openIndex = signal<number | null>(null);
  protected readonly current = computed(() => {
    const i = this.openIndex();
    return i === null ? null : this.image(this.items()[i].image);
  });
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private opener: HTMLElement | null = null;

  protected image(key: string): SiteImage {
    return (IMAGES as Record<string, SiteImage>)[key];
  }

  protected open(index: number, event: Event): void {
    this.opener = event.currentTarget as HTMLElement;
    this.openIndex.set(index);
    this.dialog().nativeElement.showModal();
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  protected onClosed(): void {
    this.openIndex.set(null);
    this.opener?.focus();
  }

  /** step is visual: +1 = next. Arrow keys follow reading direction. */
  protected move(step: number): void {
    const n = this.items().length;
    this.openIndex.update((i) => (i === null ? null : (i + step + n) % n));
  }

  protected onKey(event: KeyboardEvent): void {
    const rtl = this.i18n.dir() === 'rtl';
    if (event.key === 'ArrowRight') this.move(rtl ? -1 : 1);
    if (event.key === 'ArrowLeft') this.move(rtl ? 1 : -1);
  }

  /** Click on the backdrop (the dialog element itself) closes it. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }
}
