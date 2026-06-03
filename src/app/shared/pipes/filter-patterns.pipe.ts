import { Pipe, PipeTransform } from '@angular/core';
import { ArchitecturePattern } from '../../core/models/architecture-pattern.model';

export interface FilterOptions {
  query?: string;
  difficulty?: 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
  tag?: string;
}

@Pipe({ name: 'filterPatterns', standalone: true, pure: true })
export class FilterPatternsPipe implements PipeTransform {
  transform(
    patterns: ArchitecturePattern[],
    options: FilterOptions = {}
  ): ArchitecturePattern[] {
    const { query = '', difficulty = 'All', tag = 'All' } = options;
    const normalizedQuery = query.toLowerCase().trim();

    return patterns.filter(pattern => {
      if (difficulty !== 'All' && pattern.difficulty !== difficulty) return false;
      if (tag !== 'All' && !pattern.tags.includes(tag)) return false;
      if (!normalizedQuery) return true;

      return (
        pattern.title.toLowerCase().includes(normalizedQuery) ||
        pattern.shortDescription.toLowerCase().includes(normalizedQuery) ||
        pattern.tags.some(t => t.toLowerCase().includes(normalizedQuery))
      );
    });
  }
}