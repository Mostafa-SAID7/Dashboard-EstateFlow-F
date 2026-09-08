import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { BadgeModule } from 'primeng/badge';
import { Property } from '../../../models/property.model';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, FormsModule, CheckboxModule, BadgeModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="surface-card group cursor-pointer overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_-25px_rgba(8,50,35,.45)]"
         (click)="selectProperty()">
      <!-- Image -->
      <div class="relative h-48 overflow-hidden bg-[var(--surface-muted)]">
        <img *ngIf="property.photos && property.photos.length > 0"
             [src]="property.photos[0]?.url"
             alt="Property"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105">
        <div *ngIf="!property.photos || property.photos.length === 0"
             class="flex h-full w-full items-center justify-center text-[var(--ink-muted)]">
          <i class="pi pi-building text-3xl"></i>
        </div>
        
        <!-- Status Badge -->
        <div class="absolute top-3 right-3">
           <span class="rounded-full bg-[var(--surface)]/90 px-3 py-1 text-[10px] font-bold text-[var(--brand-dark)] shadow-sm dark:text-[var(--brand)]">{{ property.status | titlecase }}</span>
        </div>
      </div>

      <!-- Content -->
       <div class="p-5">
        <!-- Address -->
         <h3 class="truncate text-sm font-bold text-[var(--ink)]">
          {{ property.address.street }}
        </h3>
         <p class="text-xs text-[var(--ink-muted)]">
          {{ property.address.city }}, {{ property.address.state }}
        </p>

        <!-- Property Details -->
        <div class="grid grid-cols-2 gap-2 mt-3 text-sm">
          <div>
             <p class="text-[10px] text-[var(--ink-muted)]">Type</p>
             <p class="text-xs font-semibold text-[var(--ink)]">{{ property.type | titlecase }}</p>
          </div>
          <div>
             <p class="text-[10px] text-[var(--ink-muted)]">Size</p>
             <p class="text-xs font-semibold text-[var(--ink)]">{{ property.sizeSqft | number }} sqft</p>
          </div>
        </div>

        <!-- Financial Metrics -->
         <div class="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--line)] pt-4 text-sm">
          <div>
             <p class="text-[10px] text-[var(--ink-muted)]">Monthly Revenue</p>
             <p class="text-xs font-bold text-[var(--brand)]">
              {{ property.monthlyRevenue | currency }}
            </p>
          </div>
          <div>
             <p class="text-[10px] text-[var(--ink-muted)]">ROI</p>
             <p class="text-xs font-bold" [ngClass]="property.roi >= 0 ? 'text-[var(--brand)]' : 'text-rose-600 dark:text-rose-300'">
              {{ property.roi | number: '1.1-1' }}%
            </p>
          </div>
        </div>

        <!-- Checkbox for bulk selection -->
        <div class="mt-4 flex items-center">
          <p-checkbox
            [(ngModel)]="isSelected"
            (ngModelChange)="toggleSelection($event)"
            (click)="$event.stopPropagation()"
            [binary]="true">
          </p-checkbox>
           <label class="ml-2 text-[10px] text-[var(--ink-muted)]">Select for bulk action</label>
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
export class PropertyCardComponent {
  @Input() property!: Property;
  @Input() isSelected: boolean = false;
  @Output() propertySelected = new EventEmitter<Property>();
  @Output() selectionChanged = new EventEmitter<boolean>();

  selectProperty(): void {
    this.propertySelected.emit(this.property);
  }

  toggleSelection(value: boolean): void {
    this.selectionChanged.emit(value);
  }

  getStatusSeverity(): 'success' | 'danger' | 'warn' | 'info' {
    const severityMap: { [key: string]: 'success' | 'danger' | 'warn' | 'info' } = {
      active: 'success',
      inactive: 'danger',
      maintenance: 'warn'
    };
    return severityMap[this.property.status as keyof typeof severityMap] || 'info';
  }
}
