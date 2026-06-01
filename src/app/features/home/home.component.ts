import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArchitectureService } from '../../core/services/architecture.service';
import { PatternCardComponent } from '../../shared/components/pattern-card/pattern-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, PatternCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Hero Section -->
    <section style="
      background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%);
      padding: 5rem 2rem 4rem;
      text-align: center;
      border-bottom: 1px solid #21262d;
      position: relative;
      overflow: hidden;
    ">
      <!-- Background accent -->
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 300px;
        background: radial-gradient(ellipse, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
        pointer-events: none;
      "></div>

      <div style="position: relative; max-width: 720px; margin: 0 auto;">
        <div style="
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-size: 0.75rem;
          color: #7c3aed;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
          font-weight: 600;
        ">// Software Architecture Patterns</div>

        <h1 style="
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          color: #e2e8f0;
          margin: 0 0 1.25rem 0;
          line-height: 1.15;
          letter-spacing: -0.03em;
          font-family: 'Inter', -apple-system, sans-serif;
        ">
          Architecture
          <span style="color: #7c3aed;">Explorer</span>
        </h1>

        <p style="
          font-size: 1.125rem;
          color: #8b949e;
          margin: 0 0 2.5rem 0;
          line-height: 1.7;
          max-width: 540px;
          margin-left: auto;
          margin-right: auto;
        ">
          Learn and compare software architecture patterns
        </p>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <a
            routerLink="/architectures"
            style="
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              background: #7c3aed;
              color: #fff;
              font-size: 0.9375rem;
              font-weight: 600;
              padding: 0.75rem 1.75rem;
              border-radius: 0.5rem;
              text-decoration: none;
              transition: background 0.15s ease, box-shadow 0.15s ease;
              font-family: 'Inter', -apple-system, sans-serif;
            "
            class="btn-primary"
          >
            Browse All →
          </a>

          <a
            routerLink="/quiz"
            style="
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              background: transparent;
              color: #3b82f6;
              font-size: 0.9375rem;
              font-weight: 600;
              padding: 0.75rem 1.75rem;
              border-radius: 0.5rem;
              text-decoration: none;
              border: 1px solid #3b82f6;
              transition: background 0.15s ease, color 0.15s ease;
              font-family: 'Inter', -apple-system, sans-serif;
            "
            class="btn-secondary"
          >
            Take Quiz
          </a>
        </div>
      </div>
    </section>

    <!-- Stats Row -->
    <section style="
      background: #161b22;
      border-bottom: 1px solid #21262d;
      padding: 1.5rem 2rem;
    ">
      <div style="
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        gap: 3rem;
        flex-wrap: wrap;
      ">
        @for (stat of stats; track stat.label) {
          <div style="text-align: center;">
            <div style="
              font-size: 1.75rem;
              font-weight: 800;
              color: #7c3aed;
              font-family: 'Inter', -apple-system, sans-serif;
              line-height: 1;
              margin-bottom: 0.25rem;
            ">{{ stat.value }}</div>
            <div style="
              font-size: 0.75rem;
              color: #8b949e;
              font-weight: 500;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            ">{{ stat.label }}</div>
          </div>
        }
      </div>
    </section>

    <!-- Featured Patterns Section -->
    <section style="padding: 3rem 2rem; max-width: 1100px; margin: 0 auto;">
      <div style="margin-bottom: 2rem;">
        <h2 style="
          font-size: 1.375rem;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0 0 0.375rem 0;
          font-family: 'Inter', -apple-system, sans-serif;
        ">Featured Patterns</h2>
        <p style="font-size: 0.875rem; color: #8b949e; margin: 0;">
          Popular patterns to get you started
        </p>
      </div>

      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.25rem;
      ">
        @for (pattern of featured(); track pattern.id) {
          <app-pattern-card [pattern]="pattern" />
        }
      </div>

      <!-- Browse All CTA -->
      <div style="margin-top: 2.5rem; text-align: center;">
        <a
          routerLink="/architectures"
          style="
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: transparent;
            color: #7c3aed;
            font-size: 0.9375rem;
            font-weight: 600;
            padding: 0.75rem 1.75rem;
            border-radius: 0.5rem;
            text-decoration: none;
            border: 1px solid #7c3aed;
            transition: background 0.15s ease, color 0.15s ease;
            font-family: 'Inter', -apple-system, sans-serif;
          "
          class="btn-browse"
        >
          Browse All Patterns →
        </a>
      </div>
    </section>
  `,
  styles: [`
    .btn-primary:hover {
      background: #6d28d9 !important;
      box-shadow: 0 4px 16px rgba(124, 58, 237, 0.35);
    }

    .btn-secondary:hover {
      background: rgba(59, 130, 246, 0.1) !important;
      color: #60a5fa !important;
    }

    .btn-browse:hover {
      background: rgba(124, 58, 237, 0.1) !important;
      color: #a78bfa !important;
    }
  `],
})
export class HomeComponent {
  private readonly architectureService = inject(ArchitectureService);

  readonly featured = this.architectureService.featured;

  readonly stats = [
    { value: '9', label: 'Patterns' },
    { value: '3', label: 'Difficulty Levels' },
    { value: '5', label: 'Comparison Metrics' },
  ];
}
