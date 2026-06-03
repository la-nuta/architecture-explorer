import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { QUIZ_QUESTIONS } from '../../data/quiz.data';

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start at question 0 in "answering" phase with no selection', () => {
    expect(component.currentIndex()).toBe(0);
    expect(component.phase()).toBe('answering');
    expect(component.selectedAnswer()).toBeNull();
  });

  it('should load quiz questions from data', () => {
    expect(component.questions.length).toBeGreaterThan(0);
    expect(component.questions).toEqual(QUIZ_QUESTIONS);
  });

  describe('selectAnswer', () => {
    it('should set selectedAnswer when phase is "answering"', () => {
      const option = component.questions[0].options[0];
      component.selectAnswer(option);
      expect(component.selectedAnswer()).toBe(option);
    });

    it('should not change answer when phase is "reviewing"', () => {
      const q = component.questions[0];
      component.selectAnswer(q.options[0]);
      component.submitAnswer();
      component.selectAnswer(q.options[1]);
      expect(component.selectedAnswer()).toBe(q.options[0]);
    });
  });

  describe('submitAnswer', () => {
    it('should transition phase to "reviewing" after submission', () => {
      component.selectAnswer(component.questions[0].options[0]);
      component.submitAnswer();
      expect(component.phase()).toBe('reviewing');
    });

    it('should not submit if no answer is selected', () => {
      component.submitAnswer();
      expect(component.phase()).toBe('answering');
    });

    it('should record the answer in the answers map', () => {
      const q = component.questions[0];
      component.selectAnswer(q.options[0]);
      component.submitAnswer();
      expect(component.answers().get(q.id)).toBe(q.options[0]);
    });
  });

  describe('next', () => {
    it('should advance to the next question', () => {
      const q = component.questions[0];
      component.selectAnswer(q.options[0]);
      component.submitAnswer();
      component.next();
      expect(component.currentIndex()).toBe(1);
      expect(component.phase()).toBe('answering');
      expect(component.selectedAnswer()).toBeNull();
    });

    it('should transition to "complete" phase after the last question', () => {
      // answer all questions
      for (let i = 0; i < component.questions.length; i++) {
        component.currentIndex.set(i);
        component.phase.set('answering');
        component.selectedAnswer.set(null);
        component.selectAnswer(component.questions[i].options[0]);
        component.submitAnswer();
      }
      component.next();
      expect(component.phase()).toBe('complete');
    });
  });

  describe('score calculation', () => {
    it('should calculate score of 0 when all answers are wrong', () => {
      TestBed.runInInjectionContext(() => {
        const wrongAnswers = new Map(
          component.questions.map(q => {
            const wrong = q.options.find(o => o !== q.correctAnswer)!;
            return [q.id, wrong];
          })
        );
        component.answers.set(wrongAnswers);
        expect(component.score()).toBe(0);
      });
    });

    it('should calculate score equal to total when all answers are correct', () => {
      const correctAnswers = new Map(
        component.questions.map(q => [q.id, q.correctAnswer])
      );
      component.answers.set(correctAnswers);
      expect(component.score()).toBe(component.questions.length);
    });

    it('should calculate a partial score correctly', () => {
      const partialAnswers = new Map<string, string>();
      partialAnswers.set(component.questions[0].id, component.questions[0].correctAnswer);
      component.answers.set(partialAnswers);
      expect(component.score()).toBe(1);
    });
  });

  describe('scoreLabel', () => {
    it('should return "Perfect Score!" when all correct', () => {
      const correctAnswers = new Map(
        component.questions.map(q => [q.id, q.correctAnswer])
      );
      component.answers.set(correctAnswers);
      expect(component.scoreLabel()).toContain('Perfect');
    });

    it('should return "Keep Practicing!" when score is below 50%', () => {
      component.answers.set(new Map());
      expect(component.scoreLabel()).toBe('Keep Practicing!');
    });
  });

  describe('restart', () => {
    it('should reset all state to initial values', () => {
      // Simulate a completed quiz
      component.currentIndex.set(5);
      component.selectedAnswer.set('some answer');
      component.phase.set('complete');
      component.answers.set(new Map([['q1', 'x']]));

      component.restart();

      expect(component.currentIndex()).toBe(0);
      expect(component.selectedAnswer()).toBeNull();
      expect(component.phase()).toBe('answering');
      expect(component.answers().size).toBe(0);
    });
  });

  describe('progress', () => {
    it('should report 0% at question 0', () => {
      expect(component.progressPercent()).toBe(0);
    });

    it('should increase after advancing', () => {
      component.currentIndex.set(1);
      expect(component.progressPercent()).toBeGreaterThan(0);
    });
  });

  describe('keyboard navigation', () => {
    it('should select option 1 when pressing "1" key during answering', () => {
      const event = new KeyboardEvent('keydown', { key: '1' });
      component.onKeydown(event);
      expect(component.selectedAnswer()).toBe(component.questions[0].options[0]);
    });

    it('should not select option when key is out of range', () => {
      const event = new KeyboardEvent('keydown', { key: '9' });
      component.onKeydown(event);
      expect(component.selectedAnswer()).toBeNull();
    });

    it('should submit on Enter when an answer is selected', () => {
      component.selectAnswer(component.questions[0].options[0]);
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeydown(event);
      expect(component.phase()).toBe('reviewing');
    });

    it('should not submit on Enter when no answer selected', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeydown(event);
      expect(component.phase()).toBe('answering');
    });

    it('should advance on Enter when phase is "reviewing"', () => {
      component.selectAnswer(component.questions[0].options[0]);
      component.submitAnswer();
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      component.onKeydown(event);
      expect(component.currentIndex()).toBe(1);
    });

    it('should do nothing when phase is "complete"', () => {
      component.phase.set('complete');
      const event = new KeyboardEvent('keydown', { key: '1' });
      component.onKeydown(event);
      expect(component.selectedAnswer()).toBeNull();
    });
  });
});