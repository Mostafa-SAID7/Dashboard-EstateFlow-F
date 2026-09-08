import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="getCardClasses()">
      <div *ngIf="title" class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-[var(--ink)]">{{ title }}</h3>
        <ng-content select="[slot='header-right']"></ng-content>
      </div>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() padding: 'sm' | 'md' | 'lg' = 'md';
  @Input() shadow: 'sm' | 'md' | 'lg' = 'md';
  @Input() hoverable = false;

  getCardClasses(): string {
    let classes = 'rounded-[1.25rem] border border-[var(--line)] bg-[var(--surface)] transition-all duration-300 ';

    // Padding
    switch (this.padding) {
      case 'sm':
        classes += 'p-3 sm:p-4 ';
        break;
      case 'lg':
        classes += 'p-6 sm:p-8 ';
        break;
      case 'md':
      default:
        classes += 'p-4 sm:p-6 ';
    }

    // Shadow
    switch (this.shadow) {
      case 'sm':
        classes += 'shadow-[0_1px_2px_0_rgba(25,43,35,0.04)] ';
        break;
      case 'lg':
        classes += 'shadow-[0_16px_35px_-16px_rgba(25,43,35,0.22)] ';
        break;
      case 'md':
      default:
        classes += 'shadow-[0_12px_30px_-26px_rgba(15,35,25,0.6)] ';
    }

    // Hoverable
    if (this.hoverable) {
      classes += 'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ';
    }

    return classes;
  }
}
