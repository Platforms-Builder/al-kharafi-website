# Al-Kharafi — Bilingual Tourism Website (Angular)

**شركة الخارفي للاستثمار السياحي والنقل البري والرحلات** — Arabic (default, RTL) and English (LTR) website built with Angular 22, prerendered to static HTML for GitHub Pages and search engines.

---

## 1. Run locally

Requirements: **Node.js 22.22+** (or 24.15+). With nvm: `nvm install 22 && nvm use 22` (an `.nvmrc` is included).

```bash
npm install
npm start            # dev server → http://localhost:4200/ar
npm run build        # production build → dist/al-kharafi/browser
npm run build:gh-pages   # production build + GitHub Pages extras (404, robots, sitemap, CNAME)
```

To preview the production output locally:

```bash
npm run build:gh-pages
npx http-server dist/al-kharafi/browser -p 8080   # or: python3 -m http.server -d dist/al-kharafi/browser 8080
```

> In development (`npm start`) the Trips section shows clearly labelled **sample** trips so the card design can be tested. Production builds never include them.

## 2. Where to edit content

Everything is centralised — no text is hard-coded in components.

| What | File |
|---|---|
| Company name, phones, address, Facebook, WhatsApp, logo, QR codes, form endpoint | `src/app/data/company.data.ts` |
| All interface text (Arabic / English) | `src/app/core/i18n/ar.ts`, `src/app/core/i18n/en.ts` |
| Service categories | `src/app/data/services.data.ts` |
| Published trips | `src/app/data/trips.data.ts` → `TRIPS` |
| Gallery | `src/app/data/gallery.data.ts` |
| Images, alt text and credits | `src/app/data/images.data.ts` + `public/images/` |
| Production URL, Google verification | `site.config.json` |

`en.ts` is type-checked against `ar.ts`, so a missing translation fails the build.

### Adding a trip
```ts
// src/app/data/trips.data.ts
export const TRIPS: Trip[] = [
  {
    id: 'luxor-2027-01',
    image: 'luxor-night',                       // key from images.data.ts
    destination: { ar: 'الأقصر', en: 'Luxor' },
    description: { ar: '…', en: '…' },
    date: '2027-01-15',                          // optional
    duration: { ar: 'يومان', en: '2 days' },     // optional
    price: { amount: 1500, currency: 'EGP' },    // optional → "On request"
    availability: 'available',                   // available | limited | full | on-request
  },
];
```

### Adding real photos
1. Export each photo at two widths as WebP: `name-800.webp` and `name-1600.webp` into `public/images/company/`.
2. Register it in `images.data.ts` with `src: 'images/company/name'`, real width/height, bilingual `alt`, and `illustrative: false` (no `credit`).
3. Use its key in services, trips or the gallery (`category: 'company-trips'` or `'transport'`).

### Logo
The eagle mark was extracted from the official logo (`../logo-original.jpg`) with the text removed:
- `public/brand/eagle-gold-*.webp` — gold version for the navy header/footer and the site icons.
- `public/brand/eagle-color-*.webp` / `eagle-color.png` — original colours for light backgrounds and search engines.
- `public/brand/og-image.jpg` — 1200×630 image shown when the site is shared on Facebook/WhatsApp.

The source was a 563 px JPEG. When the original vector/high-resolution logo is available, re-export these files at the same names.

### QR codes
Put the original QR images in `public/brand/` and set `qrCodes.facebook / qrCodes.location` in `company.data.ts`.

## 3. Deploy to GitHub Pages

1. Create a GitHub repository and push **the contents of this folder** to the `main` branch.
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds, prerenders and publishes the site.
   - Site address: `https://<user>.github.io/<repo>/` (the workflow sets the correct base path automatically).
4. Put the final address in `site.config.json`:
   ```json
   { "siteUrl": "https://<user>.github.io/<repo>", "googleSiteVerification": "" }
   ```
   This turns on canonical URLs, hreflang links, absolute Open Graph images, `sitemap.xml` and the robots.txt sitemap line.

### Custom domain (recommended)
Set `"siteUrl": "https://www.your-domain.com"`. The build writes the `CNAME` file automatically. Then add the domain under **Settings → Pages → Custom domain** and point DNS to GitHub Pages (a `CNAME` record for `www` → `<user>.github.io`). Enable **Enforce HTTPS**.

## 4. Search engines (SEO)

Already built in:
- Every page is **prerendered static HTML** (`/ar/`, `/en/`, `/ar/credits/`, `/en/credits/`), so crawlers see the full Arabic and English content without running JavaScript.
- Per-language `<title>`, meta description, Open Graph and Twitter tags, `lang`/`dir` attributes.
- `hreflang` alternates + canonical (when `siteUrl` is set), `sitemap.xml`, `robots.txt`.
- schema.org **TravelAgency** structured data (name, address in Sohag, all phone numbers, Facebook).
- Fast loading: self-hosted fonts, responsive WebP images, lazy loading, hydration.

What you still need to do (no website can guarantee first place in Google — ranking depends on these too):
1. **Google Search Console**: add the site, paste the verification code into `site.config.json → googleSiteVerification`, redeploy, then submit `sitemap.xml`.
2. **Google Business Profile** for the Sohag office (the biggest factor for local searches like “نقل سياحي سوهاج”). Use exactly the same name, address and phone numbers as the website.
3. Link the website from the official Facebook page and the business card QR code.
4. Add real photos, real trips and regularly updated content.
5. Bing Webmaster Tools (also feeds other search engines).

## 5. Project structure

```
src/app/
├── core/            language service + translations, SEO, inquiry service, scrolling, image loader
├── data/            company info, services, trips, gallery, image registry (single source of truth)
├── layout/          header (sticky, mobile menu, language switch), footer
├── sections/        hero, about, services, trips, why-us, gallery (+ lightbox), contact (+ inquiry form)
├── pages/           home page, image-credits page
├── shared/          icon, section heading, site image, scroll-reveal directive
└── models/          shared TypeScript types
scripts/postbuild.mjs   GitHub Pages extras (404.html, root redirect, robots, sitemap, CNAME, .nojekyll)
```

Routing: `/ar/…` and `/en/…`. The URL is the source of truth for the language, so it is kept during navigation and on reload; the last choice is also remembered for visits to `/`.

## 6. Missing production data

| Item | Status |
|---|---|
| Official logo | Eagle extracted from the supplied 563 px JPEG — a vector/high-resolution original is still preferred |
| Overseas employment licence number (Ministry of Labour) | **Missing** — set `recruitmentLicense` in `company.data.ts` to show it on the service card |
| Original QR code images (Facebook, location) | **Missing** — not recreated by design |
| Confirmed English brand spelling | Brief says **Al-Kharafi**; the business card says **Al-Kharfi** — please confirm |
| Confirmed English address | Card mentions “Al Mustafa Tower”, which is not in the supplied address — please confirm |
| Official Facebook **page** URL | Currently a post link (supplied); a page/profile URL is better |
| Exact map location | Currently an address search link; replace `mapUrl` with the pin from the “location” QR |
| Confirmed list of services and descriptions | Current five categories are marked as provisional on the site |
| Real trips (destinations, dates, durations, prices, availability) | None published → section shows “ask about upcoming trips” |
| Real photos of company coaches and trips | Site uses credited, clearly labelled illustrative photos |
| Website domain / final URL | Needed for canonical, sitemap and Open Graph |
| Email address, working hours | Not supplied — not shown |

## 7. Integrations still required

- **Inquiry form delivery.** GitHub Pages has no backend, so the form currently hands the enquiry to **WhatsApp**: after validation it opens `wa.me/201029274903` (01029274903, confirmed by the company) with a pre-filled message, and the visitor presses Send in WhatsApp. A floating WhatsApp button is shown on every page. To receive enquiries automatically instead (e.g. by email or into a sheet), set `inquiryEndpoint` in `company.data.ts` — it takes priority over WhatsApp. With neither configured, the form tells the visitor that nothing was sent and offers the phone numbers. Set it to any endpoint that accepts a JSON `POST` (e.g. Formspree, Web3Forms, Getform, or a Google Apps Script web app that writes to a Google Sheet). Payload:
  ```json
  { "fullName": "", "phone": "", "service": "group-transport", "destination": "",
    "travelers": 1, "preferredDate": "2027-01-15", "message": "", "lang": "ar" }
  ```
  Add spam protection (honeypot/captcha) supported by the chosen service.
- **Analytics** (optional): Google Analytics or a privacy-friendly alternative, with a consent notice if required.

## 8. Image credits

Illustrative photos come from Wikimedia Commons under CC BY / CC BY-SA licences. Each one is labelled “Illustrative photo” on the site, attributed in the lightbox, and listed on the `/credits` page. They do **not** show Al-Kharafi vehicles or trips; replace them with the company's own photos when available.
