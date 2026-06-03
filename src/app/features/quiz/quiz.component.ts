import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { QUIZ_QUESTIONS } from '../../data/quiz.data';
import { QuizQuestion } from '../../core/models/quiz-question.model';

type QuizPhase = 'answering' | 'reviewing' | 'complete';

@Component({
  selector: 'app-quiz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
  host: { '(keydown)': 'onKeydown($event)' },
})
export class QuizComponent {
  readonly questions: QuizQuestion[] = QUIZ_QUESTIONS;

  readonly currentIndex = signal(0);
  readonly selectedAnswer = signal<string | null>(null);
  readonly phase = signal<QuizPhase>('answering');
  readonly answers = signal<Map<string, string>>(new Map());

  readonly currentQuestion = computed(() => this.questions[this.currentIndex()]);

  readonly isLastQuestion = computed(
    () => this.currentIndex() === this.questions.length - 1
  );

  readonly progressPercent = computed(
    () => Math.round((this.currentIndex() / this.questions.length) * 100)
  );

  readonly score = computed(() => {
    const ans = this.answers();
    let correct = 0;
    for (const q of this.questions) {
      if (ans.get(q.id) === q.correctAnswer) correct++;
    }
    return correct;
  });

  readonly scoreLabel = computed(() => {
    const s = this.score();
    const total = this.questions.length;
    if (s === total) return 'Perfect Score! 🎉';
    if (s >= total * 0.7) return 'Great Work!';
    if (s >= total * 0.5) return 'Good Effort!';
    return 'Keep Practicing!';
  });

  selectAnswer(option: string): void {
    if (this.phase() !== 'answering') return;
    this.selectedAnswer.set(option);
  }

  submitAnswer(): void {
    const answer = this.selectedAnswer();
    if (!answer) return;
    const q = this.currentQuestion();
    this.answers.update(m => new Map(m).set(q.id, answer));
    this.phase.set('reviewing');
  }

  next(): void {
    if (this.isLastQuestion()) {
      this.phase.set('complete');
    } else {
      this.currentIndex.update(i => i + 1);
      this.selectedAnswer.set(null);
      this.phase.set('answering');
    }
  }

  restart(): void {
    this.currentIndex.set(0);
    this.selectedAnswer.set(null);
    this.phase.set('answering');
    this.answers.set(new Map());
  }

  onKeydown(event: KeyboardEvent): void {
    const phase = this.phase();
    if (phase === 'complete') return;

    const digitMatch = event.key.match(/^[1-4]$/);
    if (digitMatch && phase === 'answering') {
      const idx = parseInt(event.key, 10) - 1;
      const options = this.currentQuestion().options;
      if (idx < options.length) {
        event.preventDefault();
        this.selectAnswer(options[idx]);
      }
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (phase === 'answering' && this.selectedAnswer()) {
        this.submitAnswer();
      } else if (phase === 'reviewing') {
        this.next();
      }
    }
  }
}