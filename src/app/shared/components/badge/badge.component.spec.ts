import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';

describe('BadgeComponent', () => {
  let fixture: ComponentFixture<BadgeComponent>;
  let component: BadgeComponent;

  function create(text: string) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [BadgeComponent] });
    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('text', text);
    fixture.detectChanges();
    return component;
  }

  it('should be created', () => {
    create('Beginner');
    expect(component).toBeTruthy();
  });

  describe('bg() computed', () => {
    it('should return green tint for "Beginner"', () => {
      create('Beginner');
      expect(component.bg()).toBe('rgba(34, 197, 94, 0.15)');
    });

    it('should return yellow tint for "Intermediate"', () => {
      create('Intermediate');
      expect(component.bg()).toBe('rgba(234, 179, 8, 0.15)');
    });

    it('should return red tint for "Advanced"', () => {
      create('Advanced');
      expect(component.bg()).toBe('rgba(239, 68, 68, 0.15)');
    });

    it('should return slate tint for an unknown value', () => {
      create('Unknown');
      expect(component.bg()).toBe('rgba(148, 163, 184, 0.12)');
    });
  });

  describe('color() computed', () => {
    it('should return green for "Beginner"', () => {
      create('Beginner');
      expect(component.color()).toBe('#22c55e');
    });

    it('should return yellow for "Intermediate"', () => {
      create('Intermediate');
      expect(component.color()).toBe('#eab308');
    });

    it('should return red for "Advanced"', () => {
      create('Advanced');
      expect(component.color()).toBe('#ef4444');
    });

    it('should return slate for an unknown value', () => {
      create('Unknown');
      expect(component.color()).toBe('#94a3b8');
    });
  });

  describe('template rendering', () => {
    it('should render the text content', () => {
      create('Beginner');
      const el: HTMLElement = fixture.nativeElement.querySelector('.badge');
      expect(el?.textContent?.trim()).toBe('Beginner');
    });

    it('should apply bg and color styles from computed signals', () => {
      create('Advanced');
      const el: HTMLElement = fixture.nativeElement.querySelector('.badge');
      expect(el?.style.background).toContain('239');
      expect(el?.style.color).toBe('rgb(239, 68, 68)');
    });
  });
});