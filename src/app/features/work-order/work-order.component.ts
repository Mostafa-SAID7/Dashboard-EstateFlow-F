import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ButtonComponent } from '../../shared/ui/button.component';
import { SelectComponent } from '../../shared/ui/select.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { TooltipComponent } from '../../shared/ui/tooltip.component';
import { InputComponent } from '../../shared/ui/input.component';
import { WorkOrderService } from '../../services/work-order.service';
import { selectWorkOrders, selectWorkOrdersLoading } from '../../store/work-orders/work-orders.selectors';
import { loadWorkOrders } from '../../store/work-orders/work-orders.actions';

@Component({
  selector: 'app-work-order',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    SelectComponent,
    ModalComponent,
    TooltipComponent,
    InputComponent
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
        <app-button 
          variant="primary" 
          size="md"
          icon="pi pi-plus" 
          label="Create work order"
          (click)="openCreateForm()">
        </app-button>
      </div>

      <!-- Create Form Modal -->
      <app-modal
        [isOpen]="showCreateForm()"
        title="Create Work Order"
        (onCancel)="closeCreateForm()">
        <form [formGroup]="workOrderForm" (ngSubmit)="submitWorkOrder()" class="space-y-4">
          <!-- Property Selection -->
          <div class="field">
            <label class="block eyebrow mb-2">Property</label>
            <app-select
              formControlName="propertyId"
              [options]="propertyOptions"
              placeholder="Select Property"
              [error]="getFieldError('propertyId')">
            </app-select>
          </div>

          <!-- Description -->
          <div class="field">
            <label for="description" class="block eyebrow mb-2">Description</label>
            <textarea
              id="description"
              formControlName="description"
              placeholder="Enter work order description"
              rows="4"
              class="w-full px-3 py-2 border border-[var(--line)] rounded-md text-sm text-[var(--ink)] placeholder-[var(--ink-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent">
            </textarea>
            <p *ngIf="getFieldError('description')" class="mt-1 text-xs text-rose-600 font-medium">
              {{ getFieldError('description') }}
            </p>
          </div>

          <!-- Priority -->
          <div class="field">
            <label class="block eyebrow mb-2">Priority</label>
            <app-select
              formControlName="priority"
              [options]="priorityOptions"
              placeholder="Select Priority"
              [error]="getFieldError('priority')">
            </app-select>
          </div>

          <!-- Estimated Cost -->
          <div class="field">
            <app-input
              type="number"
              label="Estimated cost"
              placeholder="0.00"
              suffix="USD"
              formControlName="estimatedCost"
              [error]="getFieldError('estimatedCost')">
            </app-input>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4 border-t border-[var(--line)]">
            <app-button
              variant="primary"
              size="md"
              type="submit"
              label="Create"
              [disabled]="!workOrderForm.valid">
            </app-button>
            <app-button
              variant="secondary"
              size="md"
              label="Cancel"
              (click)="closeCreateForm()">
            </app-button>
          </div>
        </form>
      </app-modal>

      <!-- Work Orders List -->
      <div class="data-table">
        <div class="border-b border-[var(--line)] px-5 py-4">
          <p class="eyebrow mb-2">Operations queue</p>
          <h2 class="mt-1 text-base font-bold text-[var(--ink)]">Work orders</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-[var(--line)]">
                <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">ID</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Property</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Description</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Priority</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Status</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Cost</th>
                <th class="px-4 py-3 text-left text-sm font-semibold text-[var(--ink)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of (workOrders$ | async) || []; let last = last" 
                  [ngClass]="!last ? 'border-b border-[var(--line)]' : ''">
                <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ order.id }}</td>
                <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ order.propertyAddress }}</td>
                <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ order.description }}</td>
                <td class="px-4 py-3">
                  <span [ngClass]="getPriorityClass(order.priority)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ order.priority }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <span [ngClass]="getStatusClass(order.status)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-[var(--ink)]">{{ order.estimatedCost | currency }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <app-tooltip text="Edit work order" position="top">
                      <app-button
                        variant="ghost"
                        size="sm"
                        icon="pi pi-pencil"
                        ariaLabel="Edit work order"
                        (click)="editWorkOrder(order)">
                      </app-button>
                    </app-tooltip>
                    <app-tooltip text="Delete work order" position="top">
                      <app-button
                        variant="danger"
                        size="sm"
                        icon="pi pi-trash"
                        ariaLabel="Delete work order"
                        (click)="deleteWorkOrder(order)">
                      </app-button>
                    </app-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="(workOrders$ | async)?.length === 0" class="py-12 text-center">
          <i class="pi pi-inbox text-4xl text-[var(--ink-muted)] mb-4 block"></i>
          <p class="text-sm text-[var(--ink-muted)]">No work orders yet. Create one to get started.</p>
        </div>
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

  getFieldError(fieldName: string): string {
    const field = this.workOrderForm.get(fieldName);
    if (field?.hasError('required') && field?.touched) {
      return 'This field is required';
    }
    return '';
  }

  getPriorityClass(priority: string): string {
    const classMap: { [key: string]: string } = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-amber-100 text-amber-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return classMap[priority] || 'bg-gray-100 text-gray-800';
  }

  getStatusClass(status: string): string {
    const classMap: { [key: string]: string } = {
      assigned: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-amber-100 text-amber-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return classMap[status] || 'bg-gray-100 text-gray-800';
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
