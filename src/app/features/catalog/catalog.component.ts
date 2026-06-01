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
  template: `
    <div class="catalog-root">
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">Architecture Patterns</h1>
          <p class="page-subtitle">
            {{ allPatterns().length }} patterns available
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <div class="filters-container">
          <!-- Search -->
          <div class="search-wrapper">
            <span class="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search patterns..."
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              class="search-input"
            />
          </div>

          <!-- Difficulty Filter -->
          <select
            [ngModel]="difficultyFilter()"
            (ngModelChange)="difficultyFilter.set($event)"
            class="select-filter"
          >
            @for (opt of difficultyOptions; track opt) {
              <option [value]="opt">{{ opt }}</option>
            }
          </select>

          <!-- Result count -->
          @if (searchQuery() || difficultyFilter() !== 'All') {
            @let count = filteredPatterns().length;
            <span class="result-count">
              {{ count }} result{{ count === 1 ? '' : 's' }}
            </span>
          }
        </div>
      </div>

      <!-- Pattern Grid -->
      <div class="patterns-area">
        @if (filteredPatterns().length > 0) {
          <div class="patterns-grid">
            @for (pattern of filteredPatterns(); track pattern.id) {
              <app-pattern-card [pattern]="pattern" [isFavorite]="false" />
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div class="empty-state">
            <div class="empty-icon">⊘</div>
            <h3 class="empty-title">No patterns match your search</h3>
            <p class="empty-message">
              Try adjusting your search terms or difficulty filter.
            </p>
            <button
              type="button"
              (click)="clearFilters()"
              class="clear-btn"
            >
              Clear filters
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .catalog-root {
      min-height: 100vh;
      background: #0d1117;
    }

    /* Page Header */
    .page-header {
      background: #161b22;
      border-bottom: 1px solid #21262d;
      padding: 2rem;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: #e2e8f0;
      margin: 0 0 0.375rem 0;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    .page-subtitle {
      font-size: 0.875rem;
      color: #8b949e;
      margin: 0;
    }

    /* Filters */
    .filters-bar {
      background: #161b22;
      border-bottom: 1px solid #21262d;
      padding: 1rem 2rem;
      position: sticky;
      top: 3rem;
      z-index: 50;
    }

    .filters-container {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    /* Search */
    .search-wrapper {
      flex: 1;
      min-width: 200px;
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #4b5563;
      font-size: 0.875rem;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      background: #0d1117;
      border: 1px solid #30363d;
      color: #e2e8f0;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem 0.5rem 2rem;
      border-radius: 0.375rem;
      outline: none;
      transition: border-color 0.15s ease;
      font-family: 'Inter', -apple-system, sans-serif;
      box-sizing: border-box;
    }

    .search-input:focus {
      border-color: #7c3aed;
    }

    .search-input::placeholder {
      color: #4b5563;
    }

    /* Select */
    .select-filter {
      background: #0d1117;
      border: 1px solid #30363d;
      color: #e2e8f0;
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.375rem;
      outline: none;
      cursor: pointer;
      font-family: 'Inter', -apple-system, sans-serif;
      min-width: 160px;
    }

    .select-filter:focus {
      border-color: #7c3aed;
    }

    /* Result count */
    .result-count {
      font-size: 0.8125rem;
      color: #8b949e;
      white-space: nowrap;
    }

    /* Pattern Grid */
    .patterns-area {
      max-width: 1100px;
      margin: 0 auto;
      padding: 2rem;
    }

    .patterns-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      color: #8b949e;
    }

    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.4;
    }

    .empty-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0 0 0.5rem 0;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    .empty-message {
      font-size: 0.875rem;
      margin: 0 0 1.5rem 0;
      color: #6b7280;
    }

    .clear-btn {
      background: transparent;
      border: 1px solid #30363d;
      color: #8b949e;
      font-size: 0.875rem;
      padding: 0.5rem 1.25rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: border-color 0.15s, color 0.15s;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    .clear-btn:hover {
      border-color: #7c3aed;
      color: #e2e8f0;
    }
  `],
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
