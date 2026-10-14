// Post-build step for static hosting (GitHub Pages).
// Usage: node scripts/postbuild.mjs   (after `ng build`)
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const out = join(root, 'dist/al-kharafi/browser');
const site = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
const siteUrl = (site.siteUrl || '').replace(/\/$/, '');
const langs = ['ar', 'en'];
const pages = ['', 'credits/'];

if (!existsSync(join(out, 'index.csr.html'))) {
  console.error('Build output not found. Run `ng build` first.');
  process.exit(1);
}

// 1. Unknown URLs → client app (its router redirects to the visitor's language).
copyFileSync(join(out, 'index.csr.html'), join(out, '404.html'));

// 2. Root page: relative redirect (works on a custom domain and on /<repo>/ project sites),
//    honours a previously chosen language, and is crawlable via hreflang links.
const alt = siteUrl
  ? langs.map((l) => `  <link rel="alternate" hreflang="${l}" href="${siteUrl}/${l}/">`).join('\n') +
    `\n  <link rel="alternate" hreflang="x-default" href="${siteUrl}/ar/">\n  <link rel="canonical" href="${siteUrl}/ar/">`
  : '';
writeFileSync(join(out, 'index.html'), `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>الخارفي | Al-Kharafi</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="شركة الخارفي للاستثمار السياحي والنقل البري والرحلات – سوهاج. Al-Kharafi — Tourism Investment, Land Transport &amp; Trips, Sohag, Egypt. Overseas employment services.">
${alt}
  <script>try{if(localStorage.getItem('alkharafi.lang')==='en'){location.replace('en/'+location.hash);}}catch(e){}</script>
  <meta http-equiv="refresh" content="0; url=ar/">
</head>
<body>
  <p><a href="ar/">العربية</a> · <a href="en/">English</a></p>
</body>
</html>
`);

// 3. Disable Jekyll processing on GitHub Pages.
writeFileSync(join(out, '.nojekyll'), '');

// 4. robots.txt + sitemap.xml (sitemap needs the production URL).
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`);
if (siteUrl) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.flatMap((p) => langs.map((l) => `  <url>
    <loc>${siteUrl}/${l}/${p}</loc>
${langs.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${siteUrl}/${a}/${p}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/ar/${p}"/>
    <lastmod>${today}</lastmod>
    <priority>${p ? '0.3' : '1.0'}</priority>
  </url>`));
  writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`);
} else {
  console.warn('⚠ site.config.json → siteUrl is empty: canonical URLs and sitemap.xml were skipped.');
}

// 5. Custom domain for GitHub Pages.
if (siteUrl && !/\.github\.io$/.test(new URL(siteUrl).hostname)) {
  writeFileSync(join(out, 'CNAME'), new URL(siteUrl).hostname + '\n');
}

console.log('✔ GitHub Pages post-build complete:', out);
