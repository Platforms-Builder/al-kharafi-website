import { RenderMode, ServerRoute } from '@angular/ssr';
import { LANGS } from './core/i18n/language.service';

const langParams = async () => LANGS.map((lang) => ({ lang }));

/**
 * Every public page is prerendered to static HTML at build time (GitHub Pages friendly
 * and fully crawlable by search engines in both languages).
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: ':lang', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: ':lang/credits', renderMode: RenderMode.Prerender, getPrerenderParams: langParams },
  { path: '**', renderMode: RenderMode.Client },
];
