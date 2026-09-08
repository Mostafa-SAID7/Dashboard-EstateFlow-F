import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from '../../../shared/ui/tooltip.component';

interface ReportRecord {
  name: string;
  type: string;
  generated: string;
}

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [CommonModule, TooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="data-table">
      <div class="border-b border-[var(--line)] px-5 py-4 sm:px-6">
        <p class="eyebrow mb-2">Archive</p>
        <h2 class="mt-1 text-base font-bold text-[var(--ink)]">Report history</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[var(--line)]">
              <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Report Name</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Type</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Generated</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let report of reports; let last = last" 
                [ngClass]="!last ? 'border-b border-[var(--line)]' : ''">
              <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ report.name }}</td>
              <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ report.type }}</td>
              <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ report.generated }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <app-tooltip text="Download report" position="top">
                    <button class="icon-button p-0 h-9 w-9" aria-label="Download report">
                      <i class="pi pi-download text-base"></i>
                    </button>
                  </app-tooltip>
                  <app-tooltip text="Delete report" position="top">
                    <button class="icon-button p-0 h-9 w-9 text-rose-600 dark:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950" aria-label="Delete report">
                      <i class="pi pi-trash text-base"></i>
                    </button>
                  </app-tooltip>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="reports.length === 0" class="py-12 text-center px-4">
        <i class="pi pi-inbox text-4xl text-[var(--ink-muted)] mb-4 block"></i>
        <p class="text-sm text-[var(--ink-muted)]">No reports yet. Generate one to get started.</p>
      </div>
    </div>
  `
})
export class ReportHistoryComponent {
  reports: ReportRecord[] = [
    {
      name: 'Q4 2024 Revenue Report',
      type: 'Revenue',
      generated: 'Dec 15, 2024'
    }
  ];
}
