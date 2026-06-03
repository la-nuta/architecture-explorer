import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty-state">
      <div class="empty-icon">{{ icon() }}</div>
      <h3 class="empty-title">{{ title() }}</h3>
      <p class="empty-message">{{ message() }}</p>
    </div>
  `,
  styles: [`
    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      color: #8b949e;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.4;
      line-height: 1;
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
      color: #6b7280;
      margin: 0;
      max-width: 360px;
      margin-inline: auto;
    }
  `],
})
export class EmptyStateComponent {
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly icon = input('◈');
}