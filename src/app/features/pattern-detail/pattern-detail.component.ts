import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArchitectureService } from '../../core/services/architecture.service';
import { ArchitecturePattern } from '../../core/models/architecture-pattern.model';
import { CodeViewerComponent } from '../../shared/components/code-viewer/code-viewer.component';
import { DiagramComponent } from '../../shared/components/diagram/diagram.component';

type TabId = 'overview' | 'diagram' | 'code' | 'interview';

interface Tab {
  id: TabId;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-pattern-detail',
  standalone: true,
  imports: [RouterLink, CodeViewerComponent, DiagramComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pattern-detail.component.html',
  styleUrl: './pattern-detail.component.css',
})
export class PatternDetailComponent implements OnInit {
  // Inputs / Outputs for parent wiring (Task 4)
  readonly patternIsFavorite = input<boolean>(false);
  readonly favoriteToggle = output<string>();

  private readonly route = inject(ActivatedRoute);
  private readonly architectureService = inject(ArchitectureService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pattern = signal<ArchitecturePattern | undefined>(undefined);
  readonly notFound = signal(false);
  readonly activeTab = signal<TabId>('overview');

  readonly tabs: Tab[] = [
    { id: 'overview',  label: 'Overview',  icon: '⚡' },
    { id: 'diagram',   label: 'Diagram',   icon: '◈' },
    { id: 'code',      label: 'Code',      icon: '</>' },
    { id: 'interview', label: 'Interview', icon: '💬' },
  ];

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const slug = params.get('slug');
        if (!slug) {
          this.notFound.set(true);
          return;
        }
        const found = this.architectureService.getBySlug(slug);
        if (found) {
          this.pattern.set(found);
          this.notFound.set(false);
          this.activeTab.set('overview');
        } else {
          this.pattern.set(undefined);
          this.notFound.set(true);
        }
      });
  }

  setTab(tab: TabId): void {
    this.activeTab.set(tab);
  }

  onFavoriteToggle(): void {
    const p = this.pattern();
    if (p) {
      this.favoriteToggle.emit(p.id);
    }
  }

  difficultyClass(difficulty: ArchitecturePattern['difficulty']): string {
    switch (difficulty) {
      case 'Beginner':     return 'badge badge-beginner';
      case 'Intermediate': return 'badge badge-intermediate';
      case 'Advanced':     return 'badge badge-advanced';
    }
  }

  readonly interviewLines = computed(() => {
    const p = this.pattern();
    if (!p) return [];
    return p.interviewAnswer.split('\n').filter(line => line.trim().length > 0);
  });
}