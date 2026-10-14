import {
  ChangeDetectionStrategy, Component, DOCUMENT, ElementRef, afterNextRender, inject, signal, viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';
import { COMPANY } from '../../data/company.data';
import { IconComponent } from '../../shared/icon.component';

export const NAV_SECTIONS = ['home', 'about', 'services', 'trips', 'gallery', 'contact'] as const;
export type NavSection = (typeof NAV_SECTIONS)[number];

@Component({
  selector: 'app-header',
  imports: [RouterLink, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  host: {
    '[class.scrolled]': 'scrolled() || menuOpen()',
    '(document:keydown.escape)': 'closeMenu(true)',
  },
})
export class HeaderComponent {
  protected readonly i18n = inject(LanguageService);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);
  protected readonly company = COMPANY;
  protected readonly sections = NAV_SECTIONS;

  protected readonly scrolled = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly active = signal<NavSection>('home');
  private readonly toggleBtn = viewChild<ElementRef<HTMLButtonElement>>('toggle');

  constructor() {
    afterNextRender(() => {
      const onScroll = () => this.scrolled.set(window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      // Highlight the nav item of the section currently in view.
      if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) if (e.isIntersecting) this.active.set(e.target.id as NavSection);
          },
          { rootMargin: '-45% 0px -50% 0px' },
        );
        const observe = () => this.sections.forEach((id) => {
          const el = this.doc.getElementById(id);
          if (el) io.observe(el);
        });
        observe();
        this.router.events.subscribe(() => queueMicrotask(observe));
      }
    });
  }

  /** Plain "#main" links would resolve against <base href> and reload the page. */
  protected skipToMain(event: Event): void {
    event.preventDefault();
    const main = this.doc.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  }

  protected label(section: NavSection): string {
    return this.i18n.t().nav[section];
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
    this.doc.body.classList.toggle('menu-open', this.menuOpen());
  }

  protected closeMenu(returnFocus = false): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.doc.body.classList.remove('menu-open');
    if (returnFocus) this.toggleBtn()?.nativeElement.focus();
  }

  /** Same page, other language — keeps the current path and section. */
  protected switchLanguage(): void {
    const target = this.i18n.otherLang();
    const tree = this.router.parseUrl(this.router.url);
    const segments = tree.root.children['primary']?.segments.map((s) => s.path) ?? [];
    segments[0] = target;
    this.closeMenu();
    void this.router.navigate(['/', ...segments], { fragment: tree.fragment ?? undefined });
  }
}
