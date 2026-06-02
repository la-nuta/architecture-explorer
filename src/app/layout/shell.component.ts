import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './nav.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shell.component.html',
})
export class ShellComponent {}
