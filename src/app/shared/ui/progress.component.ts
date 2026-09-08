import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="w-full">
      <div class="flex items-center justify-between mb-2" *ngIf="label || showValue">
        <label class="text-sm font-medium text-[var(--ink)]">{{ label }}</label>
        <span class="text-xs font-semibold text-[var(--ink-muted)]" *ngIf="showValue">
          {{ value }}%
        </span>
      </div>
      <div class="h-2 rounded-full overflow-hidden bg-[var(--surface-muted)]">
        <div 
          [style.width.%]="value"
          [class]="getProgressClasses()">
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProgressComponent {
  @Input() value = 0;
  @Input() label?: string;
  @Input() showValue = true;
  @Input() variant: ProgressVariant = 'primary';

  getProgressClasses(): string {
    let classes = 'h-full transition-all duration-300 ';

    switch (this.variant) {
      case 'success':
        classes += 'bg-green-500 ';
        break;
      case 'warning':
        classes += 'bg-yellow-500 ';
        break;
      case 'danger':
        classes += 'bg-rose-500 ';
        break;
      case 'primary':
      default:
        classes += 'bg-[var(--brand-dark)] ';
    }

    return classes;
  }
}
