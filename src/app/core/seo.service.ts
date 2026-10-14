import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { COMPANY } from '../data/company.data';
import SITE from '../../../site.config.json';
import { Lang } from '../models/site.models';
import { LanguageService, LANGS } from './i18n/language.service';

export type SeoPage = 'home' | 'credits';

/** Bilingual titles, descriptions, Open Graph tags, canonical and hreflang links. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly language = inject(LanguageService);

  apply(page: SeoPage): void {
    const t = this.language.t();
    const lang = this.language.lang();
    const pageTitle = page === 'home' ? t.meta.homeTitle : t.meta.creditsTitle;
    const description = page === 'home' ? t.meta.homeDescription : t.meta.creditsDescription;
    const path = (l: Lang) => (page === 'home' ? `/${l}/` : `/${l}/credits/`);
    const url = this.absolute(path(lang));
    const image = this.absolute('brand/og-image.jpg');

    this.title.setTitle(pageTitle);
    this.setName('description', description);
    this.setProperty('og:type', 'website');
    this.setProperty('og:site_name', this.language.pick(COMPANY.name));
    this.setProperty('og:title', pageTitle);
    this.setProperty('og:description', description);
    this.setProperty('og:locale', t.meta.ogLocale);
    this.setProperty('og:locale:alternate', lang === 'ar' ? 'en_US' : 'ar_EG');
    this.setProperty('og:image', image);
    this.setProperty('og:image:width', '1200');
    this.setProperty('og:image:height', '630');
    this.setProperty('og:image:alt', this.language.pick(COMPANY.name));
    this.setProperty('og:url', url);
    this.setName('twitter:card', 'summary_large_image');
    this.setName('twitter:title', pageTitle);
    this.setName('twitter:description', description);
    this.setName('twitter:image', image);

    if (SITE.googleSiteVerification) this.setName('google-site-verification', SITE.googleSiteVerification);
    this.setStructuredData();

    if (SITE.siteUrl) {
      this.setLink('canonical', url);
      for (const l of LANGS) this.setLink('alternate', this.absolute(path(l)), l);
      this.setLink('alternate', this.absolute(path('ar')), 'x-default');
    }
  }

  private absolute(path: string): string {
    const clean = '/' + path.replace(/^\//, '');
    return SITE.siteUrl ? SITE.siteUrl.replace(/\/$/, '') + clean : clean;
  }

  /** schema.org TravelAgency data built only from verified company information. */
  private setStructuredData(): void {
    const data = {
      '@context': 'https://schema.org',
      '@type': 'TravelAgency',
      name: COMPANY.name.ar,
      alternateName: [COMPANY.name.en, `${COMPANY.name.en} — ${COMPANY.tagline.en}`],
      description: this.language.t().meta.homeDescription,
      ...(SITE.siteUrl
        ? { url: SITE.siteUrl, logo: this.absolute(COMPANY.logo.png), image: this.absolute('brand/og-image.jpg') }
        : {}),
      telephone: COMPANY.phones.map((p) => p.e164),
      address: {
        '@type': 'PostalAddress',
        streetAddress:
          this.language.lang() === 'ar'
            ? COMPANY.address.ar.replace(/^سوهاج،\s*/, '')
            : COMPANY.address.en.replace(/,\s*Sohag, Egypt\.?$/, ''),
        addressLocality: this.language.lang() === 'ar' ? 'سوهاج' : 'Sohag',
        addressRegion: this.language.lang() === 'ar' ? 'محافظة سوهاج' : 'Sohag Governorate',
        addressCountry: 'EG',
      },
      areaServed: 'EG',
      hasMap: COMPANY.mapUrl,
      sameAs: [COMPANY.facebookUrl],
      inLanguage: this.language.lang(),
    };
    let script = this.doc.head.querySelector<HTMLScriptElement>('script#ld-company');
    if (!script) {
      script = this.doc.createElement('script');
      script.id = 'ld-company';
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  private setName(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private setProperty(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
    let link = this.doc.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = rel;
      if (hreflang) link.hreflang = hreflang;
      this.doc.head.appendChild(link);
    }
    link.href = href;
  }
}
