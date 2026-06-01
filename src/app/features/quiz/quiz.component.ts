import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-quiz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<p style="color: #e2e8f0; padding: 2rem;">Quiz</p>`,
})
export class QuizComponent {}
