import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RadioOption {
  label: string;
  value: any;
  disabled?: boolean;
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-2">
      <label *ngFor="let option of options"
             class="flex items-center gap-2 cursor-pointer"
             [class.opacity-50]="option.disabled">
        <input 
          type="radio"
          [value]="option.value"
          [checked]="selectedValue === option.value"
          [disabled]="option.disabled"
          (change)="selectOption(option)"
          class="w-4 h-4 cursor-pointer accent-[var(--brand-dark)]">
        <span class="text-sm text-[var(--ink)]">
          {{ option.label }}
        </span>
      </label>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class RadioComponent {
  @Input() options: RadioOption[] = [];
  @Input() selectedValue: any = null;
  @Output() valueChange = new EventEmitter<any>();

  selectOption(option: RadioOption): void {
    if (!option.disabled) {
      this.selectedValue = option.value;
      this.valueChange.emit(this.selectedValue);
    }
  }
}
