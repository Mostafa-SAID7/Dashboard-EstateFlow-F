import { Component, OnInit, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, Subject } from 'rxjs';
import { TenantListComponent } from './components/tenant-list.component';
import { Tenant } from '../../models/tenant.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TenantListComponent, InputTextModule, ButtonModule, MessageModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in space-y-6">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p class="eyebrow mb-2">People & leases</p>
          <h1 class="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">Tenants</h1>
          <p class="mt-1 text-sm text-[var(--ink-muted)]">Keep resident records and lease activity organized.</p>
        </div>
        <button (click)="addTenant()" class="btn-primary"><i class="pi pi-plus text-xs"></i> Add tenant</button>
      </div>

      <!-- Search and Filters -->
      <div class="dashboard-card">
        <span class="p-input-icon-left w-full">
          <i class="pi pi-search"></i>
          <input pInputText
            type="text"
            placeholder="Search by name, email, or city..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            class="input-field w-full pl-10">
        </span>
        <p class="mt-3 text-xs text-[var(--ink-muted)]">
          Showing {{ filteredTenants().length }} of {{ tenants().length }} tenants
        </p>
      </div>

      <!-- Tenant List or Empty State -->
      <div *ngIf="filteredTenants().length > 0; else noTenants">
        <app-tenant-list
          [tenants]="filteredTenants()"
          (tenantSelected)="viewTenantDetail($event)">
        </app-tenant-list>
      </div>

      <ng-template #noTenants>
        <div class="dashboard-card flex flex-col items-center justify-center py-16 text-center"><span class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]"><i class="pi pi-users"></i></span><p class="text-sm font-semibold text-[var(--ink)]">No tenants found</p><p class="mt-1 text-xs text-[var(--ink-muted)]">Start by adding a new tenant to your portfolio.</p></div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    ::ng-deep .p-input-icon-left > input {
      padding-left: 2.5rem;
    }
    ::ng-deep .p-input-icon-left > i {
      left: 0.75rem;
    }
  `]
})
export class TenantManagementComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  // Signals
  tenants = signal<Tenant[]>([]);
  filteredTenants = signal<Tenant[]>([]);
  searchQuery = signal<string>('');

  private searchSubject = new Subject<string>();

  ngOnInit(): void {
    this.loadTenants();
    this.setupSearchDebounce();
  }

  private loadTenants(): void {
    this.store.select(state => (state as any).tenants?.items || [])
      .subscribe(tenants => {
        this.tenants.set(tenants);
        this.applyFilters();
      });
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.applyFilters();
    });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.searchSubject.next(query);
  }

  applyFilters(): void {
    let filtered = this.tenants();

    // Apply search
    if (this.searchQuery().length > 0) {
      const query = this.searchQuery().toLowerCase();
      filtered = filtered.filter(t =>
        t.name?.toLowerCase().includes(query) ||
        t.email?.toLowerCase().includes(query) ||
        t.address?.city?.toLowerCase().includes(query)
      );
    }

    this.filteredTenants.set(filtered);
  }

  viewTenantDetail(tenant: Tenant): void {
    this.router.navigate(['/tenants', tenant.id]);
  }

  addTenant(): void {
    this.router.navigate(['/tenants/new']);
  }
}
