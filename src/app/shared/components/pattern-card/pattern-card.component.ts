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
  templateUrl: './pattern-card.component.html',
  styleUrl: './pattern-card.component.css',
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
