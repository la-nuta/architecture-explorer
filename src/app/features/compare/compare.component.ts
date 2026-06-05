import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ArchitectureService } from '../../core/services/architecture.service';
import { ComparisonService } from '../../core/services/comparison.service';
import { ArchitecturePattern } from '../../core/models/architecture-pattern.model';
import { RatingBarComponent } from '../../shared/components/rating-bar/rating-bar.component';
import { BadgeComponent } from '../../shared/components/badge/badge.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

interface ComparisonRow {
  label: string;
  left: string;
  right: string;
}

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [FormsModule, RatingBarComponent, BadgeComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css',
})
export class CompareComponent {
  private readonly architectureService = inject(ArchitectureService);
  private readonly comparisonService = inject(ComparisonService);

  readonly allPatterns = this.architectureService.patterns;

  readonly leftId = toSignal(this.comparisonService.leftId$, { initialValue: '' });
  readonly rightId = toSignal(this.comparisonService.rightId$, { initialValue: '' });

  readonly leftPattern = computed<ArchitecturePattern | null>(() =>
    this.allPatterns().find(p => p.id === this.leftId()) ?? null
  );

  readonly rightPattern = computed<ArchitecturePattern | null>(() =>
    this.allPatterns().find(p => p.id === this.rightId()) ?? null
  );

  readonly patternsForLeft = computed(() =>
    this.allPatterns().filter(p => p.id !== this.rightId())
  );

  readonly patternsForRight = computed(() =>
    this.allPatterns().filter(p => p.id !== this.leftId())
  );

  readonly canCompare = computed(() =>
    !!this.leftPattern() && !!this.rightPattern() && this.leftId() !== this.rightId()
  );

  readonly comparisonRows = computed<ComparisonRow[]>(() => {
    const left = this.leftPattern();
    const right = this.rightPattern();
    if (!left || !right) return [];
    return [
      { label: 'Complexity',             left: left.comparison.complexity,            right: right.comparison.complexity },
      { label: 'Scalability',            left: left.comparison.scalability,           right: right.comparison.scalability },
      { label: 'Team Size',              left: left.comparison.teamSize,              right: right.comparison.teamSize },
      { label: 'Deployment Complexity',  left: left.comparison.deploymentComplexity,  right: right.comparison.deploymentComplexity },
      { label: 'Testing Complexity',     left: left.comparison.testingComplexity,     right: right.comparison.testingComplexity },
    ];
  });

  setLeft(id: string): void {
    this.comparisonService.setLeft(id);
  }

  setRight(id: string): void {
    this.comparisonService.setRight(id);
  }

  swap(): void {
    const l = this.leftId();
    const r = this.rightId();
    this.comparisonService.setLeft(r);
    this.comparisonService.setRight(l);
  }
}