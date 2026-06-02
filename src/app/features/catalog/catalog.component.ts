import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArchitectureService } from '../../core/services/architecture.service';
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

  readonly allPatterns = this.architectureService.patterns;

  readonly searchQuery = signal('');

  readonly difficultyFilter = signal<DifficultyFilter>('All');

  readonly difficultyOptions: DifficultyFilter[] = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  readonly filteredPatterns = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const difficulty = this.difficultyFilter();

    return this.allPatterns().filter(pattern => {
      const matchesDifficulty =
        difficulty === 'All' || pattern.difficulty === difficulty;

      if (!query) return matchesDifficulty;

      const matchesSearch =
        pattern.title.toLowerCase().includes(query) ||
        pattern.tags.some(tag => tag.toLowerCase().includes(query));

      return matchesDifficulty && matchesSearch;
    });
  });

  clearFilters(): void {
    this.searchQuery.set('');
    this.difficultyFilter.set('All');
  }
}
