import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-rating-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rating-bar" [title]="value()">
      @for (filled of dots(); track $index) {
        <span class="dot" [class.dot--filled]="filled"></span>
      }
    </div>
  `,
  styles: [`
    .rating-bar {
      display: inline-flex;
      gap: 4px;
      align-items: center;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.12);
      flex-shrink: 0;
    }
    .dot--filled {
      background: #7c3aed;
    }
  `],
})
export class RatingBarComponent {
  readonly value = input.required<string>();

  readonly dots = computed(() => {
    const filled = this.filledCount(this.value());
    return Array.from({ length: 5 }, (_, i) => i < filled);
  });

  private filledCount(value: string): number {
    switch (value) {
      case 'Low':
      case 'Small':
        return 1;
      case 'Medium':
        return 3;
      case 'High':
      case 'Large':
        return 5;
      default:
        return 0;
    }
  }
}