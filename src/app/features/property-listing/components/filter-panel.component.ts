import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

export interface PropertyFilters {
  priceRange: { min: number; max: number };
  locations: string[];
  statuses: string[];
  types: string[];
  occupancyMin: number;
}

@Component({
  selector: 'app-filter-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, InputNumberModule, CheckboxModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="dashboard-card">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-bold text-[var(--ink)]">Filters</h3>
        <button (click)="clearFilters()"
                 class="text-xs font-bold text-[var(--brand)] hover:underline">
          Clear All
        </button>
      </div>

      <!-- Price Range -->
      <fieldset class="border-0 p-0 m-0 mb-6">
         <legend class="eyebrow mb-2">Price range</legend>
        <div class="flex flex-col sm:flex-row gap-2">
          <p-inputNumber
            [(ngModel)]="minPrice"
            placeholder="Min price"
            [useGrouping]="false"
            class="flex-1">
          </p-inputNumber>
          <p-inputNumber
            [(ngModel)]="maxPrice"
            placeholder="Max price"
            [useGrouping]="false"
            class="flex-1">
          </p-inputNumber>
        </div>
      </fieldset>

      <!-- Property Type -->
      <fieldset class="border-0 p-0 m-0 mb-6">
         <legend class="eyebrow mb-3">Property type</legend>
        <div class="space-y-2">
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedTypes"
              value="residential"
              [binary]="false">
            </p-checkbox>
             <label class="ml-2 text-xs text-[var(--ink-muted)]">Residential</label>
          </div>
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedTypes"
              value="commercial"
              [binary]="false">
            </p-checkbox>
             <label class="ml-2 text-xs text-[var(--ink-muted)]">Commercial</label>
          </div>
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedTypes"
              value="mixed-use"
              [binary]="false">
            </p-checkbox>
             <label class="ml-2 text-xs text-[var(--ink-muted)]">Mixed-Use</label>
          </div>
        </div>
      </fieldset>

      <!-- Occupancy Status -->
      <fieldset class="border-0 p-0 m-0 mb-6">
         <legend class="eyebrow mb-3">Occupancy status</legend>
        <div class="space-y-2">
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedStatuses"
              value="occupied"
              [binary]="false">
            </p-checkbox>
             <label class="ml-2 text-xs text-[var(--ink-muted)]">Occupied</label>
          </div>
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedStatuses"
              value="vacant"
              [binary]="false">
            </p-checkbox>
             <label class="ml-2 text-xs text-[var(--ink-muted)]">Vacant</label>
          </div>
          <div class="flex items-center">
            <p-checkbox
              [(ngModel)]="selectedStatuses"
              value="maintenance"
              [binary]="false">
            </p-checkbox>
             <label class="ml-2 text-xs text-[var(--ink-muted)]">Maintenance</label>
          </div>
        </div>
      </fieldset>

      <!-- Apply Button -->
      <p-button
        label="Apply Filters"
        icon="pi pi-check"
        (click)="applyFilters()"
        class="w-full">
      </p-button>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class FilterPanelComponent {
  @Output() filtersApplied = new EventEmitter<PropertyFilters>();
  @Output() filtersCleared = new EventEmitter<void>();

  minPrice = signal<number>(0);
  maxPrice = signal<number>(10000000);
  selectedTypes = signal<string[]>([]);
  selectedStatuses = signal<string[]>([]);

  applyFilters(): void {
    const filters: PropertyFilters = {
      priceRange: {
        min: this.minPrice(),
        max: this.maxPrice()
      },
      types: this.selectedTypes(),
      statuses: this.selectedStatuses(),
      locations: [],
      occupancyMin: 0
    };
    this.filtersApplied.emit(filters);
  }

  clearFilters(): void {
    this.minPrice.set(0);
    this.maxPrice.set(10000000);
    this.selectedTypes.set([]);
    this.selectedStatuses.set([]);
    this.filtersCleared.emit();
  }
}
