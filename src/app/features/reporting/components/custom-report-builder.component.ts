import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MetricsSelectorComponent } from './metrics-selector.component';

interface PropertyOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-custom-report-builder',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CalendarModule,
    SelectModule,
    ButtonModule,
    CardModule,
    MetricsSelectorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-card mb-8">
        <p class="eyebrow">Build your own</p><h2 class="mt-1 text-base font-bold text-[var(--ink)]">Custom report builder</h2>
      <form [formGroup]="form" class="space-y-4">
        <!-- Date Range Picker -->
        <fieldset class="border-0 p-0 m-0">
          <legend class="sr-only">Date Range</legend>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col">
              <label for="startDate" class="eyebrow mb-2">Start date</label>
              <p-calendar
                id="startDate"
                formControlName="startDate"
                [showIcon]="true"
                dateFormat="mm/dd/yy">
              </p-calendar>
            </div>
            <div class="flex flex-col">
              <label for="endDate" class="eyebrow mb-2">End date</label>
              <p-calendar
                id="endDate"
                formControlName="endDate"
                [showIcon]="true"
                dateFormat="mm/dd/yy">
              </p-calendar>
            </div>
          </div>
        </fieldset>

        <div class="flex flex-col">
          <label for="properties" class="eyebrow mb-2">Properties</label>
          <p-select
            id="properties"
            formControlName="properties"
            [options]="propertyOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Select properties">
          </p-select>
        </div>

        <!-- Metrics Selection -->
        <app-metrics-selector
          [selectedMetrics]="selectedMetrics"
          (metricsChange)="onMetricsChange($event)">
        </app-metrics-selector>

        <!-- Action Buttons -->
        <div class="flex flex-wrap gap-2 pt-4">
          <button type="button" class="btn-secondary" (click)="onPreview()"><i class="pi pi-eye text-xs"></i> Preview</button>
          <button type="button" class="btn-primary" (click)="onGenerate()"><i class="pi pi-download text-xs"></i> Generate report</button>
        </div>
      </form>
    </div>
  `
})
export class CustomReportBuilderComponent {
  @Input() form!: FormGroup;
  @Input() propertyOptions: PropertyOption[] = [];
  @Input() selectedMetrics: string[] = [];
  @Output() preview = new EventEmitter<void>();
  @Output() generate = new EventEmitter<void>();

  onMetricsChange(metrics: string[]): void {
    this.selectedMetrics = metrics;
  }

  onPreview(): void {
    if (this.form.valid) {
      this.preview.emit();
    }
  }

  onGenerate(): void {
    if (this.form.valid) {
      this.generate.emit();
    }
  }
}
