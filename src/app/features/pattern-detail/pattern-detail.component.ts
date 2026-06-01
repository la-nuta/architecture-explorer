import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-pattern-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p style="color: #e2e8f0; padding: 2rem;">Pattern Detail</p>`,
})
export class PatternDetailComponent {}
