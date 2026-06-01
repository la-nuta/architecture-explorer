---
name: Architecture Explorer — Design Spec
description: Design specification for an Angular 21 interactive web app for learning and comparing software architecture patterns
type: project
---

# Architecture Explorer — Design Spec

## Context

An interactive web application for learning and comparing software architecture patterns, while visibly showcasing modern Angular 21 skills (signals, standalone components, lazy loading, RxJS, `@defer`, `OnPush`). Target audience: developers browsing the portfolio, and developers who want to learn architecture patterns.

---

## Design Decisions

| Decision | Choice |
|---|---|
| Angular version | 21 (standalone API, new control flow `@if/@for`, `@defer`) |
| Styling | Tailwind CSS v4 (already installed) |
| Visual theme | Dark dev-tools aesthetic — VS Code-inspired, purple/blue palette, monospace accents |
| State management | Angular Signals (local) + RxJS (async/streams) — no NgRx |
| App structure | Library-style folders (`core/`, `shared/`, `features/`, `data/`) + feature-per-route lazy loading |
| Testing | Vitest (already configured) |
| Diagrams | SVG-based, data-driven per pattern |
| Code examples | Syntax-highlighted via Prism.js or highlight.js |

---

## Architecture Patterns Covered (9)

| Pattern | Category | Difficulty |
|---|---|---|
| Monolith | Backend | Beginner |
| Modular Monolith | Backend | Intermediate |
| Microservices | Backend | Advanced |
| Layered Architecture | Backend | Beginner |
| Clean Architecture | Cross-cutting | Advanced |
| Hexagonal Architecture | Cross-cutting | Advanced |
| Event-Driven Architecture | Backend | Intermediate |
| CQRS | Backend | Advanced |
| Serverless | Backend | Intermediate |

---

## Pages & Routes

| Page | Route | Loading |
|---|---|---|
| Home | `/` | Eager |
| Catalog | `/architectures` | Lazy |
| Pattern Detail | `/architectures/:slug` | Lazy |
| Compare | `/compare` | Lazy |
| Quiz | `/quiz` | Lazy |
| Favorites | `/favorites` | Lazy |

---

## Data Models

### ArchitecturePattern
```ts
export interface ArchitecturePattern {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  useCases: string[];
  avoidWhen: string[];
  pros: string[];
  cons: string[];
  commonMistakes: string[];
  interviewAnswer: string;
  diagramNodes: DiagramNode[];
  codeExample: CodeExample;
  comparison: {
    complexity: 'Low' | 'Medium' | 'High';
    scalability: 'Low' | 'Medium' | 'High';
    teamSize: 'Small' | 'Medium' | 'Large';
    deploymentComplexity: 'Low' | 'Medium' | 'High';
    testingComplexity: 'Low' | 'Medium' | 'High';
  };
}

export interface DiagramNode {
  id: string;
  label: string;
  type: 'layer' | 'service' | 'boundary' | 'actor';
  connections: string[];
}

export interface CodeExample {
  language: 'typescript';
  label: string;
  code: string;
}
```

### QuizQuestion
```ts
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}
```

---

## Folder Structure

```
src/app/
├── core/
│   ├── models/
│   │   ├── architecture-pattern.model.ts
│   │   └── quiz-question.model.ts
│   ├── services/
│   │   ├── architecture.service.ts     # signal-based, exposes patterns
│   │   ├── favorites.service.ts        # LocalStorage persistence
│   │   ├── comparison.service.ts       # BehaviorSubject<string[]>
│   │   └── search-filter.service.ts   # RxJS debounced search
│   └── tokens/
│       └── patterns-data.token.ts
│
├── shared/
│   ├── components/
│   │   ├── pattern-card/
│   │   ├── code-viewer/
│   │   ├── diagram/
│   │   ├── rating-bar/
│   │   ├── badge/
│   │   └── empty-state/
│   └── pipes/
│       └── filter-patterns.pipe.ts
│
├── features/
│   ├── home/
│   ├── catalog/
│   ├── pattern-detail/
│   ├── compare/
│   ├── quiz/
│   └── favorites/
│
├── layout/
│   ├── shell.component.ts
│   └── nav.component.ts
│
└── data/
    ├── architectures.data.ts
    └── quiz.data.ts
```

---

## State Management

### Signals (local UI state)
- `ArchitectureService` — `patterns = signal<ArchitecturePattern[]>(DATA)`, `getBySlug(slug) = computed(...)`
- `FavoritesService` — `favoriteIds = signal<string[]>(fromLocalStorage)`, `effect()` syncs to LocalStorage
- `QuizStore` (inside quiz component) — `currentIndex`, `score`, `answers`, `isComplete`

### RxJS (async / cross-component streams)
- `ComparisonService` — `selected$ = new BehaviorSubject<string[]>([])`, `comparedPatterns$ = combineLatest(...)`
- `SearchFilterService` — `query$.pipe(debounceTime(300), switchMap(...))`
- All subscriptions use `takeUntilDestroyed()`

---

## Angular Showcase Checklist

- `signal()`, `computed()`, `effect()`
- `inject()` with `InjectionToken`
- `@defer` — lazy-load diagram SVGs on viewport entry
- `@if` / `@for` — new control flow
- `ChangeDetectionStrategy.OnPush` everywhere
- `takeUntilDestroyed()` for RxJS teardown
- Standalone components — no NgModules
- `loadChildren` per feature route
- Reactive Forms — quiz answer selection
- LocalStorage via signal + effect

---

## Future Improvements

- AI Coach — Angular → backend proxy → OpenAI API
- Diagrams with Mermaid.js
- Advanced quiz mode with spaced repetition
- User notes per pattern
- Progress tracking
- Backend with authentication
