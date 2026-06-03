import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ComparisonService {
  readonly leftId$ = new BehaviorSubject<string>('');
  readonly rightId$ = new BehaviorSubject<string>('');

  setLeft(id: string): void {
    this.leftId$.next(id);
  }

  setRight(id: string): void {
    this.rightId$.next(id);
  }

  clear(): void {
    this.leftId$.next('');
    this.rightId$.next('');
  }
}