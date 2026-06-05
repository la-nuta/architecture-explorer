import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { SearchFilterService } from './search-filter.service';

describe('SearchFilterService', () => {
  let service: SearchFilterService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchFilterService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('debouncedQuery$', () => {
    it('should emit an empty string immediately on subscription (startWith)', () => {
      const values: string[] = [];
      service.debouncedQuery$.subscribe(v => values.push(v));
      expect(values).toEqual(['']);
    });

    it('should emit the query after 300ms debounce', () => {
      const values: string[] = [];
      service.debouncedQuery$.subscribe(v => values.push(v));

      service.setQuery('micro');
      vi.advanceTimersByTime(300);

      expect(values).toContain('micro');
    });

    it('should not emit before the 300ms window elapses', () => {
      const values: string[] = [];
      service.debouncedQuery$.subscribe(v => values.push(v));

      service.setQuery('micro');
      vi.advanceTimersByTime(200);

      expect(values).not.toContain('micro');
    });

    it('should debounce rapid inputs and only emit the last value', () => {
      const values: string[] = [];
      service.debouncedQuery$.subscribe(v => values.push(v));

      service.setQuery('m');
      vi.advanceTimersByTime(100);
      service.setQuery('mi');
      vi.advanceTimersByTime(100);
      service.setQuery('mic');
      vi.advanceTimersByTime(300);

      const nonEmpty = values.filter(v => v !== '');
      expect(nonEmpty).toEqual(['mic']);
    });

    it('should not re-emit the same value twice (distinctUntilChanged)', () => {
      const values: string[] = [];
      service.debouncedQuery$.subscribe(v => values.push(v));

      service.setQuery('micro');
      vi.advanceTimersByTime(300);
      service.setQuery('micro');
      vi.advanceTimersByTime(300);

      expect(values.filter(v => v === 'micro')).toHaveLength(1);
    });
  });

  describe('setQuery', () => {
    it('should push query into the debounced stream', () => {
      const received: string[] = [];
      service.debouncedQuery$.subscribe(v => received.push(v));

      service.setQuery('serverless');
      vi.advanceTimersByTime(300);

      expect(received).toContain('serverless');
    });

    it('should allow clearing the query with an empty string', () => {
      const received: string[] = [];
      service.debouncedQuery$.subscribe(v => received.push(v));

      service.setQuery('micro');
      vi.advanceTimersByTime(300);
      service.setQuery('');
      vi.advanceTimersByTime(300);

      expect(received.at(-1)).toBe('');
    });
  });
});