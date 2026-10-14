import { DOCUMENT, Injectable, computed, effect, inject, signal } from '@angular/core';
import { Lang, Localized } from '../../models/site.models';
import { ar, Translation } from './ar';
import { en } from './en';

export const LANGS: readonly Lang[] = ['ar', 'en'];
export const DEFAULT_LANG: Lang = 'ar';
const STORAGE_KEY = 'alkharafi.lang';
const DICTIONARIES: Record<Lang, Translation> = { ar, en };

export function isLang(value: unknown): value is Lang {
  return value === 'ar' || value === 'en';
}

/** Holds the active language and keeps <html lang/dir> in sync with it. */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly doc = inject(DOCUMENT);

  readonly lang = signal<Lang>(DEFAULT_LANG);
  readonly dir = computed(() => (this.lang() === 'ar' ? 'rtl' : 'ltr'));
  readonly t = computed(() => DICTIONARIES[this.lang()]);
  readonly otherLang = computed<Lang>(() => (this.lang() === 'ar' ? 'en' : 'ar'));
  /** BCP-47 locale used for dates and numbers. */
  readonly locale = computed(() => (this.lang() === 'ar' ? 'ar-EG' : 'en-GB'));

  constructor() {
    effect(() => {
      const html = this.doc.documentElement;
      html.lang = this.lang();
      html.dir = this.dir();
      try {
        localStorage.setItem(STORAGE_KEY, this.lang());
      } catch {
        /* storage unavailable — language still lives in the URL */
      }
    });
  }

  use(lang: Lang): void {
    this.lang.set(lang);
  }

  /** Pick the active-language value of a bilingual string. */
  pick(value: Localized): string {
    return value[this.lang()];
  }

  /** Language to use when the URL has none: last choice, then default (Arabic). */
  preferred(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isLang(stored)) return stored;
    } catch {
      /* ignore */
    }
    return DEFAULT_LANG;
  }
}
