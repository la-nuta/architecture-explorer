import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ArchitectureService } from '../../core/services/architecture.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { SearchFilterService } from '../../core/services/search-filter.service';
import { PatternCardComponent } from '../../shared/components/pattern-card/pattern-card.component';

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, PatternCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
})
export class CatalogComponent {
  private readonly architectureService = inject(ArchitectureService);
  protected readonly favoritesService = inject(FavoritesService);
  private readonly searchFilterService = inject(SearchFilterService);

  readonly allPatterns = this.architectureService.patterns;

  readonly searchQuery = signal('');

  readonly difficultyFilter = signal<DifficultyFilter>('All');
  readonly difficultyOptions: DifficultyFilter[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  readonly tagFilter = signal<string>('All');

  readonly availableTags = computed<string[]>(() => {
    const tags = new Set<string>();
    for (const pattern of this.allPatterns()) {
      for (const tag of pattern.tags) {
        tags.add(tag);
      }
    }
    return ['All', ...Array.from(tags).sort()];
  });

  readonly filteredPatterns = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const difficulty = this.difficultyFilter();
    const tag = this.tagFilter();

    return this.allPatterns().filter(pattern => {
      const matchesDifficulty =
        difficulty === 'All' || pattern.difficulty === difficulty;

      const matchesTag =
        tag === 'All' || pattern.tags.includes(tag);

      if (!query) return matchesDifficulty && matchesTag;

      const matchesSearch =
        pattern.title.toLowerCase().includes(query) ||
        pattern.tags.some(t => t.toLowerCase().includes(query));

      return matchesDifficulty && matchesTag && matchesSearch;
    });
  });

  constructor() {
    this.searchFilterService.debouncedQuery$
      .pipe(takeUntilDestroyed())
      .subscribe(q => this.searchQuery.set(q));
  }

  onSearchInput(event: Event): void {
    this.searchFilterService.setQuery((event.target as HTMLInputElement).value);
  }

  clearFilters(): void {
    this.searchQuery.set('');          // immediate visual reset
    this.searchFilterService.setQuery('');
    this.difficultyFilter.set('All');
    this.tagFilter.set('All');
  }
}
