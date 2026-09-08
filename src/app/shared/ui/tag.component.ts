import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type TagVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="getTagClasses()">
      <ng-content></ng-content>
      <button 
        *ngIf="removable"
        (click)="onRemove.emit()"
        class="ml-1.5 -mr-1 opacity-70 hover:opacity-100 transition"
        aria-label="Remove tag">
        <i class="pi pi-times text-xs"></i>
      </button>
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class TagComponent {
  @Input() variant: TagVariant = 'default';
  @Input() removable = false;
  @Output() onRemove = new EventEmitter<void>();

  getTagClasses(): string {
    let classes = 'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ';

    switch (this.variant) {
      case 'primary':
        classes += 'bg-[var(--brand-soft)] text-[var(--brand-dark)] ';
        break;
      case 'secondary':
        classes += 'bg-[var(--surface-muted)] text-[var(--ink)] border border-[var(--line)] ';
        break;
      case 'success':
        classes += 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 ';
        break;
      case 'warning':
        classes += 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100 ';
        break;
      case 'danger':
        classes += 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100 ';
        break;
      case 'default':
      default:
        classes += 'bg-[var(--surface-muted)] text-[var(--ink-muted)] ';
    }

    if (this.removable) {
      classes += 'cursor-pointer hover:opacity-80 ';
    }

    return classes;
  }
}
