import { TestBed } from '@angular/core/testing';
import { ComparisonService } from './comparison.service';

describe('ComparisonService', () => {
  let service: ComparisonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComparisonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialise leftId$ with an empty string', () => {
    let emitted = '';
    service.leftId$.subscribe(val => { emitted = val; });
    expect(emitted).toBe('');
  });

  it('should initialise rightId$ with an empty string', () => {
    let emitted = '';
    service.rightId$.subscribe(val => { emitted = val; });
    expect(emitted).toBe('');
  });

  describe('setLeft', () => {
    it('should emit the given id on leftId$', () => {
      const values: string[] = [];
      service.leftId$.subscribe(v => values.push(v));

      service.setLeft('monolith');

      expect(values).toEqual(['', 'monolith']);
    });

    it('should not affect rightId$', () => {
      const rights: string[] = [];
      service.rightId$.subscribe(v => rights.push(v));

      service.setLeft('monolith');

      expect(rights).toEqual(['']);
    });
  });

  describe('setRight', () => {
    it('should emit the given id on rightId$', () => {
      const values: string[] = [];
      service.rightId$.subscribe(v => values.push(v));

      service.setRight('microservices');

      expect(values).toEqual(['', 'microservices']);
    });

    it('should not affect leftId$', () => {
      const lefts: string[] = [];
      service.leftId$.subscribe(v => lefts.push(v));

      service.setRight('microservices');

      expect(lefts).toEqual(['']);
    });
  });

  describe('clear', () => {
    it('should reset leftId$ to empty string', () => {
      service.setLeft('monolith');
      service.clear();
      expect(service.leftId$.getValue()).toBe('');
    });

    it('should reset rightId$ to empty string', () => {
      service.setRight('microservices');
      service.clear();
      expect(service.rightId$.getValue()).toBe('');
    });

    it('should reset both simultaneously', () => {
      service.setLeft('monolith');
      service.setRight('microservices');
      service.clear();
      expect(service.leftId$.getValue()).toBe('');
      expect(service.rightId$.getValue()).toBe('');
    });
  });

  describe('BehaviorSubject state', () => {
    it('should expose the latest value synchronously via getValue()', () => {
      service.setLeft('clean');
      expect(service.leftId$.getValue()).toBe('clean');
    });

    it('should allow updating leftId multiple times', () => {
      service.setLeft('monolith');
      service.setLeft('microservices');
      expect(service.leftId$.getValue()).toBe('microservices');
    });
  });
});