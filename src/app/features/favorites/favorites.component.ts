import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { ArchitectureService } from '../../core/services/architecture.service';
import { PatternCardComponent } from '../../shared/components/pattern-card/pattern-card.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [RouterLink, PatternCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  private readonly favoritesService = inject(FavoritesService);
  private readonly architectureService = inject(ArchitectureService);

  readonly favoritePatterns = computed(() =>
    this.architectureService.patterns().filter(p =>
      this.favoritesService.isFavorite(p.id)
    )
  );

  onFavoriteToggle(id: string): void {
    this.favoritesService.toggle(id);
  }
}