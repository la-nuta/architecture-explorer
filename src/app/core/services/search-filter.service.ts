import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SearchFilterService {
  private readonly query$ = new Subject<string>();

  readonly debouncedQuery$ = this.query$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    startWith(''),
  );

  setQuery(q: string): void {
    this.query$.next(q);
  }
}
