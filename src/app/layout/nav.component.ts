import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav style="
      background: #161b22;
      border-bottom: 1px solid #21262d;
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      height: 3rem;
      gap: 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    ">
      <a
        routerLink="/"
        style="
          font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
          font-size: 0.9rem;
          font-weight: 700;
          color: #7c3aed;
          text-decoration: none;
          letter-spacing: -0.02em;
          white-space: nowrap;
          margin-right: 1rem;
        "
      >
        &lt;ArchExplorer /&gt;
      </a>

      <div style="display: flex; align-items: center; gap: 0.25rem; flex: 1;">
        @for (link of navLinks; track link.path) {
          <a
            [routerLink]="link.path"
            routerLinkActive="nav-link-active"
            [routerLinkActiveOptions]="link.exact ? { exact: true } : {}"
            class="nav-link"
            style="
              font-size: 0.8125rem;
              font-weight: 500;
              color: #8b949e;
              text-decoration: none;
              padding: 0.375rem 0.75rem;
              border-radius: 0.375rem;
              transition: color 0.15s, background 0.15s;
              font-family: 'Inter', -apple-system, sans-serif;
            "
          >
            {{ link.label }}
          </a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .nav-link:hover {
      color: #e2e8f0 !important;
      background: #21262d !important;
    }

    :host ::ng-deep .nav-link-active {
      color: #3b82f6 !important;
      background: rgba(59, 130, 246, 0.1) !important;
    }

    :global(.nav-link-active) {
      color: #3b82f6 !important;
      background: rgba(59, 130, 246, 0.1) !important;
    }
  `],
})
export class NavComponent {
  readonly navLinks = [
    { label: 'Home', path: '/', exact: true },
    { label: 'Catalog', path: '/architectures', exact: false },
    { label: 'Compare', path: '/compare', exact: false },
    { label: 'Quiz', path: '/quiz', exact: false },
    { label: 'Favorites', path: '/favorites', exact: false },
  ];
}
