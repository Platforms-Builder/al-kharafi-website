import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.light]': 'tone() === "light"', '[class.center]': 'align() === "center"' },
  template: `
    <p class="eyebrow">{{ eyebrow() }}</p>
    <h2 [id]="headingId()">{{ title() }}</h2>
    @if (intro()) {
      <p class="intro">{{ intro() }}</p>
    }
  `,
  styles: `
    :host { display: block; max-width: 46rem; margin-block-end: clamp(2rem, 4vw, 3rem); }
    :host(.center) { margin-inline: auto; text-align: center; }
    .eyebrow {
      display: inline-flex; align-items: center; gap: .75rem; margin: 0 0 .75rem;
      color: var(--gold-ink); font-weight: 700; font-size: .875rem; letter-spacing: .08em; text-transform: uppercase;
    }
    .eyebrow::before { content: ''; width: 2.5rem; height: 1px; background: currentColor; }
    :host(.center) .eyebrow::after { content: ''; width: 2.5rem; height: 1px; background: currentColor; }
    h2 { margin: 0; font-family: var(--font-display); font-size: clamp(1.9rem, 3.6vw, 2.75rem); line-height: 1.2; color: var(--navy); }
    .intro { margin: 1rem 0 0; color: var(--text-muted); font-size: 1.075rem; line-height: 1.85; }
    :host(.light) .eyebrow { color: var(--gold); }
    :host(.light) h2 { color: #fff; }
    :host(.light) .intro { color: rgb(255 255 255 / .78); }
  `,
})
export class SectionHeadingComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly intro = input<string>();
  readonly headingId = input<string>();
  readonly tone = input<'dark' | 'light'>('dark');
  readonly align = input<'start' | 'center'>('start');
}
