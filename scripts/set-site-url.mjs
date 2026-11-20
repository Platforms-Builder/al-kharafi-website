// Pre-build step: decides the production URL written to site.config.json
// (used at compile time for canonical/hreflang/Open Graph, and by postbuild for sitemap.xml).
// Priority: env SITE_URL → existing siteUrl in site.config.json → env PAGES_URL (GitHub Pages URL).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const file = fileURLToPath(new URL('../site.config.json', import.meta.url));
const cfg = JSON.parse(readFileSync(file, 'utf8'));
const url = process.env.SITE_URL || cfg.siteUrl || process.env.PAGES_URL || '';
cfg.siteUrl = url.replace(/\/$/, '');
writeFileSync(file, JSON.stringify(cfg, null, 2) + '\n');
console.log('siteUrl =', cfg.siteUrl || '(empty)');
