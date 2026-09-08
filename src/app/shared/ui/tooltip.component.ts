import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative inline-block cursor-help">
      <ng-content></ng-content>
      <div [class]="getTooltipClasses()">
        {{ text }}
        <div [class]="getArrowClasses()"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class TooltipComponent {
  @Input() text = '';
  @Input() position: TooltipPosition = 'top';

  getTooltipClasses(): string {
    let classes = 'absolute hidden group-hover:block bg-[var(--ink)] text-white text-xs rounded-lg ' +
                  'px-3 py-1.5 whitespace-nowrap z-50 transition-opacity opacity-0 group-hover:opacity-100 ';

    switch (this.position) {
      case 'right':
        classes += 'left-full ml-2 top-1/2 -translate-y-1/2 ';
        break;
      case 'bottom':
        classes += 'top-full mt-2 left-1/2 -translate-x-1/2 ';
        break;
      case 'left':
        classes += 'right-full mr-2 top-1/2 -translate-y-1/2 ';
        break;
      case 'top':
      default:
        classes += 'bottom-full mb-2 left-1/2 -translate-x-1/2 ';
    }

    return classes;
  }

  getArrowClasses(): string {
    let classes = 'absolute w-2 h-2 bg-[var(--ink)] transform rotate-45 ';

    switch (this.position) {
      case 'right':
        classes += '-left-1 top-1/2 -translate-y-1/2 ';
        break;
      case 'bottom':
        classes += '-top-1 left-1/2 -translate-x-1/2 ';
        break;
      case 'left':
        classes += '-right-1 top-1/2 -translate-y-1/2 ';
        break;
      case 'top':
      default:
        classes += '-bottom-1 left-1/2 -translate-x-1/2 ';
    }

    return classes;
  }
}
