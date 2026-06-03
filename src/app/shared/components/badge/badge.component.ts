import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="badge"
      [style.background]="bg()"
      [style.color]="color()"
    >{{ text() }}</span>
  `,
  styles: [`
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      font-family: 'JetBrains Mono', 'Fira Code', monospace;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }
  `],
})
export class BadgeComponent {
  readonly text = input.required<string>();

  readonly bg = computed(() => {
    switch (this.text()) {
      case 'Beginner':     return 'rgba(34, 197, 94, 0.15)';
      case 'Intermediate': return 'rgba(234, 179, 8, 0.15)';
      case 'Advanced':     return 'rgba(239, 68, 68, 0.15)';
      default:             return 'rgba(148, 163, 184, 0.12)';
    }
  });

  readonly color = computed(() => {
    switch (this.text()) {
      case 'Beginner':     return '#22c55e';
      case 'Intermediate': return '#eab308';
      case 'Advanced':     return '#ef4444';
      default:             return '#94a3b8';
    }
  });
}