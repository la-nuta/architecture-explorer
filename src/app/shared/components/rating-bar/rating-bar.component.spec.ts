import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { RatingBarComponent } from './rating-bar.component';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [RatingBarComponent],
  template: `<app-rating-bar [value]="value" />`,
})
class HostComponent {
  value = 'Low';
}

describe('RatingBarComponent', () => {
  let fixture: ComponentFixture<RatingBarComponent>;
  let component: RatingBarComponent;

  function create(value: string) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({ imports: [RatingBarComponent] });
    fixture = TestBed.createComponent(RatingBarComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('value', value);
    fixture.detectChanges();
    return component;
  }

  it('should be created', () => {
    create('Low');
    expect(component).toBeTruthy();
  });

  describe('dots computed signal', () => {
    it('should produce 1 filled dot for "Low"', () => {
      create('Low');
      const d = component.dots();
      expect(d.filter(Boolean)).toHaveLength(1);
      expect(d).toHaveLength(5);
    });

    it('should produce 1 filled dot for "Small"', () => {
      create('Small');
      expect(component.dots().filter(Boolean)).toHaveLength(1);
    });

    it('should produce 3 filled dots for "Medium"', () => {
      create('Medium');
      expect(component.dots().filter(Boolean)).toHaveLength(3);
    });

    it('should produce 5 filled dots for "High"', () => {
      create('High');
      expect(component.dots().filter(Boolean)).toHaveLength(5);
    });

    it('should produce 5 filled dots for "Large"', () => {
      create('Large');
      expect(component.dots().filter(Boolean)).toHaveLength(5);
    });

    it('should produce 0 filled dots for an unrecognised value', () => {
      create('Unknown');
      expect(component.dots().filter(Boolean)).toHaveLength(0);
    });

    it('should always return exactly 5 dot entries', () => {
      for (const v of ['Low', 'Medium', 'High', 'Small', 'Large', 'Unknown']) {
        create(v);
        expect(component.dots()).toHaveLength(5);
      }
    });

    it('leading dots are filled and trailing dots are empty', () => {
      create('Medium');
      const d = component.dots();
      expect(d[0]).toBe(true);
      expect(d[1]).toBe(true);
      expect(d[2]).toBe(true);
      expect(d[3]).toBe(false);
      expect(d[4]).toBe(false);
    });
  });
});