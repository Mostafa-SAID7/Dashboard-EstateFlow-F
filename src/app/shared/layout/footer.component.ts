import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="mt-12 border-t border-[var(--line)] bg-[var(--surface)] py-5 text-[var(--ink-muted)]">
      <div class="mx-auto max-w-[1500px] px-6">
        <div class="text-center text-xs">
          <p>&copy; 2024 EstateFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
