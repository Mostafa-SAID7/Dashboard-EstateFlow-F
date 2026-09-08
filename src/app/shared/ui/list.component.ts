import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ListItem {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-1">
      <button 
        *ngFor="let item of items"
        (click)="selectItem(item)"
        [disabled]="item.disabled"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition 
               border border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        [class.bg-[var(--brand-soft)]]="item.selected"
        [class.hover:bg-[var(--surface-muted)]]="!item.selected && !item.disabled"
        [class.text-[var(--brand-dark)]]="item.selected"
        [class.text-[var(--ink)]]="!item.selected">
        <i *ngIf="item.icon" [class]="'pi ' + item.icon + ' flex-shrink-0'"></i>
        <div class="flex-1 min-w-0">
          <p class="font-medium truncate">{{ item.title }}</p>
          <p *ngIf="item.subtitle" class="text-xs text-[var(--ink-muted)] truncate">
            {{ item.subtitle }}
          </p>
        </div>
      </button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ListComponent {
  @Input() items: ListItem[] = [];
  @Output() itemSelected = new EventEmitter<ListItem>();

  selectItem(item: ListItem): void {
    if (!item.disabled) {
      this.itemSelected.emit(item);
    }
  }
}
