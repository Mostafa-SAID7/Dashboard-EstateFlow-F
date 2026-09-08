import { Component, Input, Output, EventEmitter, signal, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownItem {
  label: string;
  value: any;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-block">
      <button 
        (click)="toggleOpen()"
        [class]="getTriggerClasses()">
        <i *ngIf="icon" [class]="'pi ' + icon"></i>
        <span>{{ label }}</span>
        <i class="pi pi-chevron-down ml-1"></i>
      </button>
      
      <div *ngIf="isOpen()" class="animate-in absolute right-0 top-12 z-50 w-56 
                  overflow-hidden rounded-2xl border border-[var(--line)] 
                  bg-[var(--surface)] p-1.5 shadow-xl">
        <button 
          *ngFor="let item of items; let last = last"
          [disabled]="item.disabled"
          [class.border-b]="!last && !item.divider"
          [class.border-[var(--line)]]="!last && !item.divider"
          (click)="selectItem(item)"
          class="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm 
                  transition disabled:opacity-50 disabled:cursor-not-allowed"
          [class.hover:bg-[var(--surface-muted)]]="!item.disabled"
          [class.text-[var(--ink)]]="!item.disabled"
          [class.text-[var(--ink-muted)]]="item.disabled">
          <i *ngIf="item.icon" [class]="'pi ' + item.icon + ' text-[var(--ink-muted)]'"></i>
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class DropdownComponent {
  @Input() items: DropdownItem[] = [];
  @Input() label = 'Menu';
  @Input() icon?: string;
  @Output() itemSelected = new EventEmitter<DropdownItem>();

  isOpen = signal(false);

  toggleOpen(): void {
    this.isOpen.update(v => !v);
  }

  selectItem(item: DropdownItem): void {
    if (!item.disabled) {
      this.itemSelected.emit(item);
      this.isOpen.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('[class*="dropdown"]')) {
      this.isOpen.set(false);
    }
  }

  getTriggerClasses(): string {
    return 'inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium ' +
           'bg-[var(--surface-muted)] text-[var(--ink)] transition hover:bg-[var(--surface)] ' +
           'border border-[var(--line)]';
  }
}
