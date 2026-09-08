import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportTemplatesComponent } from './components/report-templates.component';
import { CustomReportBuilderComponent } from './components/custom-report-builder.component';
import { ReportHistoryComponent } from './components/report-history.component';
import { MetricsSelectorComponent } from './components/metrics-selector.component';

interface PropertyOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReportTemplatesComponent,
    CustomReportBuilderComponent,
    ReportHistoryComponent,
    MetricsSelectorComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reporting.component.html'
})
export class ReportingComponent {
  private fb = inject(FormBuilder);
  customReportForm: FormGroup;
  selectedMetrics: string[] = [];

  propertyOptions: PropertyOption[] = [
    { value: 'all', label: 'All Properties' },
    { value: 'prop1', label: 'Property 1' },
    { value: 'prop2', label: 'Property 2' },
    { value: 'prop3', label: 'Property 3' }
  ];

  constructor() {
    this.customReportForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      properties: ['all', Validators.required],
      metrics: [[], Validators.required]
    });
  }

  previewReport(): void {
    if (this.customReportForm.valid) {
      const formValue = this.customReportForm.value;
      const startDate = formValue.startDate;
      const endDate = formValue.endDate;
      
      if (startDate && endDate && startDate <= endDate) {
        console.log('Preview report:', formValue);
      } else {
        console.warn('Invalid date range');
      }
    }
  }

  generateReport(): void {
    if (this.customReportForm.valid) {
      const formValue = this.customReportForm.value;
      const startDate = formValue.startDate;
      const endDate = formValue.endDate;
      
      if (startDate && endDate && startDate <= endDate) {
        console.log('Generate report:', formValue);
      } else {
        console.warn('Invalid date range');
      }
    }
  }
}
