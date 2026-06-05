import { FilterPatternsPipe } from './filter-patterns.pipe';
import { ArchitecturePattern } from '../../core/models/architecture-pattern.model';

function makePattern(partial: Partial<ArchitecturePattern> & { id: string; title: string; difficulty: ArchitecturePattern['difficulty']; tags: string[] }): ArchitecturePattern {
  return {
    slug: partial.id,
    shortDescription: '',
    overview: '',
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
    ...partial,
  } as ArchitecturePattern;
}

const PATTERNS: ArchitecturePattern[] = [
  makePattern({ id: 'monolith',      title: 'Monolith',      difficulty: 'Beginner',     tags: ['backend', 'simple'] }),
  makePattern({ id: 'microservices', title: 'Microservices', difficulty: 'Advanced',     tags: ['backend', 'distributed'] }),
  makePattern({ id: 'clean',         title: 'Clean Architecture', difficulty: 'Advanced', tags: ['cross-cutting', 'layers'] }),
  makePattern({ id: 'serverless',    title: 'Serverless',    difficulty: 'Intermediate', tags: ['backend', 'cloud'] }),
];

describe('FilterPatternsPipe', () => {
  let pipe: FilterPatternsPipe;

  beforeEach(() => {
    pipe = new FilterPatternsPipe();
  });

  it('should return all patterns when no options are provided', () => {
    expect(pipe.transform(PATTERNS)).toHaveLength(4);
  });

  it('should return all patterns when options are empty defaults', () => {
    expect(pipe.transform(PATTERNS, {})).toHaveLength(4);
  });

  describe('query filter', () => {
    it('should filter by title (case-insensitive)', () => {
      const result = pipe.transform(PATTERNS, { query: 'mono' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('monolith');
    });

    it('should filter by tag (case-insensitive)', () => {
      const result = pipe.transform(PATTERNS, { query: 'CLOUD' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('serverless');
    });

    it('should filter by shortDescription', () => {
      const patterns = [
        makePattern({ id: 'cqrs', title: 'CQRS', difficulty: 'Advanced', tags: [], shortDescription: 'Separates reads and writes' }),
      ];
      const result = pipe.transform(patterns, { query: 'reads and writes' });
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no match', () => {
      expect(pipe.transform(PATTERNS, { query: 'xxxxxxx' })).toHaveLength(0);
    });

    it('should trim whitespace from query', () => {
      const result = pipe.transform(PATTERNS, { query: '  micro  ' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('microservices');
    });
  });

  describe('difficulty filter', () => {
    it('should return only Beginner patterns', () => {
      const result = pipe.transform(PATTERNS, { difficulty: 'Beginner' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('monolith');
    });

    it('should return only Advanced patterns', () => {
      const result = pipe.transform(PATTERNS, { difficulty: 'Advanced' });
      expect(result).toHaveLength(2);
    });

    it('should return all when difficulty is "All"', () => {
      expect(pipe.transform(PATTERNS, { difficulty: 'All' })).toHaveLength(4);
    });
  });

  describe('tag filter', () => {
    it('should return only patterns with the given tag', () => {
      const result = pipe.transform(PATTERNS, { tag: 'backend' });
      expect(result).toHaveLength(3);
    });

    it('should return all when tag is "All"', () => {
      expect(pipe.transform(PATTERNS, { tag: 'All' })).toHaveLength(4);
    });

    it('should return empty when no pattern has the tag', () => {
      expect(pipe.transform(PATTERNS, { tag: 'nonexistent' })).toHaveLength(0);
    });
  });

  describe('combined filters', () => {
    it('should apply difficulty and tag together', () => {
      const result = pipe.transform(PATTERNS, { difficulty: 'Advanced', tag: 'backend' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('microservices');
    });

    it('should apply all three filters', () => {
      const result = pipe.transform(PATTERNS, { query: 'micro', difficulty: 'Advanced', tag: 'backend' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('microservices');
    });

    it('should return empty when combined filters yield no matches', () => {
      const result = pipe.transform(PATTERNS, { query: 'monolith', difficulty: 'Advanced' });
      expect(result).toHaveLength(0);
    });
  });
});