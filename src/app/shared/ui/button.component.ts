import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      [class]="getButtonClasses()"
      [disabled]="disabled"
      [type]="type"
      [attr.aria-label]="ariaLabel"
      (click)="onClick.emit($event)">
      <i *ngIf="icon" [class]="'pi ' + icon"></i>
      <span *ngIf="label">{{ label }}</span>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() label?: string;
  @Input() icon?: string;
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() ariaLabel?: string;
  @Output() onClick = new EventEmitter<MouseEvent>();

  getButtonClasses(): string {
    let classes = '';

    // Base classes
    classes += 'inline-flex items-center justify-center gap-2 rounded-full transition ';

    // Size
    switch (this.size) {
      case 'sm':
        classes += 'px-3 py-1.5 text-xs ';
        break;
      case 'lg':
        classes += 'px-6 py-3 text-base ';
        break;
      case 'md':
      default:
        classes += 'px-5 py-2.5 text-sm ';
    }

    // Variant
    switch (this.variant) {
      case 'primary':
        classes += 'bg-[var(--brand-dark)] text-white shadow-[0_12px_22px_-14px_var(--brand-dark)] hover:-translate-y-0.5 hover:bg-[var(--brand)] hover:shadow-lg ';
        break;
      case 'secondary':
        classes += 'border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)] ';
        break;
      case 'danger':
        classes += 'bg-rose-600 text-white hover:-translate-y-0.5 hover:bg-rose-700 ';
        break;
      case 'ghost':
        classes += 'bg-transparent text-[var(--ink-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--ink)] ';
        break;
    }

    return classes;
  }
}
