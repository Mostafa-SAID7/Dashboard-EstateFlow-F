import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center gap-4 py-12 px-4">
      <div class="flex h-16 w-16 items-center justify-center rounded-full 
                  bg-[var(--surface-muted)]">
        <i [class]="'pi ' + icon + ' text-2xl text-[var(--ink-muted)]'"></i>
      </div>
      <div class="text-center max-w-md">
        <h3 class="font-semibold text-[var(--ink)] text-lg">{{ title }}</h3>
        <p class="text-sm text-[var(--ink-muted)] mt-1">{{ description }}</p>
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
export class EmptyStateComponent {
  @Input() title = 'No data found';
  @Input() description = 'Try adjusting your filters or search terms';
  @Input() icon = 'pi-inbox';
}
