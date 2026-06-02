import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
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
