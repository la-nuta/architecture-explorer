import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { PATTERNS_DATA } from './core/tokens/patterns-data.token';
import { ARCHITECTURE_PATTERNS } from './data/architectures.data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    { provide: PATTERNS_DATA, useValue: ARCHITECTURE_PATTERNS },
  ]
};
