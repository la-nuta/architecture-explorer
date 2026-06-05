# Architecture Explorer

An interactive web application for learning and comparing software architecture patterns, built as a portfolio project to showcase modern **Angular 21** skills.

---

## Features

- **9 architecture patterns** — Monolith → Microservices, Clean Architecture, CQRS, Serverless, and more
- **Pattern catalog** — grid view with real-time debounced search and difficulty/tag filters
- **Pattern detail** — four tabs: Overview, Diagram (SVG), Code (syntax-highlighted), Interview answer
- **Compare** — select two patterns side-by-side with visual rating bars
- **Quiz** — 10-question flow with score screen, per-question review, and keyboard shortcuts
- **Favorites** — bookmark patterns; persisted to `localStorage`
- **Keyboard navigation** — press `1–4` to select quiz options, `Enter` to submit/advance, `/` to focus search

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | Angular 21 (standalone API) |
| Styling | Tailwind CSS v4 |
| State | Angular Signals + RxJS |
| Testing | Vitest (via `@angular/build:unit-test`) |
| Build | Angular CLI / esbuild |

### Angular features demonstrated

- `signal()`, `computed()`, `effect()` — reactive state without NgRx
- `inject()` with `InjectionToken` — no constructor injection
- `@defer` — lazy-load diagram SVGs on viewport entry
- `@if` / `@for` — new control flow syntax
- `ChangeDetectionStrategy.OnPush` — on every component
- `takeUntilDestroyed()` — clean RxJS teardown
- Standalone components — no NgModules
- `loadChildren` per route — code splitting with six lazy chunks
- `LocalStorage` persistence via signal + `effect()`

---

## Project Structure

```
src/app/
├── core/
│   ├── models/          # ArchitecturePattern, QuizQuestion interfaces
│   ├── services/        # ArchitectureService, FavoritesService, ComparisonService, SearchFilterService
│   └── tokens/          # InjectionToken<ArchitecturePattern[]>
├── shared/
│   ├── components/      # PatternCard, CodeViewer, Diagram, RatingBar, Badge, EmptyState
│   └── pipes/           # FilterPatternsPipe
├── features/            # home / catalog / pattern-detail / compare / quiz / favorites
├── layout/              # ShellComponent (nav + router-outlet)
└── data/                # architectures.data.ts (9 patterns) · quiz.data.ts (10 questions)
```

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm 10+

### Install

```bash
npm install
```

### Dev server

```bash
ng serve
# → http://localhost:4200
```

### Build

```bash
ng build          # production build → dist/
```

### Tests

```bash
ng test           # run all unit tests with Vitest
```

59 tests across `ArchitectureService`, `FavoritesService`, `FilterPatternsPipe`, and `QuizComponent`.

---

## Architecture Decisions

### Signals over NgRx

Local state (catalog filters, quiz progress, favorites) lives in Angular signals.  
NgRx adds boilerplate that's not justified for a portfolio-scale app with no cross-route shared mutable state.

### RxJS for async streams

`ComparisonService` uses `BehaviorSubject` and `combineLatest` — this is the idiomatic Angular pattern for streams that coordinate across multiple async sources. `SearchFilterService` uses `debounceTime` + `distinctUntilChanged` to debounce the search input without any extra library.

### InjectionToken for pattern data

`PATTERNS_DATA` is provided at the app root. Tests provide a mock dataset via `{ provide: PATTERNS_DATA, useValue: MOCK_PATTERNS }` — no HTTP mocking required.

### Pure pipe for filtering

`FilterPatternsPipe` is `pure: true` (the default). Angular only re-runs it when the input reference changes, which fits the catalog's `computed()` flow naturally.

### No NgModules

Every component, pipe, and directive is standalone. Routing uses `loadChildren` pointing at route arrays — the resulting bundle has a separate chunk per feature.