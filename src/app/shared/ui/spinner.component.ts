import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type SpinnerSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center justify-center">
      <div [class]="getSpinnerClasses()">
        <i class="pi pi-spinner animate-spin"></i>
      </div>
      <span *ngIf="text" class="ml-3 text-sm text-[var(--ink-muted)]">
        {{ text }}
      </span>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class SpinnerComponent {
  @Input() size: SpinnerSize = 'md';
  @Input() text?: string;

  getSpinnerClasses(): string {
    let classes = 'animate-spin text-[var(--brand)] ';

    switch (this.size) {
      case 'sm':
        classes += 'text-base ';
        break;
      case 'lg':
        classes += 'text-4xl ';
        break;
      case 'md':
      default:
        classes += 'text-2xl ';
    }

    return classes;
  }
}
