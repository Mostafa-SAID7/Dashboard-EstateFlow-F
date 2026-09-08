import { Component, OnInit, ChangeDetectionStrategy, inject, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Property } from '../../models/property.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="animate-in space-y-6">
      <!-- Header -->
      <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p class="eyebrow mb-2">Portfolio overview</p><h1 class="font-display text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">Property map</h1><p class="mt-1 text-sm text-[var(--ink-muted)]">Explore your portfolio geographically.</p></div>
        <span class="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-[10px] font-bold text-[var(--brand)]">{{ properties().length }} properties</span>
      </div>

      <!-- Controls -->
      <div class="dashboard-card flex flex-wrap gap-2">
        <button (click)="toggleMarkerView()"
                 class="rounded-full px-4 py-2 text-xs font-semibold transition"
                 [ngClass]="viewMode() === 'markers' ? 'bg-[var(--brand-dark)] text-white' : 'border border-[var(--line)] text-[var(--ink-muted)] hover:text-[var(--ink)]'">
           <i class="pi pi-map-marker mr-2"></i>Markers
        </button>
        <button (click)="toggleHeatmapView()"
                 class="rounded-full px-4 py-2 text-xs font-semibold transition"
                 [ngClass]="viewMode() === 'heatmap' ? 'bg-[var(--brand-dark)] text-white' : 'border border-[var(--line)] text-[var(--ink-muted)] hover:text-[var(--ink)]'">
           <i class="pi pi-chart-bar mr-2"></i>Heatmap
        </button>
        <button (click)="centerMap()"
                 class="btn-secondary !px-4 !py-2 !text-xs">
           <i class="pi pi-compass mr-2"></i>Center map
        </button>
      </div>

      <!-- Map Container -->
      <div #mapContainer class="surface-card overflow-hidden" style="height: 600px;">
        <!-- Map will be rendered here -->
      </div>

      <!-- Selected Property Info -->
       <div *ngIf="selectedProperty()" class="dashboard-card">
         <h3 class="mb-4 text-base font-bold text-[var(--ink)]">Selected property</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
             <p class="eyebrow">Address</p>
             <p class="mt-1 text-sm font-semibold text-[var(--ink)]">{{ selectedProperty()!.address.street }}</p>
          </div>
          <div>
             <p class="eyebrow">Status</p>
             <p class="mt-1 text-sm font-semibold" [ngClass]="selectedProperty()!.status === 'active' ? 'text-[var(--brand)]' : 'text-rose-600 dark:text-rose-300'">
              {{ selectedProperty()!.status | titlecase }}
            </p>
          </div>
          <div>
             <p class="eyebrow">Monthly revenue</p>
             <p class="mt-1 text-sm font-semibold text-[var(--brand)]">{{ selectedProperty()!.monthlyRevenue | currency }}</p>
          </div>
          <div>
             <p class="eyebrow">ROI</p>
             <p class="mt-1 text-sm font-semibold text-[var(--ink)]">{{ selectedProperty()!.roi | number: '1.1-1' }}%</p>
          </div>
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
export class MapComponent implements OnInit, AfterViewInit {
  private store = inject(Store);

  @ViewChild('mapContainer') mapContainer!: ElementRef;

  properties = signal<Property[]>([]);
  selectedProperty = signal<Property | null>(null);
  viewMode = signal<'markers' | 'heatmap'>('markers');

  private map: L.Map | null = null;
  private markers: L.Marker[] = [];
  private heatmapLayer: L.Layer | null = null;

  ngOnInit(): void {
    this.loadProperties();
  }

  ngAfterViewInit(): void {
    this.initializeMap();
  }

  private loadProperties(): void {
    this.store.select(state => (state as any).properties?.items || [])
      .subscribe(properties => {
        this.properties.set(properties);
        if (this.map) {
          this.updateMapMarkers();
        }
      });
  }

  private initializeMap(): void {
    if (!this.mapContainer) return;

    // Initialize Leaflet map
    this.map = L.map(this.mapContainer.nativeElement).setView([39.8283, -98.5795], 4);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.updateMapMarkers();
  }

  private updateMapMarkers(): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach(marker => this.map!.removeLayer(marker));
    this.markers = [];

    // Add new markers
    this.properties().forEach(property => {
      if (property.coordinates?.lat && property.coordinates?.lng) {
        const marker = L.marker([property.coordinates.lat, property.coordinates.lng])
          .bindPopup(`
            <div class="p-2">
              <h4 class="font-semibold">${property.address?.street}</h4>
              <p class="text-sm">${property.status}</p>
            </div>
          `)
          .addTo(this.map!);

        marker.on('click', () => {
          this.selectedProperty.set(property);
        });

        this.markers.push(marker);
      }
    });

    // Fit bounds to all markers
    if (this.markers.length > 0) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  toggleMarkerView(): void {
    this.viewMode.set('markers');
    if (this.heatmapLayer && this.map) {
      this.map.removeLayer(this.heatmapLayer);
    }
    this.updateMapMarkers();
  }

  toggleHeatmapView(): void {
    this.viewMode.set('heatmap');
    // Heatmap implementation would go here
    // This would require leaflet-heat plugin
  }

  centerMap(): void {
    if (this.map && this.markers.length > 0) {
      const group = new L.FeatureGroup(this.markers);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }
}
