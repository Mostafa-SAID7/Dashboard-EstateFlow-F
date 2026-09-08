import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-report-templates',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mb-8">
      <div class="mb-4"><p class="eyebrow">Quick start</p><h2 class="mt-1 text-base font-bold text-[var(--ink)]">Pre-built templates</h2></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div *ngFor="let template of templates; let i = index" class="surface-card group flex min-h-44 flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
          <div><span class="mb-4 flex h-9 w-9 items-center justify-center rounded-xl" [ngClass]="i % 2 === 0 ? 'bg-[var(--brand-soft)] text-[var(--brand)]' : 'bg-[#f5e0d9] text-[#b56855]'"><i [class]="i % 2 === 0 ? 'pi pi-chart-bar' : 'pi pi-file-edit'"></i></span><h3 class="text-sm font-bold text-[var(--ink)]">{{ template.title }}</h3><p class="mt-1 text-xs leading-5 text-[var(--ink-muted)]">{{ template.description }}</p></div>
          <button class="mt-4 flex items-center gap-2 text-xs font-bold text-[var(--brand)] hover:underline">Generate <i class="pi pi-arrow-right text-[10px]"></i></button>
        </div>
      </div>
    </div>
  `
})
export class ReportTemplatesComponent {
  templates = [
    {
      title: 'Occupancy Report',
      description: 'View occupancy metrics and trends'
    },
    {
      title: 'Revenue Report',
      description: 'Detailed revenue analysis'
    },
    {
      title: 'Maintenance Report',
      description: 'Work order and maintenance summary'
    },
    {
      title: 'Tenant Report',
      description: 'Tenant information and leases'
    }
  ];
}
