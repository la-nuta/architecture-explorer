import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PatternCardComponent } from './pattern-card.component';
import { ArchitecturePattern } from '../../../core/models/architecture-pattern.model';

function makePattern(difficulty: ArchitecturePattern['difficulty']): ArchitecturePattern {
  return {
    id: 'test-id',
    slug: 'test-slug',
    title: 'Test Pattern',
    shortDescription: 'Short desc',
    overview: 'Overview',
    difficulty,
    tags: ['backend', 'simple'],
    useCases: [],
    avoidWhen: [],
    pros: [],
    cons: [],
    commonMistakes: [],
    interviewAnswer: '',
    diagramNodes: [],
    codeExample: { language: 'typescript', label: '', code: '' },
    comparison: {
      complexity: 'Low',
      scalability: 'Low',
      teamSize: 'Small',
      deploymentComplexity: 'Low',
      testingComplexity: 'Low',
    },
  };
}

describe('PatternCardComponent', () => {
  let fixture: ComponentFixture<PatternCardComponent>;
  let component: PatternCardComponent;

  function create(difficulty: ArchitecturePattern['difficulty'] = 'Beginner', isFavorite = false) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [PatternCardComponent],
      providers: [provideRouter([])],
    });
    fixture = TestBed.createComponent(PatternCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('pattern', makePattern(difficulty));
    fixture.componentRef.setInput('isFavorite', isFavorite);
    fixture.detectChanges();
    return component;
  }

  it('should be created', () => {
    create();
    expect(component).toBeTruthy();
  });

  describe('difficultyBg()', () => {
    it('should return green tint for Beginner', () => {
      create();
      expect(component.difficultyBg('Beginner')).toBe('rgba(34, 197, 94, 0.15)');
    });

    it('should return yellow tint for Intermediate', () => {
      create();
      expect(component.difficultyBg('Intermediate')).toBe('rgba(234, 179, 8, 0.15)');
    });

    it('should return red tint for Advanced', () => {
      create();
      expect(component.difficultyBg('Advanced')).toBe('rgba(239, 68, 68, 0.15)');
    });
  });

  describe('difficultyColor()', () => {
    it('should return green for Beginner', () => {
      create();
      expect(component.difficultyColor('Beginner')).toBe('#22c55e');
    });

    it('should return yellow for Intermediate', () => {
      create();
      expect(component.difficultyColor('Intermediate')).toBe('#eab308');
    });

    it('should return red for Advanced', () => {
      create();
      expect(component.difficultyColor('Advanced')).toBe('#ef4444');
    });
  });

  describe('onFavoriteToggle()', () => {
    it('should emit the pattern id', () => {
      create();
      const emitted: string[] = [];
      component.favoriteToggle.subscribe((id: string) => emitted.push(id));

      const event = new MouseEvent('click');
      component.onFavoriteToggle(event);

      expect(emitted).toEqual(['test-id']);
    });

    it('should stop event propagation', () => {
      create();
      const event = new MouseEvent('click', { bubbles: true });
      const stopSpy = vi.spyOn(event, 'stopPropagation');
      component.onFavoriteToggle(event);
      expect(stopSpy).toHaveBeenCalled();
    });

    it('should prevent default browser action', () => {
      create();
      const event = new MouseEvent('click');
      const preventSpy = vi.spyOn(event, 'preventDefault');
      component.onFavoriteToggle(event);
      expect(preventSpy).toHaveBeenCalled();
    });
  });

  describe('template', () => {
    it('should show the pattern title', () => {
      create();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('Test Pattern');
    });

    it('should show the short description', () => {
      create();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.textContent).toContain('Short desc');
    });

    it('should show "♥ Favorite" when isFavorite is true', () => {
      create('Beginner', true);
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.favorite-btn');
      expect(btn?.textContent?.trim()).toContain('♥');
    });

    it('should show "♡ Favorite" when isFavorite is false', () => {
      create('Beginner', false);
      const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.favorite-btn');
      expect(btn?.textContent?.trim()).toContain('♡');
    });
  });
});