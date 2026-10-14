import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { IconName } from '../models/site.models';

/** Stroke icons (24×24 grid). Decorative by default: give the parent an accessible name. */
const PATHS: Record<IconName, string> = {
  bus: 'M4 17V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v11M4 17h16M4 17v2m16-2v2M4 10h16M8 14h.01M16 14h.01M9 6h6',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm3.5-12.5-2 5-5 2 2-5 5-2Z',
  route: 'M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM8 17h7.5a3.5 3.5 0 0 0 0-7h-7a3.5 3.5 0 0 1 0-7H16',
  users: 'M16 20v-1.5A3.5 3.5 0 0 0 12.5 15h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm10 9v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.15a3.5 3.5 0 0 1 0 6.7',
  chat: 'M20 12a8 8 0 0 1-11.6 7.14L4 20l.9-4.2A8 8 0 1 1 20 12ZM8.5 12h.01M12 12h.01M15.5 12h.01',
  phone: 'M21 16.9v2.6a2 2 0 0 1-2.2 2A18.8 18.8 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h2.6a2 2 0 0 1 2 1.7c.12.9.34 1.8.66 2.65a2 2 0 0 1-.45 2.1L8.2 10.56a16 16 0 0 0 5.24 5.24l1.1-1.1a2 2 0 0 1 2.1-.45c.85.32 1.74.54 2.65.66A2 2 0 0 1 21 16.9Z',
  pin: 'M12 21s-7-5.6-7-11.5a7 7 0 0 1 14 0C19 15.4 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  facebook: 'M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v3.5H8V21h3.5v-7.5H14l.6-3.5h-3.1V7.8c0-.8.5-1.3 1.3-1.3H15V3Z',
  whatsapp: 'M3 21l1.65-4.5A9 9 0 1 1 7.6 19.6L3 21Zm6-12.6c-.3 2.9 3 6.4 6.2 6.2l1.1-1.3a.6.6 0 0 0-.1-.8l-1.5-1a.6.6 0 0 0-.7 0l-.7.5a4 4 0 0 1-2.2-2.2l.5-.7a.6.6 0 0 0 0-.7l-1-1.5a.6.6 0 0 0-.8-.1L9 8.4Z',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  calendar: 'M4 8h16M8 3v3m8-3v3M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 1.8',
  tag: 'M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Zm5-4h.01',
  check: 'M5 12.5 10 17l9-10',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z',
  headset: 'M4 15v-3a8 8 0 0 1 16 0v3M4 15a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Zm-3 2v1a3 3 0 0 1-3 3h-2',
  seat: 'M7 4h6a2 2 0 0 1 2 2v7H7V4Zm-2 9h14v3H5v-3Zm2 3v4m10-4v4M15 9h3',
  map: 'm9 4-5 2v14l5-2 6 2 5-2V4l-5 2-6-2Zm0 0v14m6-12v14',
  briefcase: 'M4 8h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Zm5 0V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3M3 13h18',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  'chevron-left': 'm15 5-7 7 7 7',
  'chevron-right': 'm9 5 7 7-7 7',
  expand: 'M15 4h5v5M9 20H4v-5M20 4l-6 6M4 20l6-6',
  copy: 'M9 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1Zm-4 6H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-5v-5m0-3h.01',
};

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg viewBox="0 0 24 24" [attr.width]="size()" [attr.height]="size()" fill="none" stroke="currentColor"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"
      [class.flip]="flip()">
      <path [attr.d]="d()" />
    </svg>
  `,
  styles: `
    :host { display: inline-flex; line-height: 0; flex-shrink: 0; }
    :host-context([dir='rtl']) .flip { transform: scaleX(-1); }
  `,
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  /** Mirror directional icons in RTL. */
  readonly flip = input(false);
  protected readonly d = computed(() => PATHS[this.name()]);
}
