import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" 
           (click)="onBackdropClick()"></div>
      
      <div class="relative bg-[var(--surface)] rounded-2xl border border-[var(--line)] 
                  shadow-2xl max-w-2xl w-full mx-4 animate-in">
        <div class="flex items-center justify-between border-b border-[var(--line)] 
                    px-6 py-5">
          <h2 class="text-lg font-semibold text-[var(--ink)]">{{ title }}</h2>
          <button (click)="close()" class="text-[var(--ink-muted)] hover:text-[var(--ink)] 
                  transition" aria-label="Close modal">
            <i class="pi pi-times text-xl"></i>
          </button>
        </div>
        
        <div class="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <ng-content></ng-content>
        </div>
        
        <div *ngIf="showFooter" class="border-t border-[var(--line)] px-6 py-4 
                  flex items-center justify-end gap-3">
          <button (click)="close()" class="btn-secondary">{{ cancelLabel }}</button>
          <button (click)="confirm()" class="btn-primary">{{ confirmLabel }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showFooter = true;
  @Input() cancelLabel = 'Cancel';
  @Input() confirmLabel = 'Confirm';
  @Input() closableBackdrop = true;
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  close(): void {
    this.onCancel.emit();
  }

  confirm(): void {
    this.onConfirm.emit();
  }

  onBackdropClick(): void {
    if (this.closableBackdrop) {
      this.close();
    }
  }
}
