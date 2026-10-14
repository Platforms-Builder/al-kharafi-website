import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Routes } from '@angular/router';
import { isLang, LanguageService } from './core/i18n/language.service';
import { HomePage } from './pages/home.page';

/** Only /ar/... and /en/... match the localized routes. */
const langMatch: CanMatchFn = (_route, segments) => isLang(segments[0]?.path);

/** Applies the URL language — the URL is the source of truth, so the choice survives navigation and reloads. */
const applyLang: CanActivateFn = (route) => {
  const lang = route.paramMap.get('lang');
  if (isLang(lang)) inject(LanguageService).use(lang);
  return true;
};

const toPreferredLang = () => inject(LanguageService).preferred();

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: toPreferredLang },
  {
    path: ':lang',
    canMatch: [langMatch],
    canActivate: [applyLang],
    children: [
      { path: '', component: HomePage },
      { path: 'credits', loadComponent: () => import('./pages/credits.page').then((m) => m.CreditsPage) },
    ],
  },
  { path: '**', redirectTo: toPreferredLang },
];
