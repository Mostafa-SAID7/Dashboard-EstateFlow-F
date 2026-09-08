import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type InputType = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="w-full">
      <label *ngIf="label" class="block text-sm font-medium text-[var(--ink)] mb-2">
        {{ label }}
        <span *ngIf="required" class="text-rose-600">*</span>
      </label>
      <div class="relative">
        <i *ngIf="icon" [class]="'pi ' + icon + ' absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]'"></i>
        <input
          class="input-field w-full"
          [class.pl-11]="icon"
          [type]="type"
          [value]="value"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [attr.aria-label]="ariaLabel"
          (input)="onInput($event)"
          (blur)="onBlur()">
        <span *ngIf="suffix" class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--ink-muted)]">
          {{ suffix }}
        </span>
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
export class InputComponent implements ControlValueAccessor {
  @Input() type: InputType = 'text';
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() icon?: string;
  @Input() suffix?: string;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() ariaLabel?: string;
  @Output() valueChange = new EventEmitter<string>();

  value = '';
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
