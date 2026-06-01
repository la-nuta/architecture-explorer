import { Injectable, inject, signal, computed } from '@angular/core';
import { PATTERNS_DATA } from '../tokens/patterns-data.token';
import { ArchitecturePattern } from '../models/architecture-pattern.model';

@Injectable({ providedIn: 'root' })
export class ArchitectureService {
  private readonly _patterns = signal<ArchitecturePattern[]>(inject(PATTERNS_DATA));

  readonly patterns = this._patterns.asReadonly();

  readonly featured = computed(() => this._patterns().slice(0, 3));

  getBySlug(slug: string): ArchitecturePattern | undefined {
    return this.patterns().find(p => p.slug === slug);
  }
}
