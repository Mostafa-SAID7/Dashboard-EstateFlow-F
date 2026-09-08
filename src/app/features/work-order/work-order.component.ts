import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { BadgeModule } from 'primeng/badge';
import { InputTextarea } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonComponent } from '../../shared/ui/button.component';
import { WorkOrderService } from '../../services/work-order.service';
import { selectWorkOrders, selectWorkOrdersLoading } from '../../store/work-orders/work-orders.selectors';
import { loadWorkOrders } from '../../store/work-orders/work-orders.actions';

@Component({
  selector: 'app-work-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    SelectModule,
    BadgeModule,
    InputTextModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    ButtonComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in space-y-6">
        <!-- Header -->
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p class="eyebrow mb-2">Operations queue</p>
            <h1 class="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">Work orders</h1>
            <p class="mt-1 text-sm text-[var(--ink-muted)]">Keep maintenance requests moving from open to complete.</p>
          </div>
          <button (click)="openCreateForm()" class="btn-primary"><i class="pi pi-plus text-xs"></i> Create work order</button>
        </div>

        <!-- Create Form Dialog -->
        <p-dialog
          [(visible)]="showCreateForm"
          header="Create Work Order"
          [modal]="true"
          [style]="{ width: '50vw' }">
          <form [formGroup]="workOrderForm" (ngSubmit)="submitWorkOrder()" class="space-y-4">
          <div>
            <p class="eyebrow mb-2 block">Property</p>
            <p-select
              id="propertyId"
              formControlName="propertyId"
              [options]="propertyOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select Property"
              [showClear]="true">
            </p-select>
          </div>
            <div class="field">
               <label for="description" class="eyebrow mb-2 block">Description</label>
              <textarea pInputTextarea
                id="description"
                formControlName="description"
                placeholder="Enter work order description"
                rows="4"
                class="w-full">
              </textarea>
            </div>
            <div class="field">
               <label for="priority" class="eyebrow mb-2 block">Priority</label>
              <p-select
                id="priority"
                formControlName="priority"
                [options]="priorityOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Select Priority">
              </p-select>
            </div>
            <div class="field">
               <label for="estimatedCost" class="eyebrow mb-2 block">Estimated cost</label>
              <input pInputText
                id="estimatedCost"
                type="number"
                formControlName="estimatedCost"
                placeholder="0.00"
                class="w-full">
            </div>
            <div class="flex gap-4 pt-4">
              <app-button
                variant="primary"
                type="submit"
                label="Create"
                [disabled]="!workOrderForm.valid">
              </app-button>
              <app-button
                variant="secondary"
                label="Cancel"
                (click)="closeCreateForm()">
              </app-button>
            </div>
          </form>
        </p-dialog>

        <!-- Work Orders List -->
        <div class="data-table">
        <p-table [value]="(workOrders$ | async) || []" [tableStyle]="{ 'min-width': '50rem' }">
          <ng-template pTemplate="header">
            <tr>
              <th pSortableColumn="id">ID <p-sortIcon field="id"></p-sortIcon></th>
              <th pSortableColumn="propertyAddress">Property <p-sortIcon field="propertyAddress"></p-sortIcon></th>
              <th pSortableColumn="description">Description <p-sortIcon field="description"></p-sortIcon></th>
              <th pSortableColumn="priority">Priority <p-sortIcon field="priority"></p-sortIcon></th>
              <th pSortableColumn="status">Status <p-sortIcon field="status"></p-sortIcon></th>
              <th pSortableColumn="estimatedCost">Cost <p-sortIcon field="estimatedCost"></p-sortIcon></th>
              <th>Actions</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-order>
            <tr>
              <td>{{ order.id }}</td>
              <td>{{ order.propertyAddress }}</td>
              <td>{{ order.description }}</td>
              <td>
                <p-badge [value]="order.priority" [severity]="getPrioritySeverity(order.priority)"></p-badge>
              </td>
              <td>
                <p-badge [value]="order.status" [severity]="getStatusSeverity(order.status)"></p-badge>
              </td>
              <td>{{ order.estimatedCost | currency }}</td>
              <td>
                <div class="flex gap-2">
                  <app-button
                    variant="ghost"
                    size="sm"
                    icon="pi pi-pencil"
                    ariaLabel="Edit work order"
                    (click)="editWorkOrder(order)">
                  </app-button>
                  <app-button
                    variant="danger"
                    size="sm"
                    icon="pi pi-trash"
                    ariaLabel="Delete work order"
                    (click)="deleteWorkOrder(order)">
                  </app-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
        </div>
      </div>
  `
})
export class WorkOrderComponent implements OnInit {
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private workOrderService = inject(WorkOrderService);

  workOrders$: Observable<any[]>;
  isLoading$: Observable<boolean>;
  workOrderForm: FormGroup;
  showCreateForm = signal<boolean>(false);

  propertyOptions = [
    { value: 'prop1', label: 'Property 1' },
    { value: 'prop2', label: 'Property 2' },
    { value: 'prop3', label: 'Property 3' }
  ];

  priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  constructor() {
    this.workOrders$ = this.store.select(selectWorkOrders);
    this.isLoading$ = this.store.select(selectWorkOrdersLoading);
    this.workOrderForm = this.fb.group({
      propertyId: ['', Validators.required],
      description: ['', Validators.required],
      priority: ['medium', Validators.required],
      estimatedCost: [0, Validators.required]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadWorkOrders());
  }

  openCreateForm(): void {
    this.showCreateForm.set(true);
  }

  closeCreateForm(): void {
    this.showCreateForm.set(false);
    this.workOrderForm.reset();
  }

  submitWorkOrder(): void {
    if (this.workOrderForm.valid) {
      // Dispatch action to create work order
      this.closeCreateForm();
    }
  }

  editWorkOrder(order: any): void {
    // Handle edit action
    console.log('Edit work order:', order);
  }

  deleteWorkOrder(order: any): void {
    // Handle delete action
    console.log('Delete work order:', order);
  }

  getPrioritySeverity(priority: string): 'info' | 'warn' | 'danger' | 'success' {
    const severityMap: { [key: string]: 'info' | 'warn' | 'danger' | 'success' } = {
      low: 'info',
      medium: 'warn',
      high: 'danger',
      urgent: 'danger'
    };
    return severityMap[priority] || 'info';
  }

  getStatusSeverity(status: string): 'info' | 'warn' | 'danger' | 'success' {
    const severityMap: { [key: string]: 'info' | 'warn' | 'danger' | 'success' } = {
      assigned: 'info',
      'in-progress': 'warn',
      completed: 'success',
      cancelled: 'danger'
    };
    return severityMap[status] || 'info';
  }
}
