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

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, PatternCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="min-height: 100vh; background: #0d1117;">
      <!-- Page Header -->
      <div style="
        background: #161b22;
        border-bottom: 1px solid #21262d;
        padding: 2rem;
      ">
        <div style="max-width: 1100px; margin: 0 auto;">
          <h1 style="
            font-size: 1.75rem;
            font-weight: 700;
            color: #e2e8f0;
            margin: 0 0 0.375rem 0;
            font-family: 'Inter', -apple-system, sans-serif;
          ">Architecture Patterns</h1>
          <p style="font-size: 0.875rem; color: #8b949e; margin: 0;">
            {{ allPatterns().length }} patterns available
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div style="
        background: #161b22;
        border-bottom: 1px solid #21262d;
        padding: 1rem 2rem;
        position: sticky;
        top: 3rem;
        z-index: 50;
      ">
        <div style="
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        ">
          <!-- Search -->
          <div style="flex: 1; min-width: 200px; position: relative;">
            <span style="
              position: absolute;
              left: 0.75rem;
              top: 50%;
              transform: translateY(-50%);
              color: #4b5563;
              font-size: 0.875rem;
              pointer-events: none;
            ">⌕</span>
            <input
              type="text"
              placeholder="Search patterns..."
              [ngModel]="searchQuery()"
              (ngModelChange)="searchQuery.set($event)"
              style="
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
              "
              class="search-input"
            />
          </div>

          <!-- Difficulty Filter -->
          <select
            [ngModel]="difficultyFilter()"
            (ngModelChange)="difficultyFilter.set($event)"
            style="
              background: #0d1117;
              border: 1px solid #30363d;
              color: #e2e8f0;
              font-size: 0.875rem;
              padding: 0.5rem 2rem 0.5rem 0.75rem;
              border-radius: 0.375rem;
              outline: none;
              cursor: pointer;
              appearance: none;
              -webkit-appearance: none;
              font-family: 'Inter', -apple-system, sans-serif;
              min-width: 160px;
              background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b949e' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
              background-repeat: no-repeat;
              background-position: right 0.75rem center;
            "
            class="select-filter"
          >
            @for (opt of difficultyOptions; track opt) {
              <option [value]="opt">{{ opt }}</option>
            }
          </select>

          <!-- Result count -->
          @if (searchQuery() || difficultyFilter() !== 'All') {
            <span style="font-size: 0.8125rem; color: #8b949e; white-space: nowrap;">
              {{ filteredPatterns().length }} result{{ filteredPatterns().length === 1 ? '' : 's' }}
            </span>
          }
        </div>
      </div>

      <!-- Pattern Grid -->
      <div style="max-width: 1100px; margin: 0 auto; padding: 2rem;">
        @if (filteredPatterns().length > 0) {
          <div style="
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.25rem;
          ">
            @for (pattern of filteredPatterns(); track pattern.id) {
              <app-pattern-card [pattern]="pattern" />
            }
          </div>
        } @else {
          <!-- Empty State -->
          <div style="
            text-align: center;
            padding: 5rem 2rem;
            color: #8b949e;
          ">
            <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.4;">⊘</div>
            <h3 style="
              font-size: 1.125rem;
              font-weight: 600;
              color: #e2e8f0;
              margin: 0 0 0.5rem 0;
              font-family: 'Inter', -apple-system, sans-serif;
            ">No patterns match your search</h3>
            <p style="font-size: 0.875rem; margin: 0 0 1.5rem 0; color: #6b7280;">
              Try adjusting your search terms or difficulty filter.
            </p>
            <button
              type="button"
              (click)="clearFilters()"
              style="
                background: transparent;
                border: 1px solid #30363d;
                color: #8b949e;
                font-size: 0.875rem;
                padding: 0.5rem 1.25rem;
                border-radius: 0.375rem;
                cursor: pointer;
                transition: border-color 0.15s, color 0.15s;
                font-family: 'Inter', -apple-system, sans-serif;
              "
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
    .search-input:focus {
      border-color: #7c3aed !important;
    }

    .search-input::placeholder {
      color: #4b5563;
    }

    .select-filter:focus {
      border-color: #7c3aed !important;
    }

    .clear-btn:hover {
      border-color: #7c3aed !important;
      color: #e2e8f0 !important;
    }
  `],
})
export class CatalogComponent {
  private readonly architectureService = inject(ArchitectureService);

  readonly allPatterns = this.architectureService.patterns;

  readonly searchQuery = signal('');
  readonly difficultyFilter = signal<string>('All');

  readonly difficultyOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];

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
