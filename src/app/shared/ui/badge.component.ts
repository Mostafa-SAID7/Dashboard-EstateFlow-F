import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'default';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="getBadgeClasses()">
      <i *ngIf="icon" [class]="'pi ' + icon + ' mr-1'"></i>
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() icon?: string;

  getBadgeClasses(): string {
    let classes = 'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ';

    switch (this.variant) {
      case 'success':
        classes += 'bg-[var(--brand-soft)] text-[var(--brand-dark)] ';
        break;
      case 'warning':
        classes += 'bg-[#f5e8c9] text-[#997219] ';
        break;
      case 'danger':
        classes += 'bg-[#f5e0d9] text-[#a95d4e] ';
        break;
      case 'info':
        classes += 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 ';
        break;
      case 'default':
      default:
        classes += 'bg-[var(--surface-muted)] text-[var(--ink-muted)] ';
    }

    return classes;
  }
}
