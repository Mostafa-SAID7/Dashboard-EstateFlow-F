import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Alert {
  id: string;
  type: 'occupancy' | 'maintenance' | 'payment' | 'lease';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  propertyId?: string;
  propertyAddress?: string;
  timestamp: Date;
}

@Component({
  selector: 'app-alert-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="surface-card p-5 sm:p-6">
      <div class="mb-5 flex items-center justify-between">
        <div><h2 class="text-base font-bold text-[var(--ink)]">Needs your attention</h2><p class="mt-1 text-xs text-[var(--ink-muted)]">Stay on top of important portfolio updates</p></div>
        <span class="rounded-lg bg-rose-100 px-2.5 py-1 text-[10px] font-bold text-rose-600 dark:bg-rose-950/40 dark:text-rose-300">{{ alerts.length }} open</span>
      </div>
      <div *ngIf="alerts.length === 0" class="flex items-center gap-3 rounded-xl bg-[var(--surface-muted)] px-4 py-3 text-sm text-[var(--ink-muted)]">
        <i class="pi pi-check-circle text-[var(--brand)]"></i> Everything looks good for now.
      </div>
      <div *ngIf="alerts.length > 0" class="grid gap-3 md:grid-cols-2">
        <div *ngFor="let alert of alerts" class="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50/70 p-3 dark:border-rose-900/40 dark:bg-rose-950/20">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300"><i class="pi pi-exclamation-triangle text-xs"></i></span>
          <div class="min-w-0 flex-1"><p class="text-sm font-semibold text-[var(--ink)]">{{ alert.title }}</p><p class="mt-1 text-xs text-[var(--ink-muted)]">{{ alert.message }}</p><p *ngIf="alert.propertyAddress" class="mt-1 truncate text-[10px] text-[var(--ink-muted)]">{{ alert.propertyAddress }}</p></div>
          <button (click)="dismissAlert(alert.id)" class="text-[var(--ink-muted)] transition hover:text-[var(--ink)]" aria-label="Dismiss alert"><i class="pi pi-times text-xs"></i></button>
        </div>
      </div>
    </section>
  `
})
export class AlertListComponent {
  @Input() alerts: Alert[] = [];
  @Output() alertDismissed = new EventEmitter<string>();

  dismissAlert(alertId: string): void {
    this.alertDismissed.emit(alertId);
  }
}