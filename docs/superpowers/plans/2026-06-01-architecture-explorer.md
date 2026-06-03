# Architecture Explorer — Design & Implementation Plan

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
  diagramNodes: DiagramNode[];     // drives SVG diagram rendering
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
  connections: string[];  // ids of connected nodes
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
│       └── patterns-data.token.ts      # InjectionToken<ArchitecturePattern[]>
│
├── shared/
│   ├── components/
│   │   ├── pattern-card/               # Dumb card, @Input pattern
│   │   ├── code-viewer/                # Syntax-highlighted block
│   │   ├── diagram/                    # SVG renderer, @Input nodes
│   │   ├── rating-bar/                 # ●●●○○ dots for comparison
│   │   ├── badge/                      # Difficulty / tag badge
│   │   └── empty-state/                # "No results found" fallback
│   └── pipes/
│       └── filter-patterns.pipe.ts
│
├── features/
│   ├── home/
│   │   └── home.component.ts           # Featured patterns + quick links
│   ├── catalog/
│   │   ├── catalog.component.ts        # Grid + search + filters
│   │   └── catalog.routes.ts
│   ├── pattern-detail/
│   │   ├── pattern-detail.component.ts # Tabs: Overview / Diagram / Code / Interview
│   │   └── pattern-detail.routes.ts
│   ├── compare/
│   │   ├── compare.component.ts        # Two selectors + comparison table
│   │   └── compare.routes.ts
│   ├── quiz/
│   │   ├── quiz.component.ts           # Question flow + score + restart
│   │   └── quiz.routes.ts
│   └── favorites/
│       ├── favorites.component.ts      # Saved patterns list
│       └── favorites.routes.ts
│
├── layout/
│   ├── shell.component.ts              # Top nav + router-outlet
│   └── nav.component.ts
│
└── data/
    ├── architectures.data.ts           # All 9 ArchitecturePattern objects
    └── quiz.data.ts                    # All QuizQuestion objects
```

---

## State Management

### Signals (local UI state)
- `ArchitectureService` — `patterns = signal<ArchitecturePattern[]>(DATA)`, `getBySlug(slug) = computed(...)`
- `FavoritesService` — `favoriteIds = signal<string[]>(fromLocalStorage)`, `effect()` syncs to LocalStorage
- `QuizStore` (inside quiz component) — `currentIndex`, `score`, `answers`, `isComplete` — all signals

### RxJS (async / cross-component streams)
- `ComparisonService` — `selected$ = new BehaviorSubject<string[]>([])`, `comparedPatterns$ = combineLatest(...)`
- `SearchFilterService` — `query$ = new Subject<string>()`, exposed as `filtered$ = query$.pipe(debounceTime(300), switchMap(...))`
- All subscriptions use `takeUntilDestroyed()`

---

## Angular Showcase Checklist

- `signal()`, `computed()`, `effect()` — reactive state without NgRx
- `inject()` with `InjectionToken` — no constructor injection
- `@defer` — lazy-load diagram SVGs on viewport entry
- `@if` / `@for` — new control flow (no `*ngIf` / `*ngFor`)
- `ChangeDetectionStrategy.OnPush` — on every component
- `takeUntilDestroyed()` — clean RxJS teardown
- Standalone components — no NgModules anywhere
- `loadChildren` per feature route — code splitting
- `Reactive Forms` — quiz answer selection
- `LocalStorage` via `FavoritesService` with signal + effect

---

## Implementation Plan

### Day 1 — Foundation
1. Replace default app scaffold (clean `app.html`, `app.css`)
2. Create `layout/` — `ShellComponent` with top nav, `<router-outlet>`
3. Set up `app.routes.ts` with all 6 routes (lazy for 5 features)
4. Create `core/models/` — `ArchitecturePattern`, `QuizQuestion` interfaces
5. Create `data/architectures.data.ts` — stub data for all 9 patterns (fill detail later)
6. Create `core/services/architecture.service.ts` — signal-based
7. Create `features/home/` — `HomeComponent` with featured cards + nav links
8. Create `shared/components/pattern-card/` — dumb card component
9. Create `features/catalog/` — `CatalogComponent` with grid of cards

### Day 2 — Detail, Search, Favorites
1. Create `shared/components/diagram/` — SVG renderer from `diagramNodes`
2. Create `shared/components/code-viewer/` — syntax-highlighted block
3. Create `features/pattern-detail/` — tabs (Overview / Diagram / Code / Interview)
4. Create `core/services/search-filter.service.ts` — RxJS debounced search
5. Add search input + difficulty/tag filters to `CatalogComponent`
6. Create `core/services/favorites.service.ts` — signal + LocalStorage effect
7. Create `features/favorites/` — `FavoritesComponent`
8. Add "Add to favorites" button on detail page and catalog cards
9. Fill out full data for at least 5 patterns in `architectures.data.ts`

### Day 3 — Compare, Quiz, Data
1. Create `core/services/comparison.service.ts` — RxJS `BehaviorSubject`
2. Create `features/compare/` — two pattern selectors + comparison table with `rating-bar`
3. Create `data/quiz.data.ts` — 8–10 quiz questions
4. Create `features/quiz/` — question flow, progress bar, score screen, restart
5. Fill remaining 4 patterns in `architectures.data.ts`
6. Create `shared/components/empty-state/`, `badge/`, `rating-bar/`
7. Add responsive layout (Tailwind breakpoints) to all pages

### Day 4 — Polish, Tests, Deploy
1. Dark theme refinement — consistent monospace accents, hover states, transitions
2. Keyboard navigation — focus management in quiz, catalog
3. Write Vitest unit tests:
   - `ArchitectureService` — `getBySlug`, signal state
   - `FavoritesService` — add/remove, LocalStorage sync
   - `FilterPatternsPipe` — filter logic
   - `QuizComponent` — score calculation, restart
4. Update `README.md` — description, screenshots, stack, setup, architecture decisions
5. Deploy to Vercel or Firebase Hosting
6. (Optional) Stub AI Coach page with mock responses

---

## Verification

- `ng serve` — all 6 routes load without errors
- Catalog: search filters by name, difficulty filter works, empty state shows when no results
- Pattern detail: all 4 tabs render, diagram SVG visible, code block highlighted, favorites toggle works
- Favorites: persist after page reload (LocalStorage)
- Compare: selecting two patterns populates comparison table correctly
- Quiz: progresses through questions, calculates score, restart resets state
- All components use `OnPush` — verify no excessive CD cycles
- `ng build` — no type errors, bundle has separate lazy chunks per feature

---

## Files to Create (Critical Path)

| File | Purpose |
|---|---|
| `src/app/layout/shell.component.ts` | App shell with nav |
| `src/app/app.routes.ts` | All routes with lazy loading |
| `src/app/core/models/architecture-pattern.model.ts` | Core data type |
| `src/app/core/models/quiz-question.model.ts` | Quiz data type |
| `src/app/data/architectures.data.ts` | All 9 pattern objects |
| `src/app/data/quiz.data.ts` | Quiz questions |
| `src/app/core/services/architecture.service.ts` | Signal-based data access |
| `src/app/core/services/favorites.service.ts` | LocalStorage + signal |
| `src/app/core/services/comparison.service.ts` | RxJS BehaviorSubject |
| `src/app/core/services/search-filter.service.ts` | RxJS debounced search |
| `src/app/shared/components/pattern-card/` | Reusable card |
| `src/app/shared/components/diagram/` | SVG diagram renderer |
| `src/app/shared/components/code-viewer/` | Highlighted code block |
| `src/app/shared/components/rating-bar/` | ●●●○○ comparison dots |
| `src/app/features/home/home.component.ts` | Home page |
| `src/app/features/catalog/catalog.component.ts` | Pattern grid |
| `src/app/features/pattern-detail/pattern-detail.component.ts` | Detail tabs |
| `src/app/features/compare/compare.component.ts` | Comparison table |
| `src/app/features/quiz/quiz.component.ts` | Quiz flow |
| `src/app/features/favorites/favorites.component.ts` | Saved patterns |

---

## Future Improvements (Out of MVP Scope)

- AI Coach — Angular → backend proxy → OpenAI API (interview answer generation, quiz generation)
- Diagrams with Mermaid.js
- Advanced quiz mode with spaced repetition
- User notes per pattern
- Progress tracking
- Backend with authentication
