import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p style="color: #e2e8f0; padding: 2rem;">Favorites</p>`,
})
export class FavoritesComponent {}
