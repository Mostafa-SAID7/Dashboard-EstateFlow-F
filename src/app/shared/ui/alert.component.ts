import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="getAlertClasses()" role="alert">
      <i [class]="'pi ' + getIcon() + ' text-lg flex-shrink-0'"></i>
      <div class="flex-1 min-w-0">
        <p class="font-semibold">{{ title }}</p>
        <p class="text-sm mt-0.5">
          <ng-content></ng-content>
        </p>
      </div>
      <button 
        *ngIf="closable"
        (click)="onClose.emit()"
        class="flex-shrink-0 -mr-1 opacity-70 hover:opacity-100 transition"
        aria-label="Close alert">
        <i class="pi pi-times"></i>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'info';
  @Input() title = '';
  @Input() closable = false;
  @Output() onClose = new EventEmitter<void>();

  getAlertClasses(): string {
    let classes = 'flex items-start gap-3 rounded-lg p-4 border ';

    switch (this.variant) {
      case 'success':
        classes += 'bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-900 dark:text-green-100 ';
        break;
      case 'warning':
        classes += 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-950 dark:border-yellow-900 dark:text-yellow-100 ';
        break;
      case 'danger':
        classes += 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950 dark:border-rose-900 dark:text-rose-100 ';
        break;
      case 'info':
      default:
        classes += 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-900 dark:text-blue-100 ';
    }

    return classes;
  }

  getIcon(): string {
    switch (this.variant) {
      case 'success':
        return 'pi-check-circle';
      case 'warning':
        return 'pi-exclamation-circle';
      case 'danger':
        return 'pi-exclamation-triangle';
      case 'info':
      default:
        return 'pi-info-circle';
    }
  }
}
