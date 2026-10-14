import { DOCUMENT, Injectable, inject } from '@angular/core';
import { ViewportScroller } from '@angular/common';

export const HEADER_OFFSET = 84;

@Injectable({ providedIn: 'root' })
export class ScrollService {
  private readonly doc = inject(DOCUMENT);
  private readonly scroller = inject(ViewportScroller);

  /** Scrolls to a section and optionally moves keyboard focus to an element inside it. */
  toSection(id: string, focusSelector?: string): void {
    // Wait one task so any state change that triggered this has been rendered.
    setTimeout(() => {
      this.scroller.scrollToAnchor(id);
      if (focusSelector) this.doc.querySelector<HTMLElement>(focusSelector)?.focus({ preventScroll: true });
    });
  }
}
