import { TestBed } from '@angular/core/testing';
import { ArchitectureService } from './architecture.service';
import { PATTERNS_DATA } from '../tokens/patterns-data.token';
import { ArchitecturePattern } from '../models/architecture-pattern.model';

const MOCK_PATTERNS: ArchitecturePattern[] = [
  {
    id: 'monolith',
    slug: 'monolith',
    title: 'Monolith',
    shortDescription: 'Single deployable unit',
    overview: 'A monolithic application is a single unified unit.',
    difficulty: 'Beginner',
    tags: ['backend', 'simple'],
    useCases: ['Small apps'],
    avoidWhen: ['Large teams'],
    pros: ['Easy to develop'],
    cons: ['Hard to scale'],
    commonMistakes: ['Skipping modularisation'],
    interviewAnswer: 'A monolith packages all functionality in one process.',
    diagramNodes: [],
    codeExample: { language: 'typescript', label: 'Example', code: 'const app = express();' },
    comparison: {
      complexity: 'Low',
      scalability: 'Low',
      teamSize: 'Small',
      deploymentComplexity: 'Low',
      testingComplexity: 'Low',
    },
  },
  {
    id: 'microservices',
    slug: 'microservices',
    title: 'Microservices',
    shortDescription: 'Small independent services',
    overview: 'Each service owns its own data and runs independently.',
    difficulty: 'Advanced',
    tags: ['backend', 'distributed'],
    useCases: ['Large scale systems'],
    avoidWhen: ['Small teams'],
    pros: ['Independent deployment'],
    cons: ['Operational complexity'],
    commonMistakes: ['Too fine-grained services'],
    interviewAnswer: 'Microservices decompose a system into small independent processes.',
    diagramNodes: [],
    codeExample: { language: 'typescript', label: 'Example', code: 'const svc = express();' },
    comparison: {
      complexity: 'High',
      scalability: 'High',
      teamSize: 'Large',
      deploymentComplexity: 'High',
      testingComplexity: 'High',
    },
  },
];

describe('ArchitectureService', () => {
  let service: ArchitectureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ArchitectureService,
        { provide: PATTERNS_DATA, useValue: MOCK_PATTERNS },
      ],
    });
    service = TestBed.inject(ArchitectureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose all patterns via the patterns signal', () => {
    expect(service.patterns()).toHaveLength(2);
    expect(service.patterns()[0].id).toBe('monolith');
  });

  it('should return the first 3 patterns as featured (or all if fewer)', () => {
    expect(service.featured()).toHaveLength(2);
    expect(service.featured()[0].title).toBe('Monolith');
  });

  describe('getBySlug', () => {
    it('should return the matching pattern', () => {
      const result = service.getBySlug('microservices');
      expect(result).toBeDefined();
      expect(result!.title).toBe('Microservices');
    });

    it('should return undefined for an unknown slug', () => {
      expect(service.getBySlug('does-not-exist')).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      expect(service.getBySlug('Monolith')).toBeUndefined();
      expect(service.getBySlug('monolith')).toBeDefined();
    });
  });
});