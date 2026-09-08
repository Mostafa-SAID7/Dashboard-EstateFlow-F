import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ToggleComponent),
    multi: true,
  }],
  template: `
    <button 
      (click)="toggle()"
      [class]="getToggleClasses()"
      [disabled]="disabled"
      type="button"
      [attr.aria-label]="label"
      role="switch"
      [attr.aria-checked]="enabled">
      <span class="absolute w-4 h-4 rounded-full bg-white transition-transform" 
            [class]="enabled ? 'translate-x-6' : 'translate-x-0.5'"></span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ToggleComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() enabled = false;
  @Input() disabled = false;
  @Output() enabledChange = new EventEmitter<boolean>();

  private onChangeFn: (value: boolean) => void = () => {};
  private onTouchedFn: () => void = () => {};

  toggle(): void {
    if (!this.disabled) {
      this.enabled = !this.enabled;
      this.onChangeFn(this.enabled);
      this.enabledChange.emit(this.enabled);
    }
  }

  getToggleClasses(): string {
    return `relative inline-flex w-14 h-7 rounded-full transition cursor-pointer ${
      this.enabled ? 'bg-[var(--brand-dark)]' : 'bg-[var(--surface-muted)]'
    } ${this.disabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  }

  writeValue(value: boolean): void {
    this.enabled = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
