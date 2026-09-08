import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-divider',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="getDividerClasses()">
      <span *ngIf="label" class="px-3 text-sm text-[var(--ink-muted)]">
        {{ label }}
      </span>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      margin: 1rem 0;
    }
  `]
})
export class DividerComponent {
  @Input() label?: string;
  @Input() vertical = false;

  getDividerClasses(): string {
    if (this.vertical) {
      return 'flex items-center h-8 mx-2 border-l border-[var(--line)]';
    }
    return `flex items-center gap-3 my-4 ${this.label ? 'before:flex-1 after:flex-1' : ''} 
            before:content-[''] before:h-px before:bg-[var(--line)] 
            after:content-[''] after:h-px after:bg-[var(--line)]`;
  }
}
