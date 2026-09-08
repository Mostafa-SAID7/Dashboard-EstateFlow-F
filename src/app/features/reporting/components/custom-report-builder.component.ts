import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { DatePickerComponent } from '../../../shared/ui/date-picker.component';
import { SelectComponent } from '../../../shared/ui/select.component';
import { TooltipComponent } from '../../../shared/ui/tooltip.component';
import { ModalComponent } from '../../../shared/ui/modal.component';
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
    ButtonComponent,
    DatePickerComponent,
    SelectComponent,
    TooltipComponent,
    ModalComponent,
    MetricsSelectorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-card mb-8">
      <!-- Header -->
      <div class="mb-8 pb-6 border-b border-[var(--line)]">
        <p class="eyebrow mb-3">Build your own</p>
        <h1 class="text-xl font-bold text-[var(--ink)]">Custom report builder</h1>
        <p class="mt-2 text-sm text-[var(--ink-muted)]">Select your date range, properties, and metrics to generate a custom report.</p>
      </div>
      
      <form [formGroup]="form" (ngSubmit)="onGenerate()" class="space-y-6">
        
        <!-- Date Range Section -->
        <section class="space-y-4">
          <div class="mb-3 flex items-center gap-2">
            <p class="eyebrow">Date range</p>
            <app-tooltip text="Select the date period for your report analysis" position="right">
              <i class="pi pi-info-circle text-sm text-[var(--ink-muted)] cursor-help"></i>
            </app-tooltip>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Start Date -->
            <div class="field">
              <label class="block eyebrow mb-2">Start date</label>
              <app-date-picker
                formControlName="startDate"
                [minDate]="minDate"
                [maxDate]="today"
                [required]="true"
                placeholder="Select date"
                error="">
              </app-date-picker>
            </div>

            <!-- End Date -->
            <div class="field">
              <label class="block eyebrow mb-2">End date</label>
              <app-date-picker
                formControlName="endDate"
                [minDate]="minDate"
                [maxDate]="today"
                [required]="true"
                placeholder="Select date"
                error="">
              </app-date-picker>
            </div>
          </div>
          <p *ngIf="dateRangeError()" class="mt-2 text-xs text-rose-600 font-medium">
            End date must be after start date
          </p>
        </section>

        <!-- Properties Section -->
        <section class="space-y-4">
          <div class="mb-3 flex items-center gap-2">
            <p class="eyebrow">Properties</p>
            <app-tooltip text="Choose which properties to include in your report" position="right">
              <i class="pi pi-info-circle text-sm text-[var(--ink-muted)] cursor-help"></i>
            </app-tooltip>
          </div>
          <div class="field">
            <app-select
              formControlName="properties"
              [options]="propertyOptions"
              placeholder="Select properties"
              [error]="form.get('properties')?.hasError('required') && form.get('properties')?.touched ? 'Please select properties' : ''">
            </app-select>
          </div>
        </section>

        <!-- Metrics Section -->
        <section class="space-y-4">
          <app-metrics-selector
            [selectedMetrics]="selectedMetrics"
            (metricsChange)="onMetricsChange($event)">
          </app-metrics-selector>
        </section>

        <!-- Action Buttons -->
        <div class="flex gap-3 pt-6 border-t border-[var(--line)]">
          <app-button 
            variant="secondary"
            size="md"
            icon="pi pi-eye"
            label="Preview"
            [disabled]="!form.valid"
            (click)="onPreview()">
          </app-button>
          <app-button 
            variant="primary"
            size="md"
            icon="pi pi-download"
            label="Generate report"
            [disabled]="!form.valid"
            (click)="onGenerate()">
          </app-button>
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

  today = new Date();
  minDate = new Date(new Date().getFullYear() - 5, 0, 1);

  onMetricsChange(metrics: string[]): void {
    this.selectedMetrics = metrics;
  }

  dateRangeError(): boolean {
    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;
    
    if (startDate && endDate && startDate > endDate) {
      return true;
    }
    return false;
  }

  onPreview(): void {
    if (this.form.valid && !this.dateRangeError()) {
      this.preview.emit();
    }
  }

  onGenerate(): void {
    if (this.form.valid && !this.dateRangeError()) {
      this.generate.emit();
    }
  }
}
