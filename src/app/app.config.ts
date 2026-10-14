import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideEnvironmentInitializer,
  inject,
} from '@angular/core';
import { IMAGE_LOADER, ViewportScroller } from '@angular/common';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { siteImageLoader } from './core/image-loader';
import { HEADER_OFFSET } from './core/scroll.service';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Fragment links scroll to sections; position is otherwise kept (e.g. when switching language).
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'disabled' }),
    ),
    provideHttpClient(withFetch()),
    { provide: IMAGE_LOADER, useValue: siteImageLoader },
    provideEnvironmentInitializer(() => inject(ViewportScroller).setOffset([0, HEADER_OFFSET])),
    provideClientHydration(withEventReplay()),
  ],
};
