import { Component, Output, EventEmitter, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../../shared/ui/input.component';
import { ButtonComponent } from '../../../shared/ui/button.component';

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
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
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
         <legend class="eyebrow mb-3">Price range</legend>
        <div class="flex flex-col gap-3">
          <app-input
            type="number"
            placeholder="Min price"
            suffix="USD"
            [(ngModel)]="minPrice"
            (valueChange)="applyFilters()">
          </app-input>
          <app-input
            type="number"
            placeholder="Max price"
            suffix="USD"
            [(ngModel)]="maxPrice"
            (valueChange)="applyFilters()">
          </app-input>
        </div>
      </fieldset>

      <!-- Property Type -->
      <fieldset class="border-0 p-0 m-0 mb-6">
         <legend class="eyebrow mb-3">Property type</legend>
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              value="residential"
              [(ngModel)]="selectedTypes"
              (change)="applyFilters()"
              class="w-4 h-4 rounded border-[var(--line)] bg-[var(--surface-muted)] cursor-pointer accent-[var(--brand)]">
            <span class="text-sm text-[var(--ink)]">Residential</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              value="commercial"
              [(ngModel)]="selectedTypes"
              (change)="applyFilters()"
              class="w-4 h-4 rounded border-[var(--line)] bg-[var(--surface-muted)] cursor-pointer accent-[var(--brand)]">
            <span class="text-sm text-[var(--ink)]">Commercial</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              value="mixed-use"
              [(ngModel)]="selectedTypes"
              (change)="applyFilters()"
              class="w-4 h-4 rounded border-[var(--line)] bg-[var(--surface-muted)] cursor-pointer accent-[var(--brand)]">
            <span class="text-sm text-[var(--ink)]">Mixed-Use</span>
          </label>
        </div>
      </fieldset>

      <!-- Occupancy Status -->
      <fieldset class="border-0 p-0 m-0 mb-6">
         <legend class="eyebrow mb-3">Occupancy status</legend>
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              value="occupied"
              [(ngModel)]="selectedStatuses"
              (change)="applyFilters()"
              class="w-4 h-4 rounded border-[var(--line)] bg-[var(--surface-muted)] cursor-pointer accent-[var(--brand)]">
            <span class="text-sm text-[var(--ink)]">Occupied</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              value="vacant"
              [(ngModel)]="selectedStatuses"
              (change)="applyFilters()"
              class="w-4 h-4 rounded border-[var(--line)] bg-[var(--surface-muted)] cursor-pointer accent-[var(--brand)]">
            <span class="text-sm text-[var(--ink)]">Vacant</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              value="maintenance"
              [(ngModel)]="selectedStatuses"
              (change)="applyFilters()"
              class="w-4 h-4 rounded border-[var(--line)] bg-[var(--surface-muted)] cursor-pointer accent-[var(--brand)]">
            <span class="text-sm text-[var(--ink)]">Maintenance</span>
          </label>
        </div>
      </fieldset>

      <!-- Apply Button -->
      <app-button 
        variant="primary" 
        size="md"
        label="Apply Filters"
        icon="pi pi-check"
        class="w-full"
        (click)="applyFilters()">
      </app-button>
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
