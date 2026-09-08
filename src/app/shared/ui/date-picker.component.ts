import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" class="block eyebrow mb-2">
        {{ label }}
        <span *ngIf="required" class="text-rose-600">*</span>
      </label>
      <div class="relative">
        <button
          type="button"
          (click)="toggleCalendar()"
          [disabled]="disabled"
          class="input-field w-full flex items-center justify-between text-left">
          <span [class]="selectedDate() ? 'text-[var(--ink)]' : 'text-[var(--ink-muted)]'">
            {{ selectedDate() ? formatDate(selectedDate()!) : placeholder }}
          </span>
          <i class="pi pi-calendar text-[var(--ink-muted)]"></i>
        </button>

        <!-- Calendar Dropdown -->
        <div *ngIf="showCalendar()" class="absolute top-full left-0 mt-2 z-50 bg-[var(--surface)] border border-[var(--line)] rounded-[1.25rem] shadow-lg p-4 min-w-80">
          <!-- Month/Year Navigation -->
          <div class="flex items-center justify-between mb-4">
            <button (click)="previousMonth()" type="button" class="icon-button">
              <i class="pi pi-chevron-left"></i>
            </button>
            <div class="flex items-center gap-3">
              <select [ngModel]="currentMonth()" (ngModelChange)="currentMonth.set($event); updateCalendar()" class="input-field text-sm px-2 py-1">
                <option *ngFor="let m of months; let i = index" [value]="i">{{ m }}</option>
              </select>
              <select [ngModel]="currentYear()" (ngModelChange)="currentYear.set($event); updateCalendar()" class="input-field text-sm px-2 py-1">
                <option *ngFor="let y of getYearRange()" [value]="y">{{ y }}</option>
              </select>
            </div>
            <button (click)="nextMonth()" type="button" class="icon-button">
              <i class="pi pi-chevron-right"></i>
            </button>
          </div>

          <!-- Day Labels -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div *ngFor="let day of dayLabels" class="text-center text-xs font-bold text-[var(--ink-muted)] py-2">
              {{ day }}
            </div>
          </div>

          <!-- Calendar Days -->
          <div class="grid grid-cols-7 gap-1">
            <button
              *ngFor="let day of calendarDays()"
              (click)="selectDate(day)"
              type="button"
              [disabled]="isDateDisabled(day)"
              [class]="getDateButtonClass(day)"
              class="h-9 rounded-lg text-sm font-medium transition hover:bg-[var(--brand-soft)] disabled:opacity-30 disabled:cursor-not-allowed">
              {{ day || '' }}
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 mt-4 pt-4 border-t border-[var(--line)]">
            <button (click)="clearDate()" type="button" class="btn-secondary flex-1 text-sm">Clear</button>
            <button (click)="closeCalendar()" type="button" class="btn-primary flex-1 text-sm">Done</button>
          </div>
        </div>

        <!-- Overlay to close calendar -->
        <div *ngIf="showCalendar()" (click)="closeCalendar()" class="fixed inset-0 z-40"></div>
      </div>

      <p *ngIf="error" class="mt-1 text-xs text-rose-600">{{ error }}</p>
      <p *ngIf="hint && !error" class="mt-1 text-xs text-[var(--ink-muted)]">{{ hint }}</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = 'Select date';
  @Input() error?: string;
  @Input() hint?: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Output() valueChange = new EventEmitter<Date | null>();

  showCalendar = signal(false);
  selectedDate = signal<Date | null>(null);
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  calendarDays = computed(() => this.generateCalendarDays());

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  toggleCalendar(): void {
    if (!this.disabled) {
      this.showCalendar.set(!this.showCalendar());
    }
  }

  closeCalendar(): void {
    this.showCalendar.set(false);
  }

  selectDate(day: number): void {
    if (day !== 0) {
      const date = new Date(this.currentYear(), this.currentMonth(), day);
      this.selectedDate.set(date);
      this.onChange(date);
      this.valueChange.emit(date);
      this.closeCalendar();
    }
  }

  clearDate(): void {
    this.selectedDate.set(null);
    this.onChange(null);
    this.valueChange.emit(null);
  }

  previousMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
    this.updateCalendar();
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
    this.updateCalendar();
  }

  updateCalendar(): void {
    // Trigger change detection
  }

  getYearRange(): number[] {
    const current = new Date().getFullYear();
    const range = [];
    for (let i = current - 5; i <= current + 5; i++) {
      range.push(i);
    }
    return range;
  }

  generateCalendarDays(): (number | 0)[] {
    const firstDay = new Date(this.currentYear(), this.currentMonth(), 1).getDay();
    const daysInMonth = new Date(this.currentYear(), this.currentMonth() + 1, 0).getDate();
    
    const days: (number | 0)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(0);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    // Fill remaining cells
    while (days.length % 7 !== 0) {
      days.push(0);
    }
    
    return days;
  }

  isDateDisabled(day: number): boolean {
    if (day === 0) return true;
    const date = new Date(this.currentYear(), this.currentMonth(), day);
    if (this.minDate && this.isDateBefore(date, this.minDate)) return true;
    if (this.maxDate && this.isDateAfter(date, this.maxDate)) return true;
    return false;
  }

  getDateButtonClass(day: number): string {
    if (day === 0) return '';
    
    const date = new Date(this.currentYear(), this.currentMonth(), day);
    const isSelected = this.selectedDate() && 
      date.getDate() === this.selectedDate()!.getDate() &&
      date.getMonth() === this.selectedDate()!.getMonth() &&
      date.getFullYear() === this.selectedDate()!.getFullYear();
    
    const isToday = 
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth() &&
      date.getFullYear() === new Date().getFullYear();
    
    if (isSelected) {
      return 'bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)]';
    }
    if (isToday) {
      return 'border-2 border-[var(--brand)] text-[var(--brand)]';
    }
    return 'text-[var(--ink)]';
  }

  formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  isDateBefore(date1: Date, date2: Date): boolean {
    return date1.getTime() < date2.getTime();
  }

  isDateAfter(date1: Date, date2: Date): boolean {
    return date1.getTime() > date2.getTime();
  }

  writeValue(value: Date | null): void {
    if (value) {
      this.selectedDate.set(value);
      this.currentMonth.set(value.getMonth());
      this.currentYear.set(value.getFullYear());
    }
  }

  registerOnChange(fn: (value: Date | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
