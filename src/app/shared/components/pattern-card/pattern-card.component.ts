import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArchitecturePattern } from '../../../core/models/architecture-pattern.model';

@Component({
  selector: 'app-pattern-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" [class.card--favorite]="isFavorite()">
      <a
        [routerLink]="['/architectures', pattern().slug]"
        class="card-body card-link"
      >
        <div class="card-header">
          <h3 class="card-title">{{ pattern().title }}</h3>
          <span
            class="difficulty-badge"
            [style.background]="difficultyBg(pattern().difficulty)"
            [style.color]="difficultyColor(pattern().difficulty)"
          >
            {{ pattern().difficulty }}
          </span>
        </div>

        <p class="card-description">{{ pattern().shortDescription }}</p>

        <div class="tags">
          @for (tag of pattern().tags.slice(0, 3); track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>
      </a>

      <div class="card-footer">
        <button
          class="favorite-btn"
          [class.favorite-btn--active]="isFavorite()"
          (click)="onFavoriteToggle($event)"
          type="button"
        >
          {{ isFavorite() ? '♥' : '♡' }} Favorite
        </button>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 0.5rem;
      display: flex;
      flex-direction: column;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      overflow: hidden;
    }

    .card:hover {
      border-color: #7c3aed;
      box-shadow: 0 4px 20px rgba(124, 58, 237, 0.15);
    }

    .card--favorite {
      border-color: rgba(124, 58, 237, 0.5);
    }

    .card-body {
      padding: 1.25rem;
      flex: 1;
      cursor: pointer;
    }

    .card-link {
      text-decoration: none;
      display: block;
    }

    .card-body:hover .card-title {
      color: #7c3aed;
    }

    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: #e2e8f0;
      margin: 0;
      transition: color 0.15s ease;
      font-family: 'Inter', -apple-system, sans-serif;
      line-height: 1.4;
    }

    .difficulty-badge {
      font-size: 0.6875rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 9999px;
      white-space: nowrap;
      flex-shrink: 0;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .card-description {
      font-size: 0.8125rem;
      color: #8b949e;
      line-height: 1.6;
      margin: 0 0 1rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .tag {
      font-size: 0.6875rem;
      font-weight: 500;
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      padding: 0.15rem 0.5rem;
      border-radius: 0.25rem;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
    }

    .card-footer {
      padding: 0.75rem 1.25rem;
      border-top: 1px solid #21262d;
    }

    .favorite-btn {
      background: transparent;
      border: 1px solid #30363d;
      color: #8b949e;
      font-size: 0.8125rem;
      font-weight: 500;
      padding: 0.375rem 0.75rem;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
      font-family: 'Inter', -apple-system, sans-serif;
    }

    .favorite-btn:hover {
      color: #e2e8f0;
      border-color: #7c3aed;
      background: rgba(124, 58, 237, 0.1);
    }

    .favorite-btn--active {
      color: #7c3aed;
      border-color: #7c3aed;
      background: rgba(124, 58, 237, 0.1);
    }

    .favorite-btn--active:hover {
      color: #a78bfa;
      border-color: #a78bfa;
      background: rgba(167, 139, 250, 0.15);
    }
  `],
})
export class PatternCardComponent {
  readonly pattern = input.required<ArchitecturePattern>();
  readonly isFavorite = input(false);
  readonly favoriteToggle = output<string>();

  difficultyBg(difficulty: ArchitecturePattern['difficulty']): string {
    switch (difficulty) {
      case 'Beginner':     return 'rgba(34, 197, 94, 0.15)';
      case 'Intermediate': return 'rgba(234, 179, 8, 0.15)';
      case 'Advanced':     return 'rgba(239, 68, 68, 0.15)';
    }
  }

  difficultyColor(difficulty: ArchitecturePattern['difficulty']): string {
    switch (difficulty) {
      case 'Beginner':     return '#22c55e';
      case 'Intermediate': return '#eab308';
      case 'Advanced':     return '#ef4444';
    }
  }

  onFavoriteToggle(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoriteToggle.emit(this.pattern().id);
  }
}
