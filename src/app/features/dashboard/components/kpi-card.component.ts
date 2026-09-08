import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article class="surface-card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-25px_rgba(8,50,35,.45)]">
      <div class="mb-7 flex items-start justify-between">
        <p class="text-xs font-semibold text-[var(--ink-muted)]">{{ label }}</p>
        <span class="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] transition group-hover:bg-[var(--brand-dark)] group-hover:text-white">
          <i [class]="icon + ' text-sm'"></i>
        </span>
      </div>
      <p class="font-display text-[2rem] font-bold tracking-tight text-[var(--ink)]">{{ formattedValue }}</p>
      <div class="mt-3 flex items-center gap-1.5 text-[11px]" [ngClass]="trendClass">
        <span class="flex h-4 w-4 items-center justify-center rounded-full bg-current/10"><i [class]="trendIconClass + ' text-[8px]'"></i></span>
        <span>{{ trendText }}</span>
      </div>
      <div class="absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-[var(--brand-soft)] opacity-60 blur-2xl transition group-hover:opacity-100"></div>
    </article>
  `
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() icon = 'pi pi-chart-line';
  @Input() trend = 0;
  @Input() format: 'number' | 'currency' | 'percent' = 'number';
  @Input() borderColor: 'blue' | 'green' | 'orange' | 'red' | 'purple' = 'blue';

  get formattedValue(): string {
    if (this.format === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(this.value);
    }
    if (this.format === 'percent') return `${this.value.toFixed(1)}%`;
    return new Intl.NumberFormat('en-US').format(this.value);
  }

  get trendText(): string {
    if (this.trend > 0) return `+${this.trend.toFixed(1)}% from last month`;
    if (this.trend < 0) return `${Math.abs(this.trend).toFixed(1)}% from last month`;
    return 'No change from last month';
  }

  get trendClass(): string {
    return this.trend >= 0 ? 'text-[var(--brand)]' : 'text-rose-600 dark:text-rose-300';
  }

  get trendIconClass(): string {
    return this.trend >= 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down';
  }

  get iconContainerClass(): string {
    const colors = {
      blue: 'bg-[var(--brand-soft)] text-[var(--brand)]',
      green: 'bg-[var(--brand-soft)] text-[var(--brand)]',
      orange: 'bg-[#f5e8c9] text-[#997219]',
      red: 'bg-[#f5e0d9] text-[#b56855]',
      purple: 'bg-[#eee4f5] text-[#7f56ad]'
    };
    return colors[this.borderColor];
  }
}