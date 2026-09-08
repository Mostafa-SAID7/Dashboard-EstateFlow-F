import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Tenant } from '../../../models/tenant.model';

@Component({
  selector: 'app-tenant-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="surface-card overflow-hidden">
    <p-table [value]="tenants" [tableStyle]="{ 'min-width': '50rem' }">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="name">Name <p-sortIcon field="name"></p-sortIcon></th>
          <th pSortableColumn="email">Email <p-sortIcon field="email"></p-sortIcon></th>
          <th pSortableColumn="phone">Phone <p-sortIcon field="phone"></p-sortIcon></th>
          <th pSortableColumn="address.city">City <p-sortIcon field="address.city"></p-sortIcon></th>
          <th>Actions</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-tenant>
        <tr>
          <td>{{ tenant.name }}</td>
          <td>{{ tenant.email }}</td>
          <td>{{ tenant.phone }}</td>
          <td>{{ tenant.address.city }}</td>
          <td>
            <p-button
              icon="pi pi-eye"
              [rounded]="true"
              [text]="true"
              severity="info"
              (click)="viewTenant(tenant)"
              pTooltip="View Details"
              tooltipPosition="top">
            </p-button>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="5" class="text-center py-4">
            <p class="text-[var(--ink-muted)]">No tenants found</p>
          </td>
        </tr>
      </ng-template>
    </p-table>
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
