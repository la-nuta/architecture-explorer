import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArchitectureService } from '../../core/services/architecture.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { PatternCardComponent } from '../../shared/components/pattern-card/pattern-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, PatternCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly architectureService = inject(ArchitectureService);
  protected readonly favoritesService = inject(FavoritesService);

  readonly featured = this.architectureService.featured;

  readonly stats = computed(() => [
    { value: String(this.architectureService.patterns().length), label: 'Patterns' },
    { value: '3', label: 'Difficulty Levels' },
    { value: '5', label: 'Comparison Metrics' },
  ]);
}
