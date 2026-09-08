import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  group?: string;
}

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  }],
  template: `
    <div class="w-full">
      <label *ngIf="label" class="block text-sm font-medium text-[var(--ink)] mb-2">
        {{ label }}
        <span *ngIf="required" class="text-rose-600">*</span>
      </label>
      <div class="relative">
        <button 
          (click)="toggleOpen()"
          [class]="getButtonClasses()">
          <span class="flex-1 text-left">
            {{ selectedLabel || placeholder }}
          </span>
          <i [class]="'pi pi-chevron-down' + (isOpen() ? ' rotate-180' : '')"></i>
        </button>
        
        <div *ngIf="isOpen()" class="animate-in absolute top-12 left-0 right-0 z-50 
                    overflow-hidden rounded-2xl border border-[var(--line)] 
                    bg-[var(--surface)] p-1.5 shadow-xl">
          <button 
            *ngFor="let option of options"
            [disabled]="option.disabled"
            (click)="selectOption(option)"
            class="w-full flex items-center rounded-xl px-3 py-2.5 text-left text-sm 
                    transition disabled:opacity-50 disabled:cursor-not-allowed"
            [class.hover:bg-[var(--surface-muted)]]="!option.disabled"
            [class.bg-[var(--brand-soft)]]="selectedValue === option.value"
            [class.text-[var(--brand-dark)]]="selectedValue === option.value"
            [class.text-[var(--ink)]]="selectedValue !== option.value && !option.disabled"
            [class.text-[var(--ink-muted)]]="option.disabled">
            {{ option.label }}
          </button>
        </div>
      </div>
      <p *ngIf="error" class="mt-1 text-xs text-rose-600">{{ error }}</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() options: SelectOption[] = [];
  @Input() label?: string;
  @Input() placeholder = 'Select an option...';
  @Input() error?: string;
  @Input() required = false;
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<any>();

  isOpen = signal(false);
  selectedValue: any = null;
  selectedLabel = '';

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  toggleOpen(): void {
    if (!this.disabled) {
      this.isOpen.update(v => !v);
    }
  }

  selectOption(option: SelectOption): void {
    if (!option.disabled) {
      this.selectedValue = option.value;
      this.selectedLabel = option.label;
      this.onChange(this.selectedValue);
      this.valueChange.emit(this.selectedValue);
      this.isOpen.set(false);
    }
  }

  getButtonClasses(): string {
    return 'w-full min-h-11 flex items-center justify-between gap-2 rounded-xl ' +
           'border border-[var(--line)] bg-[var(--surface-muted)] px-4 py-2.5 text-sm ' +
           'transition ' + (this.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--brand)]');
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    const option = this.options.find(o => o.value === value);
    this.selectedLabel = option?.label || '';
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
