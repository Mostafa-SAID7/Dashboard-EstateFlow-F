import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tenant } from '../../../models/tenant.model';
import { ButtonComponent } from '../../../shared/ui/button.component';
import { TooltipComponent } from '../../../shared/ui/tooltip.component';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, TooltipComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="data-table">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[var(--line)]">
              <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Name</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Email</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Phone</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">City</th>
              <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let tenant of tenants; let last = last" 
                [ngClass]="!last ? 'border-b border-[var(--line)]' : ''">
              <td class="px-4 py-3 text-sm text-[var(--ink)] font-medium">{{ tenant.name }}</td>
              <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ tenant.email }}</td>
              <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ tenant.phone }}</td>
              <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ tenant.address.city }}</td>
              <td class="px-4 py-3">
                <app-tooltip text="View tenant details" position="top">
                  <app-button
                    variant="ghost"
                    size="sm"
                    icon="pi pi-eye"
                    ariaLabel="View tenant details"
                    (click)="viewTenant(tenant)">
                  </app-button>
                </app-tooltip>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="tenants.length === 0" class="py-12 text-center px-4">
        <i class="pi pi-inbox text-4xl text-[var(--ink-muted)] mb-4 block"></i>
        <p class="text-sm text-[var(--ink-muted)]">No tenants to display.</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class TenantListComponent {
  @Input() tenants: Tenant[] = [];
  @Output() tenantSelected = new EventEmitter<Tenant>();

  viewTenant(tenant: Tenant): void {
    this.tenantSelected.emit(tenant);
  }
}
