import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div style="
      background: #0d1117;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    ">
      <app-nav />
      <main style="flex: 1; display: flex; flex-direction: column;">
        <router-outlet />
      </main>
    </div>
  `,
})
export class ShellComponent {}
