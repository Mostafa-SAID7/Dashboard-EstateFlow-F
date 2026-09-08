import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { FinancialService } from '../../services/financial.service';
import { selectFinancialSummary, selectFinancialsIsLoading } from '../../store/financials/financials.selectors';
import { loadFinancialSummary } from '../../store/financials/financials.actions';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-financial-analytics',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SelectModule, ButtonModule, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in space-y-6">
        <!-- Header -->
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p class="eyebrow mb-2">Portfolio intelligence</p><h1 class="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">Financial analytics</h1><p class="mt-1 text-sm text-[var(--ink-muted)]">Understand the health of your portfolio at a glance.</p></div>
          <button class="btn-secondary"><i class="pi pi-download text-xs"></i> Export report</button>
        </div>

        <!-- Period Selector -->
        <div class="dashboard-card">
          <form [formGroup]="periodForm" class="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div class="flex-1">
               <label for="period" class="eyebrow mb-2 block">Period</label>
              <p-select
                id="period"
                formControlName="period"
                [options]="periodOptions"
                optionLabel="label"
                optionValue="value">
              </p-select>
            </div>
            <button type="button" class="btn-primary" (click)="loadMetrics()"><i class="pi pi-refresh text-xs"></i> Load data</button>
          </form>
        </div>

        <!-- Summary Metrics -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article class="dashboard-card"><p class="text-xs font-semibold text-[var(--ink-muted)]">Total revenue</p><p class="mt-6 font-display text-3xl font-bold text-[var(--ink)]">{{ totalRevenue() | currency }}</p><p class="mt-2 text-[11px] font-semibold text-[var(--brand)]">+12% from last period</p></article>
          <article class="dashboard-card"><p class="text-xs font-semibold text-[var(--ink-muted)]">Total expenses</p><p class="mt-6 font-display text-3xl font-bold text-[var(--ink)]">{{ totalExpenses() | currency }}</p><p class="mt-2 text-[11px] font-semibold text-[#b56855]">+5% from last period</p></article>
          <article class="dashboard-card bg-[var(--brand-dark)] text-white"><p class="text-xs font-semibold text-emerald-100/70">Net profit</p><p class="mt-6 font-display text-3xl font-bold">{{ netProfit() | currency }}</p><p class="mt-2 text-[11px] font-semibold text-emerald-200">+18% from last period</p></article>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="dashboard-card">
              <h2 class="text-base font-bold text-[var(--ink)]">Revenue breakdown</h2>
            <div class="mt-5 flex h-56 items-end gap-3 border-b border-[var(--line)] pb-0">
              <div *ngFor="let height of [38,54,48,72,62,82,94]" class="flex-1 rounded-t-full bg-[var(--brand-soft)] transition hover:bg-[var(--brand)]" [style.height.%]="height"></div>
            </div>
          </div>
          <div class="dashboard-card">
              <h2 class="text-base font-bold text-[var(--ink)]">Expense breakdown</h2>
            <div class="mt-5 flex h-56 items-center justify-center"><div class="relative flex h-36 w-36 items-center justify-center rounded-full" style="background: conic-gradient(var(--brand) 0 62%, #f1d2c9 62% 80%, var(--surface-muted) 80% 100%)"><div class="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[var(--surface)]"><span class="font-display text-xl font-bold text-[var(--ink)]">62%</span><span class="text-[10px] text-[var(--ink-muted)]">Operations</span></div></div></div>
            </div>
        </div>

        <!-- ROI and Cash Flow -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div class="dashboard-card">
              <h2 class="text-base font-bold text-[var(--ink)]">ROI by property</h2>
            <div class="mt-5 h-56 space-y-4 pt-3"><div *ngFor="let roiBar of [78,62,54,42]" class="flex items-center gap-3"><span class="w-12 text-[10px] text-[var(--ink-muted)]">Asset {{ roiBar / 10 }}</span><div class="h-2 flex-1 rounded-full bg-[var(--surface-muted)]"><div class="h-full rounded-full bg-[var(--brand)]" [style.width.%]="roiBar"></div></div><span class="text-[10px] font-bold text-[var(--ink)]">{{ roiBar / 5 | number:'1.0-0' }}%</span></div></div>
            </div>
          <div class="dashboard-card">
              <h2 class="text-base font-bold text-[var(--ink)]">Cash flow analysis</h2>
            <div class="mt-5 flex h-56 items-center justify-center rounded-2xl bg-[var(--surface-muted)]"><p class="text-xs text-[var(--ink-muted)]"><i class="pi pi-chart-line mr-2 text-[var(--brand)]"></i>Cash flow trends will appear here</p></div>
            </div>
        </div>

        <!-- Export Section -->
        <div class="dashboard-card">
            <h2 class="text-base font-bold text-[var(--ink)]">Export report</h2>
          <div class="mt-4 flex flex-wrap gap-2">
            <button class="btn-primary" (click)="exportPDF()"><i class="pi pi-file-pdf text-xs"></i> PDF</button>
            <button class="btn-secondary" (click)="exportExcel()"><i class="pi pi-file-excel text-xs"></i> Excel</button>
            <button class="btn-secondary" (click)="exportCSV()"><i class="pi pi-file text-xs"></i> CSV</button>
          </div>
        </div>
      </div>
  `
})
export class FinancialAnalyticsComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);

  periodForm: FormGroup;
  financialMetrics$: Observable<any>;
  isLoading$: Observable<boolean>;

  // Signals for metrics
  totalRevenue = signal<number>(0);
  totalExpenses = signal<number>(0);
  netProfit = computed(() => this.totalRevenue() - this.totalExpenses());

  periodOptions = [
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  constructor() {
    this.periodForm = this.fb.group({
      period: ['month']
    });

    this.financialMetrics$ = this.store.select(selectFinancialSummary);
    this.isLoading$ = this.store.select(selectFinancialsIsLoading);
  }

  ngOnInit(): void {
    this.loadMetrics();
    this.financialMetrics$.subscribe(metrics => {
      if (metrics) {
        this.totalRevenue.set(metrics.totalRevenue || 0);
        this.totalExpenses.set(metrics.totalExpenses || 0);
      }
    });
  }

  loadMetrics(): void {
    this.store.dispatch(loadFinancialSummary({}));
  }

  exportPDF(): void {
    console.log('Export as PDF');
  }

  exportExcel(): void {
    console.log('Export as Excel');
  }

  exportCSV(): void {
    console.log('Export as CSV');
  }
}
