import { Routes } from '@angular/router';

export const PATTERN_DETAIL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pattern-detail.component').then(m => m.PatternDetailComponent)
  }
];
