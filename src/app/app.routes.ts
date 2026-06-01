import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'architectures',
    loadChildren: () =>
      import('./features/catalog/catalog.routes').then(
        (m) => m.CATALOG_ROUTES,
      ),
  },
  {
    path: 'architectures/:slug',
    loadChildren: () =>
      import('./features/pattern-detail/pattern-detail.routes').then(
        (m) => m.PATTERN_DETAIL_ROUTES,
      ),
  },
  {
    path: 'compare',
    loadChildren: () =>
      import('./features/compare/compare.routes').then(
        (m) => m.COMPARE_ROUTES,
      ),
  },
  {
    path: 'quiz',
    loadChildren: () =>
      import('./features/quiz/quiz.routes').then((m) => m.QUIZ_ROUTES),
  },
  {
    path: 'favorites',
    loadChildren: () =>
      import('./features/favorites/favorites.routes').then(
        (m) => m.FAVORITES_ROUTES,
      ),
  },
  { path: '**', redirectTo: '' },
];
