import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

interface ReportRecord {
  name: string;
  type: string;
  generated: string;
}

@Component({
  selector: 'app-report-history',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="surface-card overflow-hidden">
    <div class="border-b border-[var(--line)] px-5 py-4"><p class="eyebrow">Archive</p><h2 class="mt-1 text-base font-bold text-[var(--ink)]">Report history</h2></div>
    <p-table [value]="reports" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">Report Name <p-sortIcon field="name"></p-sortIcon></th>
          <th pSortableColumn="type">Type <p-sortIcon field="type"></p-sortIcon></th>
          <th pSortableColumn="generated">Generated <p-sortIcon field="generated"></p-sortIcon></th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-report>
        <tr>
          <td>{{ report.name }}</td>
          <td>{{ report.type }}</td>
          <td>{{ report.generated }}</td>
          <td>
            <p-button
              icon="pi pi-download"
              [rounded]="true"
              [text]="true"
              severity="info"
              pTooltip="Download"
              tooltipPosition="top"
              class="mr-2">
            </p-button>
            <p-button
              icon="pi pi-trash"
              [rounded]="true"
              [text]="true"
              severity="danger"
              pTooltip="Delete"
              tooltipPosition="top">
            </p-button>
          </td>
        </tr>
      </ng-template>
    </p-table>
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
