import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { PhotoGalleryComponent } from './components/photo-gallery.component';
import { TimelineComponent, TimelineEvent } from './components/timeline.component';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PhotoGalleryComponent, TimelineComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in space-y-6">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <button (click)="goBack()"
                  class="mb-2 text-xs font-bold text-[var(--brand)] hover:underline">
            <i class="pi pi-arrow-left mr-2"></i>Back to properties
          </button>
          <h1 class="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">Property details</h1>
        </div>
        <button (click)="toggleEdit()"
                class="btn-primary">
          <i class="pi pi-pencil text-xs"></i>{{ isEditing() ? 'Cancel' : 'Edit property' }}
        </button>
      </div>

      <div *ngIf="property()" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Property Info Card -->
           <div class="dashboard-card">
             <h2 class="font-display text-2xl font-bold tracking-tight text-[var(--ink)]">
              {{ property()!.address.street }}
            </h2>
             <p class="mb-6 text-sm text-[var(--ink-muted)]">
              {{ property()!.address.city }}, {{ property()!.address.state }} {{ property()!.address.zipCode }}
            </p>

            <!-- Property Details Grid -->
             <div class="mb-6 grid grid-cols-2 gap-5">
              <div>
                 <p class="eyebrow">Property type</p>
                 <p class="mt-1 text-sm font-semibold text-[var(--ink)]">{{ property()!.type | titlecase }}</p>
              </div>
              <div>
                 <p class="eyebrow">Year built</p>
                 <p class="mt-1 text-sm font-semibold text-[var(--ink)]">{{ property()!.yearBuilt }}</p>
              </div>
              <div>
                 <p class="eyebrow">Square feet</p>
                 <p class="mt-1 text-sm font-semibold text-[var(--ink)]">{{ property()!.sizeSqft | number }}</p>
              </div>
              <div>
                 <p class="eyebrow">Status</p>
                 <p class="mt-1 text-sm font-semibold" [ngClass]="property()!.status === 'active' ? 'text-[var(--brand)]' : 'text-rose-600'">
                  {{ property()!.status | titlecase }}
                </p>
              </div>
            </div>

            <!-- Financial Metrics -->
             <div class="border-t border-[var(--line)] pt-6">
               <h3 class="mb-4 text-base font-bold text-[var(--ink)]">Financial metrics</h3>
              <div class="grid grid-cols-2 gap-6">
                <div>
                   <p class="eyebrow">Monthly revenue</p>
                   <p class="mt-1 font-display text-xl font-bold text-[var(--brand)]">{{ property()!.monthlyRevenue | currency }}</p>
                </div>
                <div>
                   <p class="eyebrow">Annual revenue</p>
                   <p class="mt-1 font-display text-xl font-bold text-[var(--brand)]">{{ (property()!.monthlyRevenue * 12) | currency }}</p>
                </div>
                <div>
                   <p class="eyebrow">ROI</p>
                   <p class="mt-1 font-display text-xl font-bold" [ngClass]="property()!.roi >= 0 ? 'text-[var(--brand)]' : 'text-rose-600'">
                    {{ property()!.roi | number: '1.1-1' }}%
                  </p>
                </div>
                <div>
                   <p class="eyebrow">Occupancy rate</p>
                   <p class="mt-1 font-display text-xl font-bold text-[var(--ink)]">{{ property()!.occupancyRate | number: '1.1-1' }}%</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Photo Gallery -->
          <app-photo-gallery
            [photos]="property()!.photos || []"
            (photoUploaded)="uploadPhoto($event)"
            (photoDeleted)="deletePhoto($event)">
          </app-photo-gallery>

          <!-- Timeline -->
          <app-timeline
            [events]="timelineEvents()">
          </app-timeline>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Manager Info -->
           <div class="dashboard-card">
             <h3 class="mb-4 text-base font-bold text-[var(--ink)]">Manager</h3>
            <div class="space-y-3">
              <div>
                 <p class="eyebrow">Manager ID</p>
                 <p class="mt-1 text-sm font-semibold text-[var(--ink)]">{{ property()!.managerId }}</p>
              </div>
               <button class="btn-primary w-full">
                Contact Manager
              </button>
            </div>
          </div>

          <!-- Owner Info -->
           <div class="dashboard-card">
             <h3 class="mb-4 text-base font-bold text-[var(--ink)]">Owner</h3>
            <div class="space-y-3">
              <div>
                 <p class="eyebrow">Owner ID</p>
                 <p class="mt-1 text-sm font-semibold text-[var(--ink)]">{{ property()!.ownerId }}</p>
              </div>
               <button class="btn-primary w-full">
                Contact Owner
              </button>
            </div>
          </div>

          <!-- Quick Actions -->
           <div class="dashboard-card">
             <h3 class="mb-4 text-base font-bold text-[var(--ink)]">Quick actions</h3>
            <div class="space-y-2">
               <button class="btn-secondary w-full !text-xs">
                Create Work Order
              </button>
               <button class="btn-secondary w-full !text-xs">
                View Maintenance History
              </button>
               <button class="btn-secondary w-full !text-xs">
                View Payment History
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
       <div *ngIf="!property()" class="dashboard-card py-16 text-center">
         <p class="text-sm text-[var(--ink-muted)]">Loading property details...</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PropertyDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private store = inject(Store);
  private propertyService = inject(PropertyService);
  private fb = inject(FormBuilder);

  property = signal<Property | null>(null);
  isEditing = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  timelineEvents = signal<TimelineEvent[]>([]);
  propertyForm!: FormGroup;

  ngOnInit(): void {
    this.loadProperty();
  }

  private loadProperty(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.store.select(state => {
        const props = (state as any).properties?.items || [];
        return props.find((p: Property) => p.id === propertyId);
      }).subscribe(property => {
        if (property) {
          this.property.set(property);
          this.generateTimeline(property);
        }
      });
    }
  }

  private generateTimeline(property: Property): void {
    const events: TimelineEvent[] = [
      {
        id: '1',
        title: 'Property Created',
        description: `Property added to portfolio`,
        timestamp: new Date(property.createdAt || new Date()),
        type: 'other',
        icon: '📝'
      }
    ];

    if (property.status === 'active') {
      events.push({
        id: '2',
        title: 'Property Active',
        description: 'Property is currently active',
        timestamp: new Date(),
        type: 'occupancy',
        icon: '👥'
      });
    }

    this.timelineEvents.set(events);
  }

  toggleEdit(): void {
    this.isEditing.set(!this.isEditing());
  }

  uploadPhoto(file: File): void {
    console.log('Uploading photo:', file.name);
    // Implementation would upload to backend
  }

  deletePhoto(photoId: string): void {
    console.log('Deleting photo:', photoId);
    // Implementation would delete from backend
  }

  goBack(): void {
    this.router.navigate(['/properties']);
  }
}
